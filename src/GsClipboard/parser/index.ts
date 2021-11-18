import { CopyDataItemFormat } from "@/types";
import GoogleSheetParser from "@/GsClipboard/parser/GoogleSheetParser";
import { isEmptyArray } from "@/helper/helper";

export interface Parser {
  /**
   * a method to be before the parser method and make sure this parser use correctly
   * @param html
   */
  detectRule(html: string): boolean;

  /**
   * parse table html and return CopyDataItemFormat[][]
   * @param html
   */
  parser(html: string): CopyDataItemFormat[][];
}

const parserArray = [new GoogleSheetParser()];

/**
 * use parse diff data structure which is from others site
 * like google sheet customized his own table data structure
 * @param html
 * @constructor
 */
export function TableParser(html: string): CopyDataItemFormat[][] {
  for (let i = 0; i < parserArray.length; i++) {
    if (parserArray[i].detectRule(html)) {
      const output = parserArray[i].parser(html);
      if (!isEmptyArray(output)) {
        return output;
      }
    }
  }

  return [];
}
