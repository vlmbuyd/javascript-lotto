import { LOTTO_RULE } from "../utils/constants.js";
import Lotto from "./Lotto.js";

export default class LottoMachine {
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
    const lottoNumbers = new Set();

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
