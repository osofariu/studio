'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {StateTree} from '@/state-tree/state-tree';
import {TreeNodeBuilder, TreeNode} from '@/state-tree/tree-node';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {ScrollArea} from '@/components/ui/scroll-area';

// Theme import
import './globals.css';

const defaultAccentColor = 'hsl(174, 100%, 29%)';

// Example Tree Data
const initialTreeData: TreeNode[] = [
  new TreeNodeBuilder('Initial Root')
    .setEnabled(true)
    .setCompleted(false)
    .build(),
];

export default function Home() {
  const [stateTree, setStateTree] = useState(new StateTree(initialTreeData));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [newNodeName, setNewNodeName] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const updateNodeName = () => {
    if (selectedNode && newNodeName) {
      setStateTree(prevState => {
        const newStateTree = new StateTree(prevState.trees);
        const nodeToUpdate = newStateTree.first(
          node => node === selectedNode
        );
        if (nodeToUpdate) {
          nodeToUpdate.name = newNodeName;
        }
        return new StateTree(newStateTree.trees);
      });
      setNewNodeName('');
    }
  };

  const addChildNode = () => {
    if (selectedNode && newChildName) {
      setStateTree(prevState => {
        const newStateTree = new StateTree(prevState.trees);
        const nodeToUpdate = newStateTree.first(node => node === selectedNode);
        if (nodeToUpdate) {
          // Check if a child with the same name already exists
          const childExists = nodeToUpdate.children.some(child => child.name === newChildName);
          if (!childExists) {
            const newChild = new TreeNodeBuilder(newChildName).build();
            nodeToUpdate.children = [...nodeToUpdate.children, newChild];

            setExpandedNodes(prevExpandedNodes => {
              const updatedExpandedNodes = new Set(prevExpandedNodes);
              updatedExpandedNodes.add(nodeToUpdate.name);
              updatedExpandedNodes.add(newChild.name);
              return Array.from(updatedExpandedNodes);
            });

            setNewChildName('');
            return new StateTree(newStateTree.trees);
          }
        }
        return new StateTree(prevState.trees);
      });
    }
  };

  const deleteNode = () => {
    if (selectedNode) {
      setStateTree(prevState => {
        let newStateTree = new StateTree(prevState.trees);

        // Function to recursively find and delete the node
        const deleteRecursive = (
          nodes: TreeNode[],
          nodeToDelete: TreeNode
        ): TreeNode[] => {
          return nodes.filter(node => {
            if (node === nodeToDelete) {
              return false; // Exclude the node to delete
            }
            node.children = deleteRecursive(node.children, nodeToDelete); // Check children
            return true; // Keep other nodes
          });
        };

        newStateTree.trees = deleteRecursive(newStateTree.trees, selectedNode);

        // If the tree is empty after deleting the node, add a default root node
        if (newStateTree.trees.length === 0) {
          newStateTree = new StateTree([
            new TreeNodeBuilder('Initial Root')
              .setEnabled(true)
              .setCompleted(false)
              .build(),
          ]);
          setExpandedNodes(['Initial Root']); // Expand the new root node
        }

        return new StateTree(newStateTree.trees);
      });
      setSelectedNode(null); // Clear selection after deletion
    }
  };

  const toggleNodeEnable = () => {
    if (selectedNode) {
      setStateTree(prevState => {
        const newStateTree = new StateTree(prevState.trees);
        const nodeToUpdate = newStateTree.first(node => node === selectedNode);
        if (nodeToUpdate) {
          nodeToUpdate.isEnabled = !nodeToUpdate.isEnabled;
          return new StateTree([...newStateTree.trees]);
        }
        return new StateTree(newStateTree.trees);
      });
    }
  };

  const toggleNodeComplete = () => {
    if (selectedNode) {
      setStateTree(prevState => {
        const newStateTree = new StateTree(prevState.trees);
        const nodeToUpdate = newStateTree.first(node => node === selectedNode);
        if (nodeToUpdate) {
          nodeToUpdate.isCompleted = !nodeToUpdate.isCompleted;
          return new StateTree([...newStateTree.trees]);
        }
        return new StateTree(newStateTree.trees);
      });
    }
  };

  const handleNodeSelection = useCallback((node: TreeNode) => {
    setSelectedNode(node);
  }, []);

  const toggleExpanded = (node: TreeNode) => {
    setExpandedNodes(prevExpandedNodes => {
      const nodeName = node.name;
      const isExpanded = prevExpandedNodes.includes(nodeName);

      if (isExpanded) {
        return prevExpandedNodes.filter(name => name !== nodeName);
      } else {
        return [...prevExpandedNodes, nodeName];
      }
    });
  };

  const handleHeaderClick = (node: TreeNode) => {
    if (selectedNode === node) {
      toggleExpanded(node);
    } else {
      handleNodeSelection(node);
      setExpandedNodes(prevExpandedNodes => {
        const updatedExpandedNodes = new Set(prevExpandedNodes);
        updatedExpandedNodes.add(node.name); // Expand the selected node
        return Array.from(updatedExpandedNodes);
      });
    }
  };

  const displayTree = (trees: TreeNode[], indentLevel: number = 0) => {
    const indent = 1 * indentLevel; // Indent 1rem per level
    return trees.map((node, index) => (
      <AccordionItem
        key={index}
        value={node.name}
      >
        <AccordionTrigger onClick={() => handleHeaderClick(node)}>
          <span style={{ fontWeight: 'bold', fontSize: (indentLevel === 0 ? '1.2rem' : '1rem') }}>{node.name}</span> (
          {node.isEnabled ? 'Enabled' : 'Disabled'},{' '}
          {node.isCompleted ? 'Completed' : 'Incomplete'}
          )
        </AccordionTrigger>
        <AccordionContent style={{ paddingLeft: `${indent}rem` }}>
          {displayTree(node.children, indentLevel + 1)}
        </AccordionContent>
      </AccordionItem>
    ));
  };

  useEffect(() => {
    // Function to expand all nodes in the tree
    const expandAllNodes = (trees: TreeNode[]) => {
      const allNodeNames: string[] = [];
      const traverse = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          allNodeNames.push(node.name);
          traverse(node.children);
        });
      };
      traverse(trees);
      setExpandedNodes(allNodeNames);
    };

    expandAllNodes(stateTree.trees);
  }, [stateTree]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 text-gray-900">
        <Sidebar>
          <SidebarHeader>
            <h4 className="font-semibold text-lg">StateTree Library</h4>
            <p className="text-sm text-gray-500">Manage your tree state</p>
            <SidebarSeparator />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-4 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Tree State Management
          </h2>

          {selectedNode && (
            <div className="mb-4">
              <p className="text-lg font-semibold">Selected Node: {selectedNode.name}</p>
              <Input
                type="text"
                placeholder="New Node Name"
                value={newNodeName}
                onChange={e => setNewNodeName(e.target.value)}
                className="mb-2"
              />
              <Button onClick={updateNodeName}>Update Node Name</Button>

              <Input
                type="text"
                placeholder="New Child Node Name"
                value={newChildName}
                onChange={e => setNewChildName(e.target.value)}
                className="mb-2"
              />
              <Button onClick={addChildNode}>Add Child Node</Button>
              <Button
                onClick={deleteNode}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete Node
              </Button>
              <Button onClick={toggleNodeEnable}>
                {selectedNode.isEnabled ? 'Disable' : 'Enable'} Node
              </Button>
              <Button onClick={toggleNodeComplete}>
                {selectedNode.isCompleted ? 'Reset' : 'Complete'} Node
              </Button>
            </div>
          )}

          <ScrollArea className="rounded-md border p-4 h-[500px]">
            <Accordion type="multiple" collapsible="true" defaultValue={expandedNodes}>
              {displayTree(stateTree.trees)}
            </Accordion>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}
