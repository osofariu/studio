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
        return newStateTree;
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
          const newChild = new TreeNodeBuilder(newChildName).build();
          nodeToUpdate.children = [...nodeToUpdate.children, newChild];
          return new StateTree(newStateTree.trees);
        }
        return prevState;
      });
      setNewChildName('');
    }
  };

  const deleteNode = () => {
    if (selectedNode) {
      setStateTree(prevState => {
        const newStateTree = new StateTree(prevState.trees);

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
        return newStateTree;
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
        }
        return newStateTree;
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
        }
        return newStateTree;
      });
    }
  };

  const handleNodeSelection = useCallback((node: TreeNode) => {
    setSelectedNode(node);
  }, []);

  const displayTree = (trees: TreeNode[], indent: string = '') => {
    return trees.map((node, index) => (
      <AccordionItem key={index} value={node.name}>
        <AccordionTrigger onClick={() => handleNodeSelection(node)}>
          {indent}
          {node.name} (
          {node.isEnabled ? 'Enabled' : 'Disabled'},{' '}
          {node.isCompleted ? 'Completed' : 'Incomplete'}
          )
        </AccordionTrigger>
        <AccordionContent>
          {displayTree(node.children, indent + '  ')}
        </AccordionContent>
      </AccordionItem>
    ));
  };

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
              <p>Selected Node: {selectedNode.name}</p>
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
              <Button onClick={deleteNode} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
            <Accordion type="single" collapsible defaultValue={initialTreeData[0].name}>
              {displayTree(stateTree.trees)}
            </Accordion>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}
