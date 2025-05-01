import { Question } from './question';

export class Survey {
    name: string;
    questions: Question[];

    constructor(questions: Question[] = [], name: string = "") {
        this.questions = questions;
        this.name = name;
    }
    setName(name: string) {
        this.name = name;
    }
    updateQuestions(questions: Question[]) {
        this.questions = questions;
    }
    
    addQuestion(question: Question): void {
        this.questions.push(question);
        this.validateTreeStructure();
    }

    // Enable a node and all its children
    enable(node: Question): void {
        node.isEnabled = true;
        node.children.forEach(child => this.enable(child));
    }

    // Disable a node and all its children
    disable(node: Question): void {
        node.isEnabled = false;
        node.children.forEach(child => this.disable(child));
    }

    // Complete a node
    complete(node: Question): void {
        node.isCompleted = true;
    }

    // Reset a node to incomplete
    resetCompletion(node: Question): void {
        node.isCompleted = false;
    }

    // Traverse the tree breadth-first with a filter
    traverse(filter?: (node: Question) => boolean): Question[] {
        let result = [] as Question[]
        for (const question of this.questions) {
            result = result.concat(question.traverse(filter))
        }
        return result
    }

    // Find the first node that matches the filter
    first(filter: (node: Question) => boolean): Question | null {
       for (const question of this.questions) {
            const result = question.first(filter);
            if (result) return result;
        }
        return null;
    }

    // Find the last node that matches the filter
    last(filter: (node: Question) => boolean): Question | null {
        for (const question of this.questions.reverse()) {
            const result = question.last(filter);
            if (result) return result;
        }
        return null;
    }

    // Count the number of nodes that match the filter
    count(filter: (node: Question) => boolean): number {
        let count = 0;
        for (const question of this.questions) {
            count += question.count(filter);
            
        }
        return count;
    }
    private validateTreeStructure(): void {
         for (const question of this.questions) {
            if(question.children.includes(question)){
                throw Error("Tree contains itself as a child");
            }
        }
    }
}
