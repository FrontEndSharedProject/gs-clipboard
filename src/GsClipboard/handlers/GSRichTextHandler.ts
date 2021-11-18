import { EBuildInHandlers, Handler } from "@/GsClipboard/handlers/index";

interface RichTextValue {
  plain: string;
  value: string;
}

export class GSRichTextHandler implements Handler {
  public type: EBuildInHandlers = EBuildInHandlers.RICH_TEXT;

  toText(value: RichTextValue): string {
    return value.plain;
  }

  toHtml(value: RichTextValue): string {
    return value.value;
  }

  parse(value: RichTextValue): RichTextValue {
    return value;
  }
}
