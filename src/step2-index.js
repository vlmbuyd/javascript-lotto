/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import LottoService from "./service/LottoService.js";
import { WebView } from "./view/WebView.js";

const purchaseInputEl = document.querySelector(".purchase__input");
const purchaseFormEl = document.querySelector(".purchase__form");

// 구입할 금액 입력 및 로또 발행
purchaseFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const lottoService = new LottoService();

  const lottos = lottoService.purchaseLottos(purchaseInputEl.value);
  const lottoListWrapperEl = document.querySelector(".issued-lotto__wrapper");
  WebView.renderIssuedLottosCount(lottoListWrapperEl, lottos.length);
  WebView.renderIssuedLottos(lottoListWrapperEl, lottos);
  WebView.renderWinningBonusForm();
});

const winningBonusBtnEl = document.querySelector(".winning-bonus__button");
const closeBtnEl = document.querySelector(".modal__icon-wrapper");
const restartBtnEl = document.querySelector(".restart-button");

// 모달 열기
winningBonusBtnEl.addEventListener("click", () => {
  WebView.openWinningModal();
});

// 모달 닫기
closeBtnEl.addEventListener("click", () => {
  WebView.closeWinningModal();
});

// 다시 시작하기
restartBtnEl.addEventListener("click", () => {
  WebView.closeWinningModal();
});
