# gs-chipboard

//  docs working on it!


```typescript
import { GsClipboard } from "@/GsClipboard/GsClipboard";
import { Handler } from "@/GsClipboard/handlers";

class HyperlinkHandler implements Handler {
  public type = "hyperlink";
  toText(value: any): string {
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

//  set as hyperlink
document.getElementById("copy").addEventListener("click", () => {
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
```
