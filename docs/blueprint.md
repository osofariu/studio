# **App Name**: StateTree

## Core Features:

- Tree Data Structure: Implement a Typescript class, complete with all necessary methods, that allows the user to create a tree where each node has children.
- Node Attributes: Adds a name, isEnabled, and isCompleted attributes to the node
- Breadth-First Traversal: Implement the breadth-first traversal logic that will allow the caller to provide some node processing code that will be applied to each node in the data structure.
- Enable Operation: Implement the enable() operation to mark the node and all its children enabled.
- Disable Operation: Implement the disable() operation to mark the node and all its children disabled.
- Complete Operation: Implement the complete() operation to mark the node as complete.
- Reset Operation: Implement the inverse of the complete() operation to mark the node as incomplete.
- Traverse Operation: Implement the traverse(filter) operation to traverse the tree with a filter function. The filter checks for enabled or completed.
- First Operation: Implement the first(filter) operation to return the first node in the tree that matches the filter.
- Length Operation: Implement the length(filter) operation to count the number of nodes that match the filter.
- Input Validation: Add input validation to ensure tree structures are not cyclic and node types are consistent.

## Style Guidelines:

- Primary color: Neutral grays for a clean, code-focused look.
- Secondary color: Soft blues for indicating code elements or interactive components.
- Accent: Teal (#008080) to highlight important information.
- Clean, monospaced font for code snippets and tree representations.
- Simple, geometric icons to represent tree nodes and traversal actions.
- Clear visual hierarchy to distinguish between the tree structure and the library's API documentation.

## Original User Request:
I want to build a typescript npm library for managing state that is in a tree-like structure, more specifically a list of trees.  I will need to be able to navigate this structure in the order in the list, and for each element (tree) I want to nagivate breadth-first.
  