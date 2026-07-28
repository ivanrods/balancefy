export function formatCurrency(value: number, currency: string = "BRL", locale: string = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
