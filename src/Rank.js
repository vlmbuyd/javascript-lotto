export default class Rank {
  constructor(lottos, winningNumbers, bonusNumbers) {
    this.lottos = lottos;
    this.winningNumbers = winningNumbers;
    this.bonusNumbers = bonusNumbers;
    this.stats = {
      3: { count: 0, prize: 5000 },
      4: { count: 0, prize: 50000 },
      5: { count: 0, prize: 1500000 },
      "5B": { count: 0, prize: 30000000 },
      6: { count: 0, prize: 2000000000 },
    };
  }

  // 결과 계산
  calculateStats() {
    this.lottos.forEach((lotto) => {
      const matchCount = lotto.calculateMatchCount([
        ...this.winningNumbers,
        ...this.bonusNumbers,
      ]);

      if (matchCount < 3) return;

      if (matchCount === 5 && lotto.hasBonusNumber(this.bonusNumbers)) {
        this.stats["5B"].count += 1;
      } else if (Object.keys(this.stats).includes(String(matchCount))) {
        this.stats[matchCount].count += 1;
      }
    });
  }

  // 결과 출력
  printStats() {
    this.calculateStats();

    console.log("당첨 통계 \n");
    console.log("--------------------\n");

    Object.entries(this.stats).map(([key, { count, prize }]) => {
      const displayKey =
        key === "5B" ? "5개 일치, 보너스 볼 일치" : `${key}개 일치`;

      console.log(`${displayKey} (${prize.toLocaleString()}원) - ${count}개\n`);
    });
  }
}
