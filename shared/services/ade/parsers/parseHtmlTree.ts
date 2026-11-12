import { NodeType, ParsedTreeNode, TreeNodeSelectionState } from '@/features/tree/types';
import { parse } from 'node-html-parser';
import Logger from '../../logger/Logger';

export default function parseHtmlTree(html: string): Record<string, ParsedTreeNode> {
    Logger.debug("Parsing HTML tree", { html });
    const root = parse(html);
    const nodesMap: Record<string, ParsedTreeNode> = {};
    const treeLines = root.querySelectorAll('div.treeline, div.treelineselected');
    
    const levelParentStack: string[] = [];

    for (const line of treeLines) {
        const rawHtml = line.innerHTML;

        const nbspMatches = rawHtml.match(/&nbsp;/g);
        const level = nbspMatches ? Math.floor(nbspMatches.length / 3) : 0;

        const isExpandable = rawHtml.includes('/plus.gif') || rawHtml.includes('/moins.gif');
        const isExpanded = rawHtml.includes('/moins.gif');
        const isSelectable = line.querySelector('.treecross') !== null || rawHtml.includes('blankTree.gif');
        const isSelected = line.classList.contains('treelineselected');

        const links = line.querySelectorAll('a');
        let actionLink = null;
        let href = '';

        for (const a of links) {
            const h = a.getAttribute('href') || '';
            if (h.includes('javascript:')) {
                const text = a.textContent.trim();
                if (text.length > 0) {
                    actionLink = a;
                    href = h;
                    break;
                }
            }
        }

        if (!actionLink) {
            for (const a of links) {
                const h = a.getAttribute('href') || '';
                if (h.includes('openCategory') || h.includes('openBranch') || h.includes('check')) {
                    href = h;
                    break;
                }
            }
        }

        if (!href) continue;

        const funcMatch = href.match(/javascript:([a-zA-Z]+)\(([^)]+)\)/);
        if (!funcMatch) continue;

        const [, funcName, rawArgs] = funcMatch;
        const nodeId = rawArgs.split(',')[0].replace(/['";]/g, '').trim();
        const label = actionLink ? actionLink.textContent.trim() : line.textContent.replace(/&nbsp;/g, '').trim();

        let type: NodeType = 'branch';
        if (line.querySelector('.treecategory') !== null) {
            type = 'category';
        } else if (line.querySelector('.treeitem') !== null) {
            type = 'select';
        }

        levelParentStack.length = level;
        const parentId = level > 0 ? levelParentStack[level - 1] : '__root';

        if (type === 'category' || type === 'branch') {
            levelParentStack[level] = nodeId;
        }

        const newNode: ParsedTreeNode = {
            id: nodeId,
            label,
            type,
            level,
            isExpandable,
            isSelectable: isSelectable,
            parentId,
            childrenIds: [],
            isExpanded,
            isSelected,
            selectionState: isSelectable ? (isSelected ? TreeNodeSelectionState.Selected : TreeNodeSelectionState.Unselected) : TreeNodeSelectionState.None
        };

        nodesMap[nodeId] = newNode;

        if (parentId && nodesMap[parentId]) {
            if (!nodesMap[parentId]?.childrenIds.includes(nodeId)) {
                nodesMap[parentId]?.childrenIds.push(nodeId);
                Logger.debug(`Added node ${nodeId} to parent ${parentId}`, null, true);
            }
        }
    }

    Logger.debug("Parsed tree nodes", nodesMap, true);

    return nodesMap;
}