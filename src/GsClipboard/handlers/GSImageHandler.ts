import { EBuildInHandlers, Handler } from "@/GsClipboard/handlers/index";
import { attrsObj2String } from "@/helper/helper";

interface ImageValue {
  src: string;
  title: string;
  attrs: Record<string, string>;
}

export class GSImageHandler implements Handler {
  public type: EBuildInHandlers = EBuildInHandlers.IMAGE;

  toText(value: ImageValue): string {
    return value.title ?? "";
  }

  toHtml(value: ImageValue): string {
    return `<img src="${value.src}" alt="${value.title}" ${attrsObj2String(
      value.attrs ?? {}
    )}>`;
  }

  parse(value: ImageValue): ImageValue {
    value.title = value.title ?? "";
    value.attrs = value.attrs ?? {};
    return value;
  }
}
