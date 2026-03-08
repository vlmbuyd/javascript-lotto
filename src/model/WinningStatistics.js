import { LOTTO_RULE } from "../utils/constants.js";

export default class WinningStatistics {
  #lottos;
  #winningNumbers;
  #bonusNumber;
  #stats;

  constructor(lottos, winningNumbers, bonusNumber) {
    this.#lottos = lottos;
    this.#winningNumbers = winningNumbers;
    this.#bonusNumber = bonusNumber;
    this.#stats = {
      [LOTTO_RULE["3_MATCH"]]: { count: 0, prize: 5000 },
      [LOTTO_RULE["4_MATCH"]]: { count: 0, prize: 50000 },
      [LOTTO_RULE["5_MATCH"]]: { count: 0, prize: 1500000 },
      [LOTTO_RULE["5_BONUS_MATCH"]]: { count: 0, prize: 30000000 },
      [LOTTO_RULE["6_MATCH"]]: { count: 0, prize: 2000000000 },
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
