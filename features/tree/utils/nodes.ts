import { ParsedTreeNode } from "../types";

export function getNodeParents(nodeId: string, nodesMap: Record<string, ParsedTreeNode>): ParsedTreeNode[] {
    const parents: ParsedTreeNode[] = [];
    let current = nodesMap[nodeId];

    while (current && current.parentId) {
        const parent = nodesMap[current.parentId];
        if (!parent) break;
        parents.unshift(parent);
        current = parent;
    }

    return parents;
}

export function getNodeChildren(nodeId: string, nodesMap: Record<string, ParsedTreeNode>): ParsedTreeNode[] {
    const children: ParsedTreeNode[] = nodesMap[nodeId].childrenIds.map(id => nodesMap[id]);
    return children;
}

export function getADEPathList(nodeId: string, nodesMap: Record<string, ParsedTreeNode>): [string, string][] {
    const ancestors = getNodeParents(nodeId, nodesMap);
    const targetNode = nodesMap[nodeId];
    if (!targetNode) return [];

    const pathList: [string, string][] = ancestors.map(parent => [parent.type, parent.id]);
    pathList.push([targetNode.type, targetNode.id]);

    return pathList;
}