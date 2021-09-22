import { IState } from "./ui"

interface SurfaceAreaData {
  surfaceArea: number
}

export interface IPluginMessage {
  type: string
  data?: IState
}

export interface Coordinates {
  x: number
  y: number
}
