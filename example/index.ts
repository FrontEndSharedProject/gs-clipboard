import { GsClipboard } from "@/GsClipboard/GsClipboard";
import { Handler } from "@/GsClipboard/handlers";

class HyperlinkHandler implements Handler {
  public type = "hyperlink";
  toText(value: any, payload:any): string {
    console.log(payload);
    return value;
  }
  toHtml(value: any): string {
    return value;
  }
  parse(value: any): any {
    return value;
  }
}

const GS = new GsClipboard({
  handlers: [new HyperlinkHandler()],
});

GS.on("copySucceeded", () => {
  console.log("copySucceeded");
});

GS.on("copyFailed", (rej) => {
  console.log(rej);
});

document.getElementById("copy").addEventListener("click", () => {
  GS.setCopy(["123", "456"]);
});

document.getElementById("getData").addEventListener("click", async () => {
  console.log(await GS.getDataFromClipboard());
});
