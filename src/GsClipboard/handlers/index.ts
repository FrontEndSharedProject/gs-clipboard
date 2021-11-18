import { GSPlainTextHandler } from "@/GsClipboard/handlers/GSPlainTextHandler";
import { GSImageHandler } from "@/GsClipboard/handlers/GSImageHandler";
import { GSHyperlinkHandler } from "@/GsClipboard/handlers/GSHyperlinkHandler";
import { GSRichTextHandler } from "@/GsClipboard/handlers/GSRichTextHandler";

export interface Handler {
  //  handler identifier
  type: string;
  //  transform value which is given by setCopy to text
  toText(value: any): string;
  //  transform value which is given by setCopy to html
  toHtml(value: any): string;
  //  parse clipboard data before getDataFromClipboard return
  //  if you want to further modify the output base on built-in process
  //  for example
  //  if this handle working on string and
  //  u wanna use trim() method in getDataFromClipboard processing
  //  parse(value:any){ return value.trim() }
  parse(value: any): any;
}

export enum EBuildInHandlers {
  PLAIN = "gs-plain-text",
  IMAGE = "gs-image",
  HYPERLINK = "gs-hyperlink",
  RICH_TEXT = "gs-rich-text",
}

const builtInHandlers = [
  new GSPlainTextHandler(),
  new GSImageHandler(),
  new GSHyperlinkHandler(),
  new GSRichTextHandler(),
];

export { builtInHandlers };
