(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const ERROR_PREFIX = "[ERROR] ";
const ERROR_MESSAGES = Object.freeze({
  INVALID_INPUT: ERROR_PREFIX + "입력값이 유효하지 않습니다\n",
  BLANK_INPUT: ERROR_PREFIX + "입력값이 비어있습니다\n",
  INVALID_PURCHASE_AMOUNT_TYPE: ERROR_PREFIX + "구입 금액은 숫자여야 합니다\n",
  INVALID_PURCHASE_AMOUNT_NEGATIVE: ERROR_PREFIX + "구입 금액은 양수여야 합니다\n",
  INVALID_PURCHASE_AMOUNT_UNIT: ERROR_PREFIX + "구입 금액은 1000원 단위여야 합니다\n",
  WINNING_NUMBER_TYPE: ERROR_PREFIX + "당첨 번호는 숫자여야 합니다\n",
  WINNING_NUMBER_COUNT: ERROR_PREFIX + "당첨 번호는 6개여야 합니다\n",
  WINNING_NUMBER_DUPLICATE: ERROR_PREFIX + "당첨 번호에 중복된 번호가 포함되어 있습니다\n",
  WINNING_NUMBER_RANGE: ERROR_PREFIX + "당첨 번호는 1~45 사이의 숫자여야 합니다\n",
  BONUS_NUMBER_TYPE: ERROR_PREFIX + "보너스 번호는 숫자여야 합니다\n",
  INVALID_LOTTO_NUMBERS_COUNT: ERROR_PREFIX + "로또 번호는 6개여야 합니다\n",
  DUPLICATE_LOTTO_NUMBERS: ERROR_PREFIX + "중복된 번호가 포함되어 있습니다\n",
  OUT_OF_RANGE_LOTTO_NUMBERS: ERROR_PREFIX + "로또 번호는 1~45 사이의 숫자여야 합니다\n"
});
const LOTTO_RULE = Object.freeze({
  LOTTO_PRICE: 1e3,
  LOTTO_NUMBERS_COUNT: 6,
  MIN_LOTTO_NUMBER: 1,
  MAX_LOTTO_NUMBER: 45,
  "3_MATCH": 3,
  "4_MATCH": 4,
  "5_MATCH": 5,
  "5_BONUS_MATCH": "5개+보너스볼",
  "6_MATCH": 6,
  RESTART: "y",
  QUIT: "n"
});
class Lotto {
  #numbers;
  constructor(lottoNumbers) {
    this.#numbers = lottoNumbers;
    this.#validate(lottoNumbers);
  }
  #validate(lottoNumbers) {
    if (lottoNumbers.length !== LOTTO_RULE.LOTTO_NUMBERS_COUNT)
      throw new Error(ERROR_MESSAGES.INVALID_LOTTO_NUMBERS_COUNT);
    if (new Set(lottoNumbers).size !== lottoNumbers.length)
      throw new Error(ERROR_MESSAGES.DUPLICATE_LOTTO_NUMBERS);
    if (lottoNumbers.some(
      (number) => number < LOTTO_RULE.MIN_LOTTO_NUMBER || number > LOTTO_RULE.MAX_LOTTO_NUMBER
    ))
      throw new Error(ERROR_MESSAGES.OUT_OF_RANGE_LOTTO_NUMBERS);
  }
  getNumbers() {
    return [...this.#numbers];
  }
  calculateMatchCount(targetNumbers) {
    return this.#numbers.filter((number) => targetNumbers.includes(number)).length;
  }
  hasBonusNumber(bonusNumber) {
    return this.#numbers.includes(bonusNumber);
  }
}
class LottoMachine {
  #lottos;
  constructor(purchaseAmount) {
    this._lottoCount = purchaseAmount / LOTTO_RULE.LOTTO_PRICE;
    this.#lottos = [];
  }
  get lottoCount() {
    return this._lottoCount;
  }
  get lottos() {
    return [...this.#lottos];
  }
  generateLottoNumbers(min, max, count) {
    const lottoNumbers = /* @__PURE__ */ new Set();
    while (lottoNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      lottoNumbers.add(randomNumber);
    }
    return Array.from(lottoNumbers).sort((a, b) => a - b);
  }
  issuedLottos() {
    Array.from({ length: this.lottoCount }).forEach(() => {
      const lottoNumbers = this.generateLottoNumbers(1, 45, 6);
      const lotto = new Lotto(lottoNumbers);
      this.#lottos.push(lotto);
    });
    return [...this.lottos];
  }
}
class WinningStatistics {
  #lottos;
  #winningNumbers;
  #bonusNumber;
  #stats;
  constructor(lottos, winningNumbers, bonusNumber) {
    this.#lottos = lottos;
    this.#winningNumbers = winningNumbers;
    this.#bonusNumber = bonusNumber;
    this.#stats = {
      [LOTTO_RULE["3_MATCH"]]: { count: 0, prize: 5e3 },
      [LOTTO_RULE["4_MATCH"]]: { count: 0, prize: 5e4 },
      [LOTTO_RULE["5_MATCH"]]: { count: 0, prize: 15e5 },
      [LOTTO_RULE["5_BONUS_MATCH"]]: { count: 0, prize: 3e7 },
      [LOTTO_RULE["6_MATCH"]]: { count: 0, prize: 2e9 }
    };
  }
  getStats() {
    return structuredClone(this.#stats);
  }
  calculateStats() {
    this.#lottos.forEach((lotto) => {
      const matchCount = lotto.calculateMatchCount(this.#winningNumbers);
      const hasBonus = lotto.hasBonusNumber(this.#bonusNumber);
      if (matchCount < LOTTO_RULE["3_MATCH"]) return;
      if (matchCount === LOTTO_RULE["5_MATCH"] && hasBonus) {
        this.#stats[LOTTO_RULE["5_BONUS_MATCH"]].count += 1;
      } else if (Object.keys(this.#stats).includes(String(matchCount))) {
        this.#stats[matchCount].count += 1;
      }
    });
  }
}
const calculateProfitRate = (purchasedAmount, stats) => {
  const totalPrize = sumPrize(stats);
  return (totalPrize / purchasedAmount * 100).toFixed(1);
};
const sumPrize = (stats) => Object.values(stats).reduce(
  (sum, { count, prize }) => sum + count * prize,
  0
);
class LottoService {
  constructor() {
    this.lottos = [];
  }
  purchaseLottos(purchasedAmount) {
    const lottoMachine = new LottoMachine(purchasedAmount);
    this.lottos = lottoMachine.issuedLottos();
    return [...this.lottos];
  }
  calculateWinningResult(winningNumbers, bonusNumber) {
    const winningStatistics = new WinningStatistics(
      this.lottos,
      winningNumbers,
      bonusNumber
    );
    winningStatistics.calculateStats();
    const profitRate = calculateProfitRate(
      this.lottos.length,
      winningStatistics.getStats()
    );
    return {
      stats: winningStatistics.getStats(),
      profitRate
    };
  }
  reset() {
    this.lottos = [];
  }
}
class WebView {
  constructor() {
    this.purchaseInputEl = document.querySelector(".purchase__input");
    this.purchaseFormEl = document.querySelector(".purchase__form");
    this.lottoListWrapperEl = document.querySelector(".issued-lotto__wrapper");
    this.winningBonusFormEl = document.querySelector(".winning-bonus__form");
    this.winningInputEls = document.querySelectorAll(".winning__input");
    this.bonusInputEl = document.querySelector(".bonus__input");
    this.winningBonusBtnEl = document.querySelector(".winning-bonus__button");
    this.winningResultEl = document.querySelector("tbody");
    this.profitRateEl = document.querySelector(".profit-rate");
    this.closeBtnEl = document.querySelector(".modal__icon-wrapper");
    this.restartBtnEl = document.querySelector(".restart-button");
  }
  initModalEvent() {
    this.closeBtnEl.addEventListener("click", () => {
      this.closeWinningModal();
    });
  }
  // 구입 이벤트 바인딩
  bindPurchaseEvent(handler) {
    this.purchaseFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.lottoListWrapperEl.innerHTML = "";
      handler(this.purchaseInputEl.value);
    });
  }
  // 당첨 결과 폼 이벤트 바인딩
  bindWinningResultFormEvent(handler) {
    this.winningBonusBtnEl.addEventListener("click", () => {
      this.winningResultEl.innerHTML = "";
      handler(this.winningInputEls, this.bonusInputEl);
    });
  }
  // 재시작
  initRestartEvent(handler) {
    this.restartBtnEl.addEventListener("click", () => {
      this.closeWinningModal();
      this.resetDom();
      handler();
    });
  }
  // 구매 결과 렌더링
  renderPurchaseResult(lottos, count) {
    this.renderIssuedLottosCount(this.lottoListWrapperEl, count);
    this.renderIssuedLottos(this.lottoListWrapperEl, lottos);
    this.renderWinningBonusForm();
  }
  // 발행된 로또 개수 렌더링
  renderIssuedLottosCount(parentEl, count) {
    parentEl.insertAdjacentHTML(
      "afterbegin",
      `<p class="issued-lotto__count text-body">총 ${count}개를 구매하셨습니다.</p>`
    );
  }
  // 발행된 로또 리스트 렌더링
  renderIssuedLottos(parentEl, lottos) {
    const lottoListEl = document.createElement("ul");
    lottoListEl.className = "issued-lotto__list";
    parentEl.appendChild(lottoListEl);
    lottoListEl.insertAdjacentHTML(
      "beforeend",
      this.createIssuedLottosNode(lottos)
    );
  }
  // 발행된 로또 리스트 노드 생성
  createIssuedLottosNode(lottos) {
    return lottos.map(
      (lotto) => `
                <li class="issued-lotto">
                    <span class="issued-lotto__icon-wrapper"> 🎟️ </span>
                    <p>${lotto.getNumbers().join(", ")}</p>
                </li>
        
            `
    ).join("");
  }
  // 당첨 번호 및 보너스 번호 DOM 렌더링
  renderWinningBonusForm() {
    this.winningBonusFormEl.classList.remove("hidden");
    const winningInputEl = document.querySelector("#winning-number");
    winningInputEl.focus();
  }
  // 당첨 결과 모달 열기
  openWinningModal({ stats, profitRate }) {
    const body = document.querySelector("body");
    const modalEl = document.querySelector(".modal-root");
    modalEl.showModal();
    body.classList.add("modal-open");
    let resultHTML = this.createWinningResultNode(stats);
    this.winningResultEl.insertAdjacentHTML("afterbegin", resultHTML);
    this.profitRateEl.textContent = `총 수익률은 ${profitRate}%입니다.`;
  }
  createWinningResultNode(stats) {
    return [
      LOTTO_RULE["3_MATCH"],
      LOTTO_RULE["4_MATCH"],
      LOTTO_RULE["5_MATCH"],
      LOTTO_RULE["5_BONUS_MATCH"],
      LOTTO_RULE["6_MATCH"]
    ].map(
      (matchCount) => `
            <tr class="modal-table__row">
              <td class="modal-table__data">${Number(matchCount) ? Number(matchCount) + "개" : matchCount}</td>
              <td class="modal-table__data">${stats[matchCount].prize.toLocaleString()}</td>
              <td class="modal-table__data">${stats[matchCount].count}개</td>
            </tr>
      `
    ).join("");
  }
  // 당첨 결과 모달 닫기
  closeWinningModal() {
    const body = document.querySelector("body");
    const modalEl = document.querySelector(".modal-root");
    modalEl.close();
    body.classList.remove("modal-open");
  }
  resetDom() {
    this.purchaseInputEl.value = "";
    this.winningInputEls.forEach((el) => el.value = "");
    this.bonusInputEl.value = "";
    this.lottoListWrapperEl.innerHTML = "";
    this.winningResultEl.innerHTML = "";
    this.profitRateEl.textContent = "";
    this.lottoListWrapperEl.classList.add("hidden");
    this.winningBonusFormEl.classList.add("hidden");
  }
}
class WebController {
  constructor() {
    this.lottoService = new LottoService();
    this.webView = new WebView();
    this.initEventListener();
  }
  initEventListener() {
    this.webView.bindPurchaseEvent(this.handlePuchase.bind(this));
    this.webView.bindWinningResultFormEvent(
      this.handleWinningResultForm.bind(this)
    );
    this.webView.initRestartEvent(() => {
      this.lottoService.reset();
    });
    this.webView.initModalEvent();
  }
  handlePuchase(purchaseAmount) {
    const lottos = this.lottoService.purchaseLottos(purchaseAmount);
    this.webView.renderPurchaseResult(lottos, lottos.length);
  }
  handleWinningResultForm(winningInputEls, bonusInputEl) {
    const result = this.lottoService.calculateWinningResult(
      Array.from(winningInputEls).map((el) => Number(el.value)),
      Number(bonusInputEl.value)
    );
    this.webView.openWinningModal(result);
  }
}
new WebController();
