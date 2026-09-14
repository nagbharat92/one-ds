import * as React from "react"

export type HangOffset =
  | boolean
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "card"
  | "8px"
  | "12px"
  | "16px"
  | "24px"
  | "32px"
  | (string & {})
  | number

export function resolveHang(hang: HangOffset | undefined) {
  if (hang === false || hang === "none") {
    return { dataHang: "false", hangStyle: undefined, isHanging: false }
  }
  if (hang === true || hang === undefined) {
    return { dataHang: "true", hangStyle: undefined, isHanging: true }
  }
  if (typeof hang === "number") {
    return {
      dataHang: "custom",
      hangStyle: { "--hang-offset": `${hang}px` } as React.CSSProperties,
      isHanging: true,
    }
  }
  const standardPresets = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "card",
    "8px",
    "12px",
    "16px",
    "24px",
    "32px",
  ]
  if (standardPresets.includes(hang)) {
    return { dataHang: hang, hangStyle: undefined, isHanging: true }
  }
  return {
    dataHang: "custom",
    hangStyle: { "--hang-offset": hang } as React.CSSProperties,
    isHanging: true,
  }
}
