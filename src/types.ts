import { EBuildInHandlers, Handler } from "@/GsClipboard/handlers";
import { Parser } from "@/GsClipboard/parser";

export interface GsClipboardOptions {
  /**
   * customizable data transform and parse Handler
   */
  handlers?: Handler[];
  /**
   * this method will called if
   * the clipboard data from other sites (didn't have a gs-clipboard data in it)
   * or the text/html content type data dont have table in it
   * for example
   * if u copy a cell data from google sheet,
   * it will never process by TableParsers, cuz it not a table.
   * so you need implement this method those can process by gs-clipboard
   * (hyperlink, img. they have already built in)
   * @param html
   */
  unknownHtmlParser?: (html: string) => UnknownHtmlParserOutput;
  /**
   * diff sites provide diff table structure , you can set u own parser ( google sheet has built-in )
   * additional table html parser if built in parser not working well
   * this array will be called one by one when calling getDataFromClipboard if there have table html in
   * clipboard.
   */
  tableParsers?: Parser[];
}

export interface CopyDataItemFormat {
  value: string | any[] | Record<string, any>;
  type: string;
}

export type UnknownHtmlParserOutput =
  | CopyDataItemFormat
  | CopyDataItemFormat[]
  | false;

export type SetCopyArgs =
  | string
  | string[]
  | string[][]
  | CopyDataItemFormat
  | CopyDataItemFormat[]
  | CopyDataItemFormat[][];

export interface ClipboardTypes {
  text: string;
  html: string;
  clipboardType: any[];
}

export interface EventsDef {
  beforeCopy: (clipboardTypes: ClipboardTypes) => void;
  copySucceeded: (copyData: ClipboardItems) => void;
  copyFailed: (err: Error) => void;
}
