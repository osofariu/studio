export interface QuestionTree  {
    name: string;
    isEnabled: boolean;
    isCompleted: boolean;
    children: QuestionTree[];
    traverse(filter?: (node: QuestionTree) => boolean): QuestionTree[];
    first(filter?: (node: QuestionTree) => boolean): QuestionTree | null;
    last(filter?: (node: QuestionTree) => boolean): QuestionTree | null;
    count(filter: (node: QuestionTree) => boolean): number;
}

export class Question implements QuestionTree {
    name: string = '';
    isEnabled: boolean = true;
    isCompleted: boolean = false;
    children: Question[] = [];

    constructor(name: string, isEnabled: boolean = true, isCompleted: boolean = false, children: Question[] = []        ) {
        this.name = name;
        this.isEnabled = isEnabled;
        this.isCompleted = isCompleted;
        this.children = children;
    }

    first(filter?: (node: Question) => boolean): Question | null {
        let result: Question | null = null;
        const traverse = (node: Question) => {
            if (filter && !filter(node)) {                
                node.children.forEach(traverse);
                return;
            }
            result = node;
            return;
        };
        traverse(this);
        return result;
    }

    last(filter?: (node: Question) => boolean): Question | null {
      let result: Question | null = null;
      const traverse = (node: Question) => {
          node.children.forEach(traverse);
          if (filter && !filter(node)) {
              return;
          }
          result = node;
      };
      traverse(this);
      return result;
    }

    count(filter: (node: Question) => boolean): number {
      let count = 0;
      const traverse = (node: Question) => {
          if (filter && filter(node)) {
              count++;
          }
          node.children.forEach(traverse);
      };
      traverse(this);
      return count;
    }
        
    traverse(filter?: (node: Question) => boolean): Question[] {
        const result: QuestionTree[] = [];
        const traverse = (node: QuestionTree) => {
            if (filter && !filter(node)) return;
            result.push(node);
              node.children.forEach(traverse);            
        }
        traverse(this);
        return result    
    }
}
