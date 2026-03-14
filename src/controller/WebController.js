import LottoService from "../service/LottoService.js";
import WebView from "../view/WebView.js";

export default class WebController {
  constructor() {
    this.lottoService = new LottoService();
    this.webView = new WebView();

    this.initEventListener();
  }

  initEventListener() {
    this.webView.bindPurchaseEvent(this.handlePuchase.bind(this));
    this.webView.initModalEvents();
  }

  handlePuchase(purchaseAmount) {
    const lottos = this.lottoService.purchaseLottos(purchaseAmount);
    this.webView.renderPurchaseResult(lottos, lottos.length);
  }
}
