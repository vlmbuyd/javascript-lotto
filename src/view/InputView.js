import readline from "readline";
import { INPUT_MESSAGES, TERMS } from "../utils/constants.js";
import { InputValidator } from "../utils/InputValidator.js";

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

  static async readValidInput(key, query) {
    try {
      const input = await InputView.read(query);
      InputValidator.runValidate(key, input);

      return input;
    } catch (err) {
      console.log(err.message);

      return await InputView.readValidInput(key, query);
    }
  }

  static close() {
    rl.close();
  }

  static async readPurchaseAmount() {
    return await InputView.readValidInput(
      TERMS.PURCHASE_AMOUNT,
      INPUT_MESSAGES.PURCHASE_AMOUNT
    );
  }

  static async readWinningNumbers() {
    const winningNumbers = await InputView.readValidInput(
      TERMS.WINNING_NUMBERS,
      INPUT_MESSAGES.WINNING_NUMBERS
    );

    return winningNumbers.split(",").map(Number);
  }

  static async readBonusNumber() {
    const bonusNumber = await InputView.readValidInput(
      TERMS.BONUS_NUMBER,
      INPUT_MESSAGES.BONNUS_NUMBERS
    );
    return Number(bonusNumber);
  }

  static async askRestart() {
    const answer = await InputView.read(INPUT_MESSAGES.RESTART);
    const processed = answer.toLowerCase().trim();

    if (processed === "y" || processed === "n") {
      return processed;
    }
  }
}
