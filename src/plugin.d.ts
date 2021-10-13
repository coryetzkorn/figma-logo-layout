export interface IPluginMessage {
  type: string
  data?: IPluginState
}

export type Alignment = "left" | "center" | "right" | "justified"

export interface IPluginState {
  alignment: Alignment
  gridGap: number
  rowCount: number
}

export interface ICoordinates {
  x: number
  y: number
}

export type ScalableNode =
  | RectangleNode
  | VectorNode
  | FrameNode
  | GroupNode
  | EllipseNode
  | InstanceNode
  | ComponentNode
  | PolygonNode
