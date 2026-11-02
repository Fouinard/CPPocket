import { useClassTreeStore } from '@/features/tree/hooks/useClassTreeStore';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ParsedTreeNode } from '../types';

export function useClassTree() {
    const router = useRouter();
    
    const {
        nodesMap,
        expandedNodeIds,
        selectedNodeId,
        loadingNodeId,
        loadInitialTree,
        toggleNodeExpand,
        setSelectedNode,
        getVisibleNodes,
    } = useClassTreeStore();

    const [pendingNode, setPendingNode] = useState<ParsedTreeNode | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    useEffect(() => {
        loadInitialTree();
    }, [loadInitialTree]);

    const visibleNodes = useMemo(() =>{ return getVisibleNodes() }, [nodesMap, expandedNodeIds]);

    const handleNodeExpand = useCallback(async (node: ParsedTreeNode) => {
        await toggleNodeExpand(node.id);
    }, [selectedNodeId, toggleNodeExpand]);

    const handleNodeSelect = useCallback((node: ParsedTreeNode) => {
        if (node.isSelectable) {
            if (selectedNodeId === node.id) return;
            setPendingNode(node);
            setIsAlertVisible(true);
            return;
        }
    }, [selectedNodeId]);

    const handleConfirmSelection = useCallback(async () => {
        if (!pendingNode) return;

        try {
            await setSelectedNode(pendingNode.id);

            setIsAlertVisible(false);
            setPendingNode(null);
            router.push("/schedule/schedule");
        } catch (error) {
            console.error("Erreur lors du changement de classe:", error);
            setIsAlertVisible(false);
            setPendingNode(null);
        }
    }, [pendingNode, setSelectedNode, router]);

    const handleCancelSelection = useCallback(() => {
        setIsAlertVisible(false);
        setPendingNode(null);
    }, []);

    const isNodeSelected = useCallback((node: ParsedTreeNode) => {
        return node.isSelectable && node.id === selectedNodeId;
    }, [selectedNodeId]);

    return {
        visibleNodes,
        expandedNodeIds,
        loadingNodeId,
        isNodeSelected,
        isAlertVisible,
        pendingNode,
        handleNodeExpand,
        handleNodeSelect,
        handleConfirmSelection,
        handleCancelSelection,
    };
}