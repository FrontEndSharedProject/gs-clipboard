import { EBuildInHandlers, Handler } from "@/GsClipboard/handlers/index";
import { attrsObj2String } from "@/helper/helper";

interface HyperlinkValue {
  link: string;
  title: string;
  attrs: Record<string, string>;
}

export class GSHyperlinkHandler implements Handler {
  public type: EBuildInHandlers = EBuildInHandlers.IMAGE;

  toText(value: HyperlinkValue): string {
    return value.title ?? "";
  }

  toHtml(value: HyperlinkValue): string {
    return `<a href="${value.link}" target="_blank" ${attrsObj2String(
      value.attrs
    )}>${value.title}</a>`;
  }

  parse(value: HyperlinkValue): HyperlinkValue {
    value.title = value.title ?? "";
    value.attrs = value.attrs ?? {};
    return value;
  }
}
