const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export default class InputView {
  static read(query) {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  }

  static close() {
    rl.close();
  }

  static async readPurchaseAmount() {
    return InputView.read("구입금액을 입력해 주세요.\n");
  }

  static readWinningNumbers() {
    return InputView.read("당첨 번호를 입력해 주세요.\n");
  }

  static readBonusNumbers() {
    return InputView.read("보너스 번호를 입력해 주세요.\n");
  }
}
