interface SurfaceAreaData {
  surfaceArea: number
}

export interface IPluginMessage {
  type: string
  data?: SurfaceAreaData
}
