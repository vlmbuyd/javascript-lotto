/**
 * step 1의 시작점이 되는 파일입니다.
 * 브라우저 환경에서 사용하는 css 파일 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import InputView from "./view/InputView.js";
import WinningStatistics from "./model/WinningStatistics.js";
import OutputView from "./view/OutputView.js";
import calculateProfitRate from "./model/calculateProfit.js";
import LottoMachine from "./model/LottoMachine.js";
import { LOTTO_RULE } from "./utils/constants.js";

class App {
  async run() {
    const purchasedAmount = await InputView.readPurchaseAmount();

    const lottoMachine = new LottoMachine(purchasedAmount);
    OutputView.printLottoCount(lottoMachine.lottoCount);

    const lottos = lottoMachine.issuedLottos();
    OutputView.printIssuedLottos(lottos);

    const winningNumbers = await InputView.readWinningNumbers();
    const bonusNumber = await InputView.readBonusNumber();

    const winningStatistics = new WinningStatistics(
      lottos,
      winningNumbers,
      bonusNumber
    );
    winningStatistics.calculateStats();
    OutputView.printStats(winningStatistics.getStats());

    const profitRate = calculateProfitRate(
      purchasedAmount,
      winningStatistics.getStats()
    );
    OutputView.printProfitRate(profitRate);

    this.checkRestart();
  }

  async checkRestart() {
    const command = await InputView.askRestart();

    if (command === LOTTO_RULE.RESTART) {
      return this.run();
    }

    return InputView.close();
  }
}

const app = new App();
app.run();
