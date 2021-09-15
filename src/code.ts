import * as Faker from "faker"
import { IPluginMessage } from "./plugin"

figma.showUI(__html__, { height: 340, width: 240 })

type ScalableNode = RectangleNode | VectorNode

const logoNodes: ScalableNode[] = []

function resizeNode(node: SceneNode, surfaceArea: number) {
  if (node.type === "RECTANGLE" || node.type === "VECTOR") {
    logoNodes.push(node)
    const aspectRatio = node.height / node.width
    const maxWidth = calculateMaxWidth(surfaceArea, node.width, node.height)
    const newWidth = maxWidth
    const newHeight = newWidth * aspectRatio
    node.resize(newWidth, newHeight)
  }
}

function traverseSelection(surfaceArea: number) {
  const selection = figma.currentPage.selection
  for (const selectedNode of selection) {
    resizeNode(selectedNode, surfaceArea)
  }
}

/**
 * Returns a `max-width` value for a logo based on a desired surface area and the logo’s natural width and height. Useful for making a set of logos with very different aspect ratios appear evenly sized.
 * @param area
 * @param width
 * @param height
 */
function calculateMaxWidth(area: number, width: number, height: number) {
  const maxWidth = Math.round(width * Math.sqrt(area / (width * height)))
  return maxWidth
}

figma.ui.onmessage = (pluginMessage: IPluginMessage) => {
  if (pluginMessage.type === "run-plugin") {
    traverseSelection(pluginMessage.data.surfaceArea)
  }
}
