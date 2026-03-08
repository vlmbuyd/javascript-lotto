import { LOTTO_RULE, OUTPUT_MESSAGES } from "../constants.js";

export default class OutputView {
  static printLottoCount(lottoCount) {
    console.log(`${lottoCount}개를 구매했습니다.`);
  }

  static printIssuedLottos(lottos) {
    lottos.forEach((lotto) => {
      console.log(lotto.getNumbers());
    });
  }

  static printStats(stats) {
    console.log("\n" + OUTPUT_MESSAGES.STATS_HEADER);

    Object.entries(stats).map(([key, { count, prize }]) => {
      const displayKey =
        key === LOTTO_RULE["5_BONUS_MATCH"]
          ? OUTPUT_MESSAGES["5_BONUS_MATCH"]
          : `${key}개 일치`;

      console.log(`${displayKey} (${prize.toLocaleString()}원) - ${count}개`);
    });
  }

  static printProfitRate(profitRate) {
    console.log(`총 수익률은 ${profitRate}%입니다.`);
  }
}
