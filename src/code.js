import { compact } from "lodash";
figma.showUI(__html__, { height: 340, width: 240 });
const itemsPerRow = 4;
const gridSpacing = 60;
function calculateNodeSurfaceArea(node) {
    return node.height * node.width;
}
function calculateAverageSurfaceArea(nodes) {
    const sufaceAreas = nodes.map((node) => calculateNodeSurfaceArea(node));
    return Math.floor(sufaceAreas.reduce((a, b) => a + b) / sufaceAreas.length);
}
function resizeNode(node, surfaceArea) {
    const aspectRatio = node.height / node.width;
    const maxWidth = calculateMaxWidth(surfaceArea, node.width, node.height);
    const newWidth = maxWidth;
    const newHeight = newWidth * aspectRatio;
    node.resize(newWidth, newHeight);
}
function resizeNodes(nodes, surfaceArea) {
    nodes.forEach((node) => resizeNode(node, surfaceArea));
}
function chunkArrayIntoGroups(arr, groupSize) {
    var myArray = [];
    for (var i = 0; i < arr.length; i += groupSize) {
        myArray.push(arr.slice(i, i + groupSize));
    }
    return myArray;
}
function calculateMaxRowHeight(nodes) {
    const nodeHeights = nodes.map((node) => node.height);
    return Math.max(...nodeHeights);
}
function calculateRowYOffset(rows, rowIndex) {
    if (rowIndex === 0) {
        return 0;
    }
    else {
        const previousRowMaxHeights = compact(rows.map((previousRow, previousRowIndex) => {
            if (previousRowIndex < rowIndex) {
                return calculateMaxRowHeight(previousRow);
            }
        }));
        const sumOfMaxHeights = previousRowMaxHeights.reduce(function (a, b) {
            return a + b;
        }, 0);
        return sumOfMaxHeights + (gridSpacing * rowIndex - 1);
    }
}
function positionNodes(nodes) {
    const origin = { x: nodes[0].x, y: nodes[0].x };
    const rows = chunkArrayIntoGroups(nodes, itemsPerRow);
    rows.forEach((row, rowIndex) => {
        const rowMaxHeight = calculateMaxRowHeight(row);
        const rowYOffset = calculateRowYOffset(rows, rowIndex);
        row.forEach((node, nodeIndex) => {
            if (nodeIndex === 0) {
                node.x = origin.x;
            }
            else {
                const previousNode = row[nodeIndex - 1];
                node.x = previousNode.x + previousNode.width + gridSpacing;
            }
            node.y = Math.floor(origin.y + rowYOffset + (rowMaxHeight - node.height) / 2);
        });
    });
}
function traverseSelection() {
    const logoNodes = [];
    const selection = figma.currentPage.selection;
    // Store valid selected nodes
    for (const selectedNode of selection) {
        if (selectedNode.type === "RECTANGLE" ||
            selectedNode.type === "VECTOR" ||
            selectedNode.type === "FRAME") {
            logoNodes.push(selectedNode);
        }
    }
    // Run transformations
    const averageSurfaceArea = calculateAverageSurfaceArea(logoNodes);
    resizeNodes(logoNodes, averageSurfaceArea);
    positionNodes(logoNodes);
}
/**
 * Returns a `max-width` value for a logo based on a desired surface area and the logo’s natural width and height. Useful for making a set of logos with very different aspect ratios appear evenly sized.
 */
function calculateMaxWidth(area, width, height) {
    const maxWidth = Math.round(width * Math.sqrt(area / (width * height)));
    return maxWidth;
}
figma.ui.onmessage = (pluginMessage) => {
    if (pluginMessage.type === "run-plugin") {
        traverseSelection();
    }
};
