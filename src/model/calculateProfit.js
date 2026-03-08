const calculateProfitRate = (purchasedAmount, stats) => {
  const totalPrize = sumPrize(stats);
  return ((totalPrize / purchasedAmount) * 100).toFixed(1);
};

const sumPrize = (stats) =>
  Object.values(stats).reduce(
    (sum, { count, prize }) => sum + count * prize,
    0
  );

export default calculateProfitRate;
