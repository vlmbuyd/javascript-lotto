/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import LottoService from "./service/LottoService.js";

const purchaseInputEl = document.querySelector(".purchase__input");
const purchaseFormEl = document.querySelector(".purchase__form");

// 구입할 금액 입력 및 로또 발행
purchaseFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const lottoService = new LottoService();

  const lottos = lottoService.purchaseLottos(purchaseInputEl.value);
  const lottoListWrapperEl = document.querySelector(".issued-lotto__wrapper");
  renderIssuedLottosCount(lottoListWrapperEl, lottos.length);
  renderIssuedLottos(lottoListWrapperEl, lottos);
  renderWinningBonusForm();
});

// 발행된 로또 개수 렌더링
function renderIssuedLottosCount(parentEl, count) {
  parentEl.insertAdjacentHTML(
    "afterbegin",
    `<p class="issued-lotto__count text-body">총 ${count}개를 구매하셨습니다.</p>`
  );
}

// 발행된 로또 리스트 렌더링
function renderIssuedLottos(parentEl, lottos) {
  const lottoListEl = document.createElement("ul");
  lottoListEl.className = "issued-lotto__list";
  parentEl.appendChild(lottoListEl);

  lottoListEl.insertAdjacentHTML("beforeend", createIssuedLottosNode(lottos));
}

// 발행된 로또 리스트 노드 생성
function createIssuedLottosNode(lottos) {
  return lottos
    .map(
      (lotto) =>
        `
            <li class="issued-lotto">
                <span class="issued-lotto__icon-wrapper"> 🎟️ </span>
                <p>${lotto.getNumbers().join(", ")}</p>
            </li>
    
        `
    )
    .join("");
}

// 당첨 번호 및 보너스 번호 DOM 렌더링
function renderWinningBonusForm() {
  const formEl = document.querySelector(".winning-bonus__form");
  formEl.classList.remove("hidden");

  const winningInputEl = document.querySelector("#winning-number");
  winningInputEl.focus();
}

const winningBonusBtnEl = document.querySelector(".winning-bonus__button");
winningBonusBtnEl.addEventListener("click", () => {
  renderWinningResultModal();
});

const body = document.querySelector("body");
const modalEl = document.querySelector(".modal-root");
const closeBtnEl = document.querySelector(".modal__icon-wrapper");
const restartBtnEl = document.querySelector(".restart-button");

// 당첨 결과 모달 렌더링
function renderWinningResultModal() {
  modalEl.showModal();
  body.classList.add("modal-open"); // 스크롤 제한
}

// 모달 닫기
closeBtnEl.addEventListener("click", () => {
  modalEl.close();
});

// 다시 시작하기
restartBtnEl.addEventListener("click", () => {
  modalEl.close();
});
