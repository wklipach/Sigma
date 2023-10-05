export interface TreeNode {
    // Node
    children: TreeNode[];
    hideChildren?: boolean;
    onClick?: () => void;
    // CSS
    cssClass?: string;
    css?: string;
}
