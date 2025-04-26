import { TreeNode } from './tree-node';

export class StateTree {
    trees: TreeNode[];

    constructor(trees: TreeNode[] = []) {
        this.trees = trees;
        this.validateTreeStructure();
    }

    addTree(tree: TreeNode): void {
        this.trees.push(tree);
        this.validateTreeStructure();
    }

    // Enable a node and all its children
    enable(node: TreeNode): void {
        node.isEnabled = true;
        node.children.forEach(child => this.enable(child));
    }

    // Disable a node and all its children
    disable(node: TreeNode): void {
        node.isEnabled = false;
        node.children.forEach(child => this.disable(child));
    }

    // Complete a node
    complete(node: TreeNode): void {
        node.isCompleted = true;
    }

    // Reset a node to incomplete
    reset(node: TreeNode): void {
        node.isCompleted = false;
    }

    // Traverse the tree breadth-first with a filter
    traverse(filter?: (node: TreeNode) => boolean): TreeNode[] {
        const results: TreeNode[] = [];
        for (const tree of this.trees) {
            const queue: TreeNode[] = [tree];
            while (queue.length > 0) {
                const node = queue.shift();
                if (!node) continue;

                if (!filter || filter(node)) {
                    results.push(node);
                }

                queue.push(...node.children);
            }
        }
        return results;
    }

    // Find the first node that matches the filter
    first(filter: (node: TreeNode) => boolean): TreeNode | undefined {
        for (const tree of this.trees) {
            const queue: TreeNode[] = [tree];
            while (queue.length > 0) {
                const node = queue.shift();
                if (!node) continue;

                if (filter(node)) {
                    return node;
                }

                queue.push(...node.children);
            }
        }
        return undefined;
    }

    // Count the number of nodes that match the filter
    length(filter: (node: TreeNode) => boolean): number {
        let count = 0;
        for (const tree of this.trees) {
            const queue: TreeNode[] = [tree];
            while (queue.length > 0) {
                const node = queue.shift();
                if (!node) continue;

                if (filter(node)) {
                    count++;
                }

                queue.push(...node.children);
            }
        }
        return count;
    }

    private validateTreeStructure(): void {
        const visited = new Set<TreeNode>();
        for (const tree of this.trees) {
            this.isCyclic(tree, visited, new Set<TreeNode>());
        }
    }

    private isCyclic(node: TreeNode, visited: Set<TreeNode>, recursionStack: Set<TreeNode>): boolean {
        if (recursionStack.has(node)) {
            throw new Error('Cyclic tree structure detected.');
        }

        if (visited.has(node)) {
            return false;
        }

        visited.add(node);
        recursionStack.add(node);

        for (const child of node.children) {
            if (this.isCyclic(child, visited, recursionStack)) {
                return true;
            }
        }

        recursionStack.delete(node);
        return false;
    }
}
