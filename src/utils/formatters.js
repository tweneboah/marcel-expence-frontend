/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a number as Swiss Francs (CHF) currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: CHF)
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = "CHF") => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a localized date format
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("de-CH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @param {number} digits - Number of decimal digits to include
 * @returns {string} The formatted number
 */
export const formatNumber = (value, digits = 0) => {
  return new Intl.NumberFormat("de-CH", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

/**
 * Format a decimal number as percentage
 * @param {number} value - The decimal value to format as percentage
 * @param {number} digits - Number of decimal digits to include
 * @returns {string} The formatted percentage string
 */
export const formatPercentage = (value, digits = 1) => {
  return new Intl.NumberFormat("de-CH", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};
