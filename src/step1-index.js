/**
 * step 1의 시작점이 되는 파일입니다.
 * 브라우저 환경에서 사용하는 css 파일 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import InputView from "./InputView.js";
import LottoMachine from "./LottoMachine.js";
import Profit from "./Profit.js";
import Rank from "./Rank.js";

class App {
  async run() {
    const purchasedAmount = await InputView.readPurchaseAmount();

    const lottoMachine = new LottoMachine(purchasedAmount);
    console.log(`${lottoMachine.lottoCount}개를 구매했습니다.`);

    const lottos = lottoMachine.run();

    const winningNumbers = await InputView.readWinningNumbers();
    const bonusNumber = await InputView.readBonusNumber();

    const rank = new Rank(lottos, winningNumbers, bonusNumber);
    rank.printStats();

    Profit.printProfitRate(purchasedAmount, rank.getStats());

    this.checkRestart();
  }

  async checkRestart() {
    const command = await InputView.askRestart();

    if (command === "y") {
      return this.run();
    }

    return InputView.close();
  }
}

const app = new App();
app.run();
