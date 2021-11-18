import {
  ClipboardTypes,
  CopyDataItemFormat,
  GsClipboardOptions,
  SetCopyArgs,
} from "@/types";
import { Base } from "@/GsClipboard/Base";
import { EContentType } from "@/enum";
import { isEmptyArray } from "@/helper/helper";
import { isArray, isPlainObject } from "lodash-es";

const defaultGridOptions: Partial<GsClipboardOptions> = {
  handlers: [],
  tableParsers: [],
};

class GsClipboard extends Base {
  constructor(props: GsClipboardOptions = {}) {
    super();

    if (window.navigator?.clipboard?.read) {
      this.props = Object.assign(defaultGridOptions, props);
      this.registerHandler(this.props.handlers);
    } else {
      throw new Error(`You browser didn't support clipboard api!`);
    }
  }

  public async getDataFromClipboard(): Promise<ClipboardTypes> {
    return new Promise<any>((res, rej) => {
      window.navigator.clipboard.read().then(
        async (ClipboardItems: ClipboardItems) => {
          const data = ClipboardItems[0];
          res(
            this.transformClipboardData(await this.formatClipboardData(data))
          );
        },
        (_rej) => rej(_rej)
      );
    });
  }

  public setCopy(data: SetCopyArgs) {
    return this.setCopyData(this.formatSetCopyData(data));
  }

  public formatCopyData(data: SetCopyArgs) {
    return this.setCopyData(this.formatSetCopyData(data), true);
  }

  /**
   * parse clipboard data before getDataFromClipboard return
   * @param data
   * @private
   */
  private transformClipboardData(data: ClipboardTypes): ClipboardTypes {
    if (!isEmptyArray(data.clipboardType)) {
      data.clipboardType.map((row) => {
        if (isArray(row)) {
          row.map((item) => {
            item.value = this.handles[item.type]
              ? this.handles[item.type].parse(item.value)
              : item.value;
          });
        } else if (isPlainObject(row)) {
          row.value = this.handles[row.type]
            ? this.handles[row.type].parse(row.value)
            : row.value;
        }
      });
    }
    return data;
  }

  private setCopyData(
    data: CopyDataItemFormat[][],
    returnOnly: boolean = false
  ): ClipboardTypes {
    const clipboardTypes: ClipboardTypes = {
      text: this.getTextData(data),
      html: this.getHtmlData(data),
      clipboardType: this.getClipboardTypeData(data),
    };

    if (returnOnly) return clipboardTypes;

    this.trigger("beforeCopy", clipboardTypes);

    //  write it into clipboard
    const copyData = [
      new ClipboardItem({
        [EContentType.PLAIN]: new Blob([clipboardTypes.text], {
          type: EContentType.PLAIN,
        }),
        [EContentType.HTML]: new Blob(
          [
            clipboardTypes.html +
              //  Nov 2021, chrome have not support others content-type
              //  should set original data inside html
              `<div id="original-data" data-data="${encodeURIComponent(
                JSON.stringify(clipboardTypes.clipboardType)
              )}"></div>`,
          ],
          {
            type: EContentType.HTML,
          }
        ),
      }),
    ];

    window.navigator.clipboard.write(copyData).then(
      () => this.trigger("copySucceeded", copyData),
      (rej) => this.trigger("copyFailed", rej)
    );

    return clipboardTypes;
  }
}

export { GsClipboard };
