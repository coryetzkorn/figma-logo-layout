interface SurfaceAreaData {
  surfaceArea: number
}

export interface IPluginMessage {
  type: string
  data?: SurfaceAreaData
}

export interface Coordinates {
  x: number
  y: number
}
