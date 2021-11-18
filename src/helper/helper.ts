import { isArray } from "lodash-es";
import { EBuildInHandlers } from "@/GsClipboard/handlers";

export function is2dArray(array: any[]): boolean {
  return array.every((item) => isArray(item));
}

export function isEmptyArray(array: any[] | any[][]) {
  if (!isArray(array)) {
    return true;
  }

  if (array.length === 0) {
    return true;
  }

  if (isArray(array[0]) && array[0].length === 0) {
    return true;
  }

  return false;
}

export function attrsObj2String(attrs: Record<string, string>): string {
  let attrsString = "";
  Object.keys(attrs).map((key) => {
    attrsString += ` ${key}="${attrs[key].replace(/"/g, '\\"')}"`;
  });
  return attrsString;
}
