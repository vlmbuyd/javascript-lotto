import { ERROR_MESSAGES, LOTTO_RULE, TERMS } from "../constants.js";

export class InputValidator {
  static #validators = {
    [TERMS.PURCHASE_AMOUNT]: (value) => PurchaseAmountValidator.validate(value),
    [TERMS.WINNING_NUMBERS]: (value) => WinningNumbersValidator.validate(value),
  };

  // 공통 검증 로직
  static #commonValidate(input) {
    if (input.trim().length === 0) {
      throw new Error(ERROR_MESSAGES.BLANK_INPUT);
    }
  }

  static runValidate(key, value) {
    InputValidator.#commonValidate(value);

    const validator = this.#validators[key];
    validator(value);
  }
}

/**
 * 구입 금액 입력값 검증
 */
class PurchaseAmountValidator {
  static #validators = [
    this.#validateType,
    this.#validateNegative,
    this.#validateUnit,
  ];

  // 숫자가 아닌 경우
  static #validateType(value) {
    if (Number.isNaN(Number(value)))
      throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_AMOUNT_TYPE);
  }

  // 음수인 경우
  static #validateNegative(value) {
    if (Number(value) < 0)
      throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_AMOUNT_NEGATIVE);
  }

  // 1000원 단위가 아닌 경우
  static #validateUnit(value) {
    if (value % LOTTO_RULE.LOTTO_PRICE !== 0)
      throw new Error(ERROR_MESSAGES.INVALID_PURCHASE_AMOUNT_UNIT);
  }

  static validate(value) {
    this.#validators.forEach((validator) => validator.call(this, value));
  }
}

/**
 * 당첨 번호 입력값 검증
 */
class WinningNumbersValidator {
  static #validators = [
    this.#validateType,
    this.#validateCount,
    this.#validateDuplicate,
    this.#validateRange,
  ];

  // 숫자가 아닌 경우 / ',' 외의 구분자인 경우
  static #validateType(value) {
    if (value.some((number) => Number.isNaN(number))) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_TYPE);
    }
  }

  // 당첨 번호 개수가 6개가 아닌 경우
  static #validateCount(value) {
    if (value.length !== LOTTO_RULE.LOTTO_NUMBERS_COUNT) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_COUNT);
    }
  }

  // 중복된 번호가 포함된 경우
  static #validateDuplicate(value) {
    if (new Set(value).size !== value.length) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_DUPLICATE);
    }
  }

  // 1~45 범위를 벗어나는 경우
  static #validateRange(value) {
    if (
      value.some((number) => number < LOTTO_RULE.MIN_LOTTO_NUMBER) ||
      value.some((number) => number > LOTTO_RULE.MAX_LOTTO_NUMBER)
    ) {
      throw new Error(ERROR_MESSAGES.WINNING_NUMBER_RANGE);
    }
  }

  static validate(value) {
    const parsedList = value.split(",").map(Number);
    this.#validators.forEach((validator) => validator.call(this, parsedList));
  }
}
