import { EBuildInHandlers, Handler } from "@/GsClipboard/handlers/index";

export class GSPlainTextHandler implements Handler {
  public type: EBuildInHandlers = EBuildInHandlers.PLAIN;

  toText(value: string): string {
    return value;
  }

  toHtml(value: string): string {
    return value;
  }

  parse(value: string): string {
    return value;
  }
}
