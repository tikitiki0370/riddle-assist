/**
 * アルファベット変換
 * charCode計算ベースのため、マッピング配列は不要
 */

/** A=1, B=2, ... Z=26 */
export function alphabetToNumber(char: string): number | null {
  const code = char.charCodeAt(0);
  // 大文字 A-Z
  if (code >= 65 && code <= 90) {
    return code - 65 + 1;
  }
  // 小文字 a-z
  if (code >= 97 && code <= 122) {
    return code - 97 + 1;
  }
  return null;
}

/** 1=a, 2=b, ... 26=z (小文字) */
export function numberToAlphabet(num: number): string | null {
  if (num >= 1 && num <= 26) {
    return String.fromCharCode(num + 96);
  }
  return null;
}
