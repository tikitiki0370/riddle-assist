/**
 * solverEngine共通型定義
 */

/** 変換結果 */
export type ConvertResult = (string | number)[];

/** マッピング定義（複数表記対応） */
export interface MappingDefinition {
  /** 主表記（Number2X変換時に使用） */
  primary: readonly string[];
  /** 追加の表記リスト（X2Number変換時に全てマッチ対象） */
  aliases?: readonly (readonly string[])[];
}
