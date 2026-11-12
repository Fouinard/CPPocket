// src/features/tree/screens/ADETreeScreen.tsx
import { TreeConfirmationModal } from '@/features/tree/components/TreeConfirmationModal';
import { TreeNodeRow } from '@/features/tree/components/TreeNodeRow';
import { useClassTree } from '@/features/tree/hooks/useClassTree';
import { ParsedTreeNode } from '@/features/tree/types';
import Logger from '@/shared/services/logger/Logger';
import { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';

export default function ADETreeScreen() {
    Logger.info("Rendering ADETreeScreen");
    const {
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
    } = useClassTree();

    const renderItem = useCallback(({ item }: { item: ParsedTreeNode }) => (
        <TreeNodeRow
            node={item}
            isExpanded={expandedNodeIds.has(item.id)}
            isLoading={loadingNodeId === item.id}
            isSelected={isNodeSelected(item)}
            onExpand={handleNodeExpand}
            onSelect={handleNodeSelect}
        />
    ), [expandedNodeIds, loadingNodeId, handleNodeExpand, handleNodeSelect, isNodeSelected]);

    return (
        <View className="flex-1 pt-16 bg-bg px-5">
            <TreeConfirmationModal
                visible={isAlertVisible}
                pendingNode={pendingNode}
                onCancel={handleCancelSelection}
                onConfirm={handleConfirmSelection}
            />

            <Text className="text-text text-3xl font-semibold mb-2">
                Choisissez votre classe
            </Text>

            <FlatList
                data={visibleNodes}
                keyExtractor={item => `${item.type}-${item.id}`}
                renderItem={renderItem}
                removeClippedSubviews={true}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={7}
                contentContainerClassName='gap-1 pt-5'
            />
        </View>
    );
}