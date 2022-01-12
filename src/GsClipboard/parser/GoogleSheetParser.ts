import { Parser } from "@/GsClipboard/parser/index";
import { CopyDataItemFormat } from "@/types";
import { EBuildInHandlers } from "@/GsClipboard/handlers";

export default class GoogleSheetParser implements Parser {
  public detectRule(html: string): boolean {
    return !!~html.indexOf("google-sheets-html-origin");
  }

  public parser(html: string): CopyDataItemFormat[][] {
    const div = document.createElement("div");
    div.innerHTML = html;
    const table = div.querySelector("table");
    return [...table.querySelector("tbody").childNodes].map<
      CopyDataItemFormat[]
    >((tr) => {
      return [...tr.childNodes].map<CopyDataItemFormat>((td) => {
        return this.parseTd(td as HTMLElement);
      });
    });
  }

  private getSheetsValue(sheetsValue: string): string {
    try {
      //  {"1":2,"2":"value"}
      const data = JSON.parse(sheetsValue);
      return data[data[1]];
    } catch (e) {
      return "";
    }
  }

  private parseTd(td: HTMLElement): CopyDataItemFormat {
    //  <td data-sheets-value="{"1":2,"2":"https://i.imgur.com/a.gif"}" data-sheets-hyperlink="https://i.imgur.com/a.gif">
    //  if is hyperlink
    if (td.dataset.sheetsHyperlink) {
      return {
        value: {
          title: this.getSheetsValue(td.dataset.sheetsValue),
          link: td.dataset.sheetsHyperlink,
        },
        type: EBuildInHandlers.HYPERLINK,
      };
    }

    //  td <td data-sheets-value="{"1":2,"2":"plain text"}" data-sheets-textstyleruns="{}"> > rich text dom
    //  rich text
    if (td.dataset.sheetsTextstyleruns) {
      return {
        value: {
          plain: this.getSheetsValue(td.dataset.sheetsValue),
          value: td.innerHTML,
        },
        type: EBuildInHandlers.RICH_TEXT,
      };
    }

    //  <td data-sheets-value="{"1":2,"2":"https://i.imgur.com/a.gif"}">
    //  have sheetsValue
    if (td.dataset.sheetsValue) {
      return {
        value: td.innerText.trim(),
        type: EBuildInHandlers.PLAIN,
      };
    }

    //  <td> > img
    //  is img
    if (td.querySelector("img")) {
      const img = td.querySelector("img") as HTMLImageElement;
      return {
        value: {
          src: img.src,
          title: img.title ?? "",
        },
        type: EBuildInHandlers.IMAGE,
      };
    }

    //  cant match any of rules
    return {
      value: td.innerText,
      type: EBuildInHandlers.PLAIN,
    };
  }
}
