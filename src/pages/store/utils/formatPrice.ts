

export const formatNumber = (
  value?: number | null,
  locale: string = "es-CO",
  currency?: string
): string => {
  if (typeof value !== "number") return "N/A"; // Manejo seguro de valores inválidos

  const options: Intl.NumberFormatOptions = currency
    ? { style: "currency", currency }
    : {}; // Aplica formato de moneda solo si se proporciona

  return value.toLocaleString(locale, options);
};
