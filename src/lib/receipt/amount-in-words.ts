const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
] as const;

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
] as const;

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one ? `${TENS[ten]} ${ONES[one]}` : TENS[ten];
}

function threeDigits(n: number): string {
  if (n === 0) return "";
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  const hundredPart = hundred ? `${ONES[hundred]} Hundred` : "";
  const restPart = rest ? twoDigits(rest) : "";
  if (hundredPart && restPart) return `${hundredPart} ${restPart}`;
  return hundredPart || restPart;
}

/** Indian numbering — e.g. 100 → "One Hundred Rupees Only" */
export function amountInWords(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return "Zero Rupees Only";
  if (amount === 0) return "Zero Rupees Only";

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  if (rupees === 0 && paise > 0) {
    return `${twoDigits(paise)} Paise Only`;
  }

  const parts: string[] = [];
  let n = rupees;

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = n;

  if (crore) parts.push(`${twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  let words = parts.join(" ").trim() || "Zero";
  words += rupees === 1 ? " Rupee" : " Rupees";

  if (paise > 0) {
    words += ` and ${twoDigits(paise)} Paise`;
  }

  return `${words} Only`;
}
