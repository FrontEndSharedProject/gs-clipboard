import { UnknownHtmlParserOutput } from "@/types";
import { EBuildInHandlers } from "@/GsClipboard/handlers";

export class UnknownHtmlParser {
  public static parse(html: string): UnknownHtmlParserOutput {
    const div = document.createElement("div");
    div.innerHTML = html;
    const el = div.childNodes[0] as HTMLDivElement;
    if (!el) return false;

    //  hyperlink
    if (el.dataset.sheetsHyperlink) {
      return {
        value: {
          link: el.dataset.sheetsHyperlink,
          title: el.innerText,
        },
        type: EBuildInHandlers.HYPERLINK,
      };
    }

    if (el.tagName === "A") {
      return {
        value: {
          link: el.getAttribute("href"),
          title: el.innerText,
        },
        type: EBuildInHandlers.HYPERLINK,
      };
    }

    //  image
    const firstChild = el.childNodes[0] as HTMLElement;
    //  google sheet cell image
    //  span > img
    if (
      firstChild &&
      el.childNodes.length === 1 &&
      firstChild.tagName === "IMG"
    ) {
      return {
        value: {
          link: firstChild.getAttribute("src"),
          title: firstChild.title,
        },
        type: EBuildInHandlers.IMAGE,
      };
    }

    //  image tag
    if (el.tagName === "IMG") {
      return {
        value: {
          link: el.getAttribute("src"),
          title: el.title,
        },
        type: EBuildInHandlers.IMAGE,
      };
    }

    return false;
  }
}
