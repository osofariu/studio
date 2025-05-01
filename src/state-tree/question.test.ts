import { describe, expect, it } from "@jest/globals";
import { Question } from "./question";

describe("Question", () => {
  describe("traverse", () => {

    it("should visit all nodes in a simple tree", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const nodes = root.traverse();
      const nodeNames = nodes.map((node) => node.name);
      expect(nodeNames).toEqual(["Root", "Child 1", "Child 2"]);
    });

    it("should visit all nodes in a nested tree", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      const grandchild1 = new Question("Grandchild 1");
      child1.children = [grandchild1];
      root.children = [child1, child2];

      const nodes = root.traverse();
      const nodeNames = nodes.map((node) => node.name);
      expect(nodeNames).toEqual([
        "Root",
        "Child 1",
        "Grandchild 1",
        "Child 2",
      ]);
    });

    it("should visit only nodes that match the filter", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1", false); // Disabled
      const child2 = new Question("Child 2");
      const grandchild1 = new Question("Grandchild 1", false); // Disabled
      child1.children = [grandchild1];
      root.children = [child1, child2];

      const nodes = root.traverse((node) => node.isEnabled);
      const nodeNames = nodes.map((node) => node.name);
      expect(nodeNames).toEqual(["Root", "Child 2"]);
    });

    it("should visit only enabled nodes", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1", false); // Disabled
      const child2 = new Question("Child 2");
      const grandchild1 = new Question("Grandchild 1", false); // Disabled
      child1.children = [grandchild1];
      root.children = [child1, child2];

      const nodes = root.traverse((node) => node.isEnabled);
      const nodeNames = nodes.map((node) => node.name);
      expect(nodeNames).toEqual(["Root", "Child 2"]);
    });

    it("should visit only uncompleted nodes", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1", true, true); // Completed
      const child2 = new Question("Child 2");
      const grandchild1 = new Question("Grandchild 1", true, true); // Completed
      child1.children = [grandchild1];
      root.children = [child1, child2];

      const nodes = root.traverse((node) => !node.isCompleted);
      const nodeNames = nodes.map((node) => node.name);
      expect(nodeNames).toEqual(["Root", "Child 2"]);
    });




    it("should return all nodes when no filter is provided", () => {
        const root = new Question("Root");
        const child1 = new Question("Child 1");
        root.children = [child1];
        const nodes = root.traverse()
        expect(nodes.length).toBe(2)
      });
  });

  describe("first", () => {
    it("should find the root when the filter matches the root", () => {
      const root = new Question("Root");
      const result = root.first((node) => node.name === "Root");
      expect(result).toBe(root);
    });

    it("should find a child node when the filter matches a child", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const result = root.first((node) => node.name === "Child 2");
      expect(result).toBe(child2);
    });

    it("should find a grandchild node when the filter matches a grandchild", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const grandchild1 = new Question("Grandchild 1");
      child1.children = [grandchild1];
      root.children = [child1];

      const result = root.first((node) => node.name === "Grandchild 1");
      expect(result).toBe(grandchild1);
    });

    it("should return null when no nodes match the filter", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      root.children = [child1];

      const result = root.first((node) => node.name === "NonExistent");
      expect(result).toBeNull();
    })
  });

  describe("last", () => {
    it("should find the last node when the filter matches the last node", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const result = root.last((node) => node.name.startsWith("Child"));
      expect(result).toBe(child2);
    });

    it("should find the last node when the filter matches a middle node", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      const child3 = new Question("Child 3");
      root.children = [child1, child2, child3];

      const result = root.last((node) => node.name.startsWith("Child"));
      expect(result).toBe(child3);
    });

    it("should return null when no nodes match the filter", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const result = root.last((node) => node.name === "NonExistent");
      expect(result).toBeNull();
    });
    
    it("should find the last node in a nested tree", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      const grandchild1 = new Question("Grandchild 1");
      const grandchild2 = new Question("Grandchild 2");
      child1.children = [grandchild1];
      child2.children = [grandchild2];
      root.children = [child1, child2];

      const result = root.last((node) => node.name.startsWith("Grandchild"));
      expect(result).toBe(grandchild2);
    });
  });

  describe("count", () => {
    it("should count zero nodes when no nodes match the filter", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const result = root.count((node) => node.name === "NonExistent");
      expect(result).toBe(0);
    });

    it("should count one node when one node matches the filter", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const result = root.count((node) => node.name === "Child 1");
      expect(result).toBe(1);
    });

    it("should count multiple nodes when multiple nodes match the filter", () => {
      const root = new Question("Root");
      const child1 = new Question("Child 1");
      const child2 = new Question("Child 2");
      root.children = [child1, child2];

      const result = root.count((node) => node.name.startsWith("Child"));
      expect(result).toBe(2);
    });
  });
});
