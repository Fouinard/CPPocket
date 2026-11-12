import { ParsedTreeNode, TreeNodeSelectionState } from "@/features/tree/types";
import { ChevronRight } from "@getpapillon/papicons";
import Checkbox from "expo-checkbox";
import { memo } from "react";
import { Text, TouchableOpacity } from "react-native";

interface TreeNodeRowProps {
    node: ParsedTreeNode;
    isExpanded: boolean;
    isLoading: boolean;
    onExpand: (node: ParsedTreeNode) => void;
    onSelect: (node: ParsedTreeNode) => void;
    isSelected: boolean
}

export const TreeNodeRow = memo(
    function TreeNodeRow(props: TreeNodeRowProps) {

        return (
            <TouchableOpacity
                onPress={() => props.onExpand(props.node)}
                className="flex flex-row items-center gap-2"
                style={{ paddingLeft: props.node.level * 16 }}
            >
                {props.node.isExpandable &&
                    <ChevronRight className="fill-primary size-[17px]"
                        //@ts-ignore 
                        style={{ transform: [{ rotate: props.isExpanded ? '90deg' : '0deg' }] }}
                        color="white" />
                }
                {!props.node.isExpandable && props.node.isSelectable && props.node.childrenIds.length == 0 &&
                    <Checkbox
                        value={props.node.selectionState === TreeNodeSelectionState.Selected}
                        onValueChange={() => props.onSelect(props.node)}
                        color={props.isSelected ? '#0055FF' : undefined}
                    />
                }
                <Text numberOfLines={1} className="text-primary font-inter font-medium text-xl">{props.node.label}</Text>
            </TouchableOpacity>
        );
    },
    (prev, next) => {
        return (
            prev.node.id === next.node.id &&
            prev.isExpanded === next.isExpanded &&
            prev.isSelected === next.isSelected
        );
    }
);