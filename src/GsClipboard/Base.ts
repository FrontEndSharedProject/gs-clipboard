import { EBuildInHandlers, Handler } from "@/GsClipboard/handlers";
import {
  ClipboardTypes,
  CopyDataItemFormat,
  EventsDef,
  GsClipboardOptions,
  SetCopyArgs,
} from "@/types";
import { isArray, isEmpty, isPlainObject, isString } from "lodash-es";
import { is2dArray, isEmptyArray } from "@/helper/helper";
import { builtInHandlers } from "@/GsClipboard/handlers/index";
import { EContentType } from "@/enum";
import { TableParser } from "@/GsClipboard/parser";
import { UnknownHtmlParser } from "@/GsClipboard/UnknownHtmlParser";

export class Base {
  protected handles: Record<string, Handler> = {};
  protected props: Partial<GsClipboardOptions> = {};

  protected evenHandles: Partial<
    Record<keyof EventsDef, EventsDef[keyof EventsDef][]>
  > = {};

  public destroy() {
    this.handles = {};
  }

  protected registerHandler(handlers: Handler[]) {
    [...handlers, ...builtInHandlers].map((handler) => {
      this.handles[handler.type] = handler;
    });
  }

  protected formatSetCopyData(data: SetCopyArgs): CopyDataItemFormat[][] {
    //  is string
    if (isString(data)) {
      return [
        [
          {
            value: data,
            type: this.handles[EBuildInHandlers.PLAIN].type,
          },
        ],
      ];
    }

    //  is CopyDataItemFormat
    if (isPlainObject(data)) {
      return [[data as CopyDataItemFormat]];
    }

    //  is array
    if (isArray(data)) {
      //  two-dimensional
      if (!is2dArray(data)) {
        data = [
          data.map<CopyDataItemFormat>((item) => {
            if (isString(item)) {
              return {
                value: item,
                type: this.handles[EBuildInHandlers.PLAIN].type,
              };
            } else {
              return item as CopyDataItemFormat;
            }
          }),
        ];
      }

      //  if is string[][]
      data = data.map<CopyDataItemFormat[]>(
        //  @ts-ignore
        (row: Array<string | CopyDataItemFormat>) => {
          return row.map<CopyDataItemFormat>((item) => {
            if (isString(item)) {
              return {
                value: item,
                type: this.handles[EBuildInHandlers.PLAIN].type,
              };
            } else {
              return item as CopyDataItemFormat;
            }
          });
        }
      );

      return data;
    }

    console.error("unknown data type", data);
    return [];
  }

  /**
   * transform copy data to text
   * @param data
   * @protected
   */
  protected getTextData(data: CopyDataItemFormat[][]): string {
    let text: string = "";
    data.map((row, index) => {
      row.map((item, _index) => {
        const { value, type } = item;
        text += (
          this.handles[type] ?? this.handles[EBuildInHandlers.PLAIN]
        ).toText(value);
        text += _index < row.length - 1 ? "\t" : "";
      });
      text += index < data.length - 1 ? "\n" : "";
    });

    return text;
  }

  /**
   * transform copy data to html
   * @param data
   * @protected
   */
  protected getHtmlData(data: CopyDataItemFormat[][]): string {
    let trs: string = "";

    //  if only have 1 item in data
    if (data.length === 1 && data[0].length === 1) {
      const { type, value } = data[0][0];
      return (
        this.handles[type] ?? this.handles[EBuildInHandlers.PLAIN]
      ).toHtml(value);
    }

    data.map((row, index) => {
      trs += `<tr>`;
      row.map((item, _index) => {
        const { value, type } = item;
        trs += `<td>${(
          this.handles[type] ?? this.handles[EBuildInHandlers.PLAIN]
        ).toHtml(value)}</td>`;
      });
      trs += `</tr>`;
    });

    return `<table id="gs-clipboard-table"><tbody>${trs}</tbody></table>`;
  }

  /**
   * format data from clipboard
   * @param data
   * @protected
   */
  protected async formatClipboardData(
    data: ClipboardItem
  ): Promise<ClipboardTypes> {
    const typesData: ClipboardTypes = {
      text: "",
      html: "",
      clipboardType: [],
    };

    //
    //  if is a plain text
    //
    if (!data.types.includes(EContentType.HTML)) {
      const blob = await data.getType(EContentType.PLAIN);
      const text = await blob.text();
      typesData.text = text;
      typesData.html = text;
      typesData.clipboardType = [
        [
          {
            value: text,
            type: this.handles[EBuildInHandlers.PLAIN].type,
          },
        ],
      ];
      return typesData;
    }

    //  parse html
    const blobHtml = await data.getType(EContentType.HTML);
    const blobText = await data.getType(EContentType.PLAIN);
    const html: string = await blobHtml.text();
    const text: string = await blobText.text();
    const div = document.createElement("div") as HTMLDivElement;
    div.innerHTML = html;

    const originalDataDiv = div.querySelector(
      "#original-data"
    ) as HTMLDivElement;

    //
    //  if clipboard data from the gs clipboard
    //
    if (div.querySelector("#gs-clipboard-table") || originalDataDiv) {
      typesData.text = text;
      typesData.html = html;
      typesData.clipboardType = JSON.parse(
        decodeURIComponent(originalDataDiv.dataset.data)
      ) as CopyDataItemFormat[][];
    }

    //
    //  if clipboard data from others side, like google sheet
    //
    else {
      //
      //  if can find the table inside html
      if (div.querySelector("table")) {
        typesData.text = text;
        typesData.html = html;
        let clipboardType: CopyDataItemFormat[][] = [];

        //  call custom parser
        if (this.props.tableParsers.length > 0) {
          for (let i = 0; i < this.props.tableParsers.length; i++) {
            if (this.props.tableParsers[i].detectRule(html)) {
              const output = this.props.tableParsers[i].parser(html);
              if (!isEmptyArray(output)) {
                clipboardType = output;
                break;
              }
            }
          }
        }

        //  use build in parser
        if (isEmpty(clipboardType) || isEmptyArray(clipboardType)) {
          clipboardType = TableParser(html);
        }

        typesData.clipboardType = clipboardType;
      }

      //
      //  cant find the table inside html
      else {
        let parsedData = null;

        if (this.props.unknownHtmlParser) {
          parsedData = this.props.unknownHtmlParser(html);
        }

        parsedData = !parsedData ? UnknownHtmlParser.parse(html) : parsedData;

        if (!parsedData) {
          parsedData = {
            value: text,
            type: this.handles[EBuildInHandlers.PLAIN].type,
          };
        }

        typesData.text = text;
        typesData.html = html;

        if (isPlainObject(parsedData)) {
          typesData.clipboardType = [[parsedData]];
        }

        if (isArray(parsedData)) {
          if (is2dArray(parsedData)) {
            typesData.clipboardType = parsedData;
          } else {
            typesData.clipboardType = [parsedData];
          }
        }
      }
    }

    return typesData;
  }

  protected getClipboardTypeData(
    data: CopyDataItemFormat[][]
  ): CopyDataItemFormat[][] {
    return data;
  }

  // event binding.
  public on<K extends keyof EventsDef, H extends EventsDef>(
    event: K,
    handler: H[K]
  ): Function {
    if (!isArray(this.evenHandles[event])) {
      this.evenHandles[event] = [];
    }

    this.evenHandles[event].push(handler);
    return () => {
      this.evenHandles[event].splice(
        this.evenHandles[event].indexOf(handler),
        1
      );
    };
  }

  // event trigger
  protected trigger<K extends keyof EventsDef>(
    event: K,
    ...args: Parameters<EventsDef[K]>
  ): void {
    if (!isArray(this.evenHandles[event])) {
      return void 0;
    }

    for (let i = 0; i < this.evenHandles[event].length; i++) {
      const h = this.evenHandles[event][i];
      // @ts-ignore
      h(...args);
    }
  }
}
