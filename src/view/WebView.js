export const WebView = {
  // 발행된 로또 개수 렌더링
  renderIssuedLottosCount(parentEl, count) {
    parentEl.insertAdjacentHTML(
      "afterbegin",
      `<p class="issued-lotto__count text-body">총 ${count}개를 구매하셨습니다.</p>`
    );
  },

  // 발행된 로또 리스트 렌더링
  renderIssuedLottos(parentEl, lottos) {
    const lottoListEl = document.createElement("ul");
    lottoListEl.className = "issued-lotto__list";
    parentEl.appendChild(lottoListEl);

    lottoListEl.insertAdjacentHTML(
      "beforeend",
      this.createIssuedLottosNode(lottos)
    );
  },
  // 발행된 로또 리스트 노드 생성
  createIssuedLottosNode(lottos) {
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
  },

  // 당첨 번호 및 보너스 번호 DOM 렌더링
  renderWinningBonusForm() {
    const formEl = document.querySelector(".winning-bonus__form");
    formEl.classList.remove("hidden");

    const winningInputEl = document.querySelector("#winning-number");
    winningInputEl.focus();
  },

  // 당첨 결과 모달 열기
  openWinningModal() {
    const body = document.querySelector("body");
    const modalEl = document.querySelector(".modal-root");
    modalEl.showModal();
    body.classList.add("modal-open"); // 스크롤 제한
  },
  // 당첨 결과 모달 닫기
  closeWinningModal() {
    const body = document.querySelector("body");
    const modalEl = document.querySelector(".modal-root");
    modalEl.close();
    body.classList.remove("modal-open"); // 스크롤 제한 해제
  },
};
