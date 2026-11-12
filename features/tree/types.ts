export type NodeType = "category" | "branch" | "select"

export interface ParentNode {
  id: string;
  type: Extract<NodeType, "category" | "branch">;
}

export const enum TreeNodeSelectionState {
  None = 0,
  Selected = 1,
  Unselected = 2
}

export interface ParsedTreeNode {
  id: string;
  label: string;
  type: NodeType;
  level: number;
  isExpandable: boolean;
  isExpanded: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  parentId: string | null;
  childrenIds: string[];

  selectionState: TreeNodeSelectionState;
}