// Reference baseline exchange rates (Base: INR)
export const EXCHANGE_RATES = {
  INR: { symbol: "₹", rate: 1.0, label: "INR (₹)" },
  USD: { symbol: "$", rate: 0.012, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.011, label: "EUR (€)" },
};

/**
 * Extracts digits from a cost string (e.g. "₹8,500" -> 8500),
 * converts to target currency, and formats cleanly.
 */
export function formatCurrency(amountStrOrNum, targetCurrency = "INR") {
  if (amountStrOrNum === null || amountStrOrNum === undefined) return "";

  let numericVal = 0;
  if (typeof amountStrOrNum === "number") {
    numericVal = amountStrOrNum;
  } else {
    const cleaned = String(amountStrOrNum).replace(/[^0-9.]/g, "");
    numericVal = parseFloat(cleaned) || 0;
  }

  const currencyConfig = EXCHANGE_RATES[targetCurrency] || EXCHANGE_RATES.INR;
  const converted = numericVal * currencyConfig.rate;

  if (targetCurrency === "INR") {
    return `₹${Math.round(converted).toLocaleString("en-IN")}`;
  }

  return `${currencyConfig.symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}   