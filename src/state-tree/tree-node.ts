
export interface TreeNode {
    name: string;
    isEnabled: boolean;
    isCompleted: boolean;
    children: TreeNode[];
}

export class TreeNodeBuilder {
    private name: string;
    private isEnabled: boolean = true;
    private isCompleted: boolean = false;
    private children: TreeNode[] = [];

    constructor(name: string) {
        this.name = name;
    }

    setName(name: string): TreeNodeBuilder {
        this.name = name;
        return this;
    }

    setEnabled(isEnabled: boolean): TreeNodeBuilder {
        this.isEnabled = isEnabled;
        return this;
    }

    setCompleted(isCompleted: boolean): TreeNodeBuilder {
        this.isCompleted = isCompleted;
        return this;
    }

    addChild(child: TreeNode): TreeNodeBuilder {
        this.children.push(child);
        return this;
    }

    build(): TreeNode {
        return {
            name: this.name,
            isEnabled: this.isEnabled,
            isCompleted: this.isCompleted,
            children: this.children,
        };
    }
}
