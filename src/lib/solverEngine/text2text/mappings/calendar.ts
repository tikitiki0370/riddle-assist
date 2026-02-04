import type { MappingDefinition } from "../../types";

/** 月の名前 */
export const CALENDAR: MappingDefinition = {
  primary: ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"],
  aliases: [
    ["むつき", "きさらぎ", "やよい", "うづき", "さつき", "みなづき", "ふづき", "はづき", "ながつき", "かんなづき", "しもつき", "しわす"],
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ],
};
