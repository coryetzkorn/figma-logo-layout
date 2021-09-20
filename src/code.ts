import { Coordinates, IPluginMessage } from "./plugin"
import { compact } from "lodash"
import { IState } from "./ui"

figma.showUI(__html__, { height: 200, width: 240 })

type ScalableNode = RectangleNode | VectorNode | FrameNode

function calculateNodeSurfaceArea(node: ScalableNode): number {
  return node.height * node.width
}

function calculateAverageSurfaceArea(nodes: ScalableNode[]): number {
  const sufaceAreas = nodes.map((node) => calculateNodeSurfaceArea(node))
  return Math.floor(sufaceAreas.reduce((a, b) => a + b) / nodes.length)
}

function calculateMaxWidth(surfaceArea: number, width: number, height: number) {
  const maxWidth = Math.round(width * Math.sqrt(surfaceArea / (width * height)))
  return maxWidth
}

function resizeNode(node: ScalableNode, surfaceArea: number) {
  const aspectRatio = node.height / node.width
  const maxWidth = calculateMaxWidth(surfaceArea, node.width, node.height)
  const newWidth = maxWidth
  const newHeight = newWidth * aspectRatio
  node.resize(newWidth, newHeight)
}

function resizeNodes(nodes: ScalableNode[], surfaceArea: number) {
  nodes.forEach((node) => resizeNode(node, surfaceArea))
}

function chunkArrayIntoGroups(
  arr: Array<ScalableNode>,
  groupSize: number
): Array<Array<ScalableNode>> {
  var myArray = []
  for (var i = 0; i < arr.length; i += groupSize) {
    myArray.push(arr.slice(i, i + groupSize))
  }
  return myArray
}

function calculateRowMaxHeights(rows: Array<ScalableNode[]>, state: IState) {
  return rows.map((row) => {
    const nodeHeights = row.map((node) => node.height)
    return Math.max(...nodeHeights)
  })
}

function calculateRowYOffsets(rowMaxHeights: Array<number>, state: IState) {
  return rowMaxHeights.map((rowMaxHeight, index) => {
    if (index === 0) {
      return 0
    }
    const heightsToAdd = rowMaxHeights.slice(0, index)
    const sumOfHeights = heightsToAdd.reduce((a, b) => a + b)
    const sumOfPadding = state.gridGap * index
    return sumOfHeights + sumOfPadding
  })
}

function calculateRowXOffsets(rows: Array<ScalableNode[]>, state: IState) {
  const rowWidths = rows.map((row) => {
    const sumOfRowWidths = row
      .map((node) => node.width)
      .reduce(function (a, b) {
        return a + b
      }, 0)
    const sumOfGapWidths = state.gridGap * (row.length - 1)
    const totalWidth = sumOfRowWidths + sumOfGapWidths
    return totalWidth
  })
  const largestWidth = Math.max(...rowWidths)
  return rowWidths.map((rowWidth) => {
    if (rowWidth === largestWidth) {
      return 0
    }
    switch (state.alignment) {
      case "left":
        return 0
      case "center":
        return Math.floor((largestWidth - rowWidth) / 2)
      case "right":
        return largestWidth - rowWidth
    }
  })
}

function positionNodes(rows: Array<ScalableNode[]>, state: IState) {
  const firstRow = rows[0]
  const origin: Coordinates = { x: firstRow[0].x, y: firstRow[0].x }
  const rowMaxHeights = calculateRowMaxHeights(rows, state)
  const rowYOffsets = calculateRowYOffsets(rowMaxHeights, state)
  const rowXOffsets = calculateRowXOffsets(rows, state)
  rows.forEach((row, rowIndex) => {
    const rowMaxHeight = rowMaxHeights[rowIndex]
    const rowYOffset = rowYOffsets[rowIndex]
    const rowXOffset = rowXOffsets[rowIndex]
    row.forEach((node, nodeIndex) => {
      if (nodeIndex === 0) {
        node.x = origin.x + rowXOffset
      } else {
        const previousNode = row[nodeIndex - 1]
        node.x = previousNode.x + previousNode.width + state.gridGap
      }
      node.y = Math.floor(
        origin.y + rowYOffset + (rowMaxHeight - node.height) / 2
      )
    })
  })
}

function sortNodesTopToBottom(nodes: ScalableNode[]) {
  return nodes.sort(function (a, b) {
    return a.y - b.y
  })
}

function sortRowNodesLeftToRight(rows: Array<ScalableNode[]>) {
  return rows.map((row) =>
    row.sort(function (a, b) {
      return a.x - b.x
    })
  )
}

function runPlugin(state: IState) {
  const logoNodes: ScalableNode[] = []
  const selection = figma.currentPage.selection
  // Store valid selected nodes
  for (const selectedNode of selection) {
    if (
      selectedNode.type === "RECTANGLE" ||
      selectedNode.type === "VECTOR" ||
      selectedNode.type === "FRAME"
    ) {
      logoNodes.push(selectedNode)
    }
  }
  // Sort nodes by canvas position
  const sortedNodes = sortNodesTopToBottom(logoNodes)
  // Split nodes into rows
  const safeRowCount =
    state.rowCount < sortedNodes.length ? state.rowCount : sortedNodes.length
  const itemsPerRow = Math.ceil(sortedNodes.length / safeRowCount)
  const rows = chunkArrayIntoGroups(sortedNodes, itemsPerRow)
  const sortedRows = sortRowNodesLeftToRight(rows)
  // Run transformations
  const averageSurfaceArea = calculateAverageSurfaceArea(sortedNodes)
  resizeNodes(sortedNodes, averageSurfaceArea)
  // Position nodes
  positionNodes(sortedRows, state)
}

figma.ui.onmessage = (pluginMessage: IPluginMessage) => {
  if (pluginMessage.type === "run-plugin") {
    runPlugin(pluginMessage.data)
  }
}
