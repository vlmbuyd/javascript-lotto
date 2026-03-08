import { ERROR_MESSAGES, LOTTO_RULE } from "./constants";

export default class Lotto {
  #numbers;

  constructor(lottoNumbers) {
    this.#numbers = lottoNumbers;
    this.#validate(lottoNumbers);
  }

  #validate(lottoNumbers) {
    // 로또 번호 개수가 6개가 아닌 경우
    if (lottoNumbers.length !== LOTTO_RULE.LOTTO_NUMBERS_COUNT)
      throw new Error(ERROR_MESSAGES.INVALID_LOTTO_NUMBERS_COUNT);

    // 중복된 번호가 포함된 경우
    if (new Set(lottoNumbers).size !== lottoNumbers.length)
      throw new Error(ERROR_MESSAGES.DUPLICATE_LOTTO_NUMBERS);

    // 로또 번호가 1~45 범위를 벗어나는 경우
    if (
      lottoNumbers.some(
        (number) =>
          number < LOTTO_RULE.MIN_LOTTO_NUMBER ||
          number > LOTTO_RULE.MAX_LOTTO_NUMBER
      )
    )
      throw new Error(ERROR_MESSAGES.OUT_OF_RANGE_LOTTO_NUMBERS);
  }

  getNumbers() {
    return [...this.#numbers];
  }

  calculateMatchCount(targetNumbers) {
    return this.#numbers.filter((number) => targetNumbers.includes(number))
      .length;
  }

  hasBonusNumber(bonusNumbers) {
    return bonusNumbers.some((bonusNumber) =>
      this.#numbers.includes(bonusNumber)
    );
  }
}
