import { GsClipboard } from "@/GsClipboard/GsClipboard";
import { Handler } from "@/GsClipboard/handlers";
import { EBuildInHandlers } from '@/index'

class HyperlinkHandler implements Handler {
  public type = "hyperlink";
  toText(value: any, payload: any): string {
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
  // GS.setCopy([[{value:"a",type:"hyperlink",payload:"sabc"}, {value:"acc",type:"hyperlink",payload:"sabc"}]]);
  GS.setCopy([{
    value: {
      link: "https://google.com",
      title: "google",
      attrs:{}
    },
    type: EBuildInHandlers.HYPERLINK
  }]);
});

document.getElementById("getData").addEventListener("click", async () => {
  console.log(await GS.getDataFromClipboard());
});
