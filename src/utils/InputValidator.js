import { ERROR_MESSAGES, LOTTO_RULE, TERMS } from "../constants.js";

export class InputValidator {
  static #validators = {
    [TERMS.PURCHASE_AMOUNT]: (value) => PurchaseAmountValidator.validate(value),
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
