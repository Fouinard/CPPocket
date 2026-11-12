// src/features/tree/store/useClassTreeStore.ts
import { ADEApi } from '@/shared/services/ade/adeApi';
import { StorageManager } from '@/shared/services/storage/storage';
import { queryClient } from '@/shared/utils/queryClient';
import { create } from 'zustand';
import { ParsedTreeNode, TreeNodeSelectionState } from '../types';
import { getADEPathList } from '../utils/nodes';

interface ClassTreeState {
    nodesMap: Record<string, ParsedTreeNode>;
    expandedNodeIds: Set<string>;
    selectedNodeId: string | null;
    loadingNodeId: string | null;

    loadInitialTree: () => Promise<void>;
    toggleNodeExpand: (nodeId: string) => Promise<void>;
    setSelectedNode: (nodeId: string) => Promise<void>;

    getVisibleNodes: () => ParsedTreeNode[];
}


export const useClassTreeStore = create<ClassTreeState>((set, get) => ({
    nodesMap: {},
    expandedNodeIds: new Set<string>(),
    selectedNodeId: null,
    loadingNodeId: null,

    loadInitialTree: async () => {
        try {
            set({ loadingNodeId: null });
            const nodesMap = await ADEApi.Tree.fetchTreeRoot();

            const newExpanded = new Set<string>();
            let initialSelectedId: string | null = null;

            for (const id in nodesMap) {
                const node = nodesMap[id];
                if (node.isExpanded) {
                    newExpanded.add(node.id);
                }
                if (node.isSelectable && node.isSelected) {
                    initialSelectedId = node.id;
                }
            }

            set({ nodesMap, expandedNodeIds: newExpanded, selectedNodeId: initialSelectedId });
        } finally {
            set({ loadingNodeId: null });
        }
    },

    toggleNodeExpand: async (nodeId: string) => {
        const { nodesMap, expandedNodeIds } = get();
        const node = nodesMap[nodeId];
        if (!node || !node.isExpandable) return;

        node.isExpanded = !node.isExpanded;

        if (expandedNodeIds.has(nodeId)) {
            const next = new Set(expandedNodeIds);
            next.delete(nodeId);
            set({ expandedNodeIds: next });
            return;
        }

        if (node.childrenIds.length > 0) {
            set({ expandedNodeIds: new Set(expandedNodeIds).add(nodeId) });
            return;
        }

        try {
            set({ loadingNodeId: nodeId });
            const updatedMap = await ADEApi.Tree.expandNode(nodeId, node.type);

            set(state => {
                const mergedMap = { ...state.nodesMap };

                for (const [id, newNode] of Object.entries(updatedMap)) {
                    if (mergedMap[id]) {
                        mergedMap[id] = {
                            ...newNode,
                            childrenIds: updatedMap[id].childrenIds,
                            selectionState: mergedMap[id].selectionState,
                            isExpanded: nodeId === id ? updatedMap[id].isExpanded : mergedMap[id].isExpanded,
                        };
                    } else {
                        mergedMap[id] = newNode;
                    }
                }

                return {
                    nodesMap: mergedMap,
                    expandedNodeIds: new Set(state.expandedNodeIds).add(nodeId),
                };
            });
        } finally {
            set({ loadingNodeId: null });
        }
    },
    setSelectedNode: async (nodeId: string) => {
        const { nodesMap, selectedNodeId } = get();
        const targetNode = nodesMap[nodeId];
        if (!targetNode || !targetNode.isSelectable) return;

        try {
            await ADEApi.Tree.selectNode(targetNode.id);
            if (selectedNodeId && selectedNodeId !== targetNode.id) {
                await ADEApi.Tree.selectNode(selectedNodeId);
            }

            const pathList = getADEPathList(targetNode.id, nodesMap);
            await StorageManager.Default.set("ADEClassTreeList", pathList);

            queryClient.removeQueries({ queryKey: ["schedule-day"] });

            set(state => {
                const updatedMap = { ...state.nodesMap };
                if (state.selectedNodeId && updatedMap[state.selectedNodeId]) {
                    updatedMap[state.selectedNodeId] = { ...updatedMap[state.selectedNodeId], selectionState: TreeNodeSelectionState.Unselected };
                }
                updatedMap[targetNode.id] = { ...updatedMap[targetNode.id], selectionState: TreeNodeSelectionState.Selected };

                return {
                    nodesMap: updatedMap,
                    selectedNodeId: targetNode.id,
                };
            });
        } catch (error) {
            console.error("Erreur lors de la sélection de la classe:", error);
            throw error;
        }
    },

    getVisibleNodes: () => {
        const { nodesMap, expandedNodeIds } = get();
        const visible: ParsedTreeNode[] = [];

        const traverse = (nodeId: string) => {
            const node = nodesMap[nodeId];
            if (!node) return;

            visible.push(node);

            if (expandedNodeIds.has(nodeId) && node.childrenIds) {
                for (const childId of node.childrenIds) {
                    traverse(childId);
                }
            }
        };

        const rootNodes = Object.values(nodesMap).filter(n => n.parentId === null);

        for (const root of rootNodes) {
            traverse(root.id);
        }

        return visible;
    },
}));