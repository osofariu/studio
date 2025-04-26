
'use client';

import React, { useState, useEffect } from 'react';
import { StateTree } from '@/state-tree/state-tree';
import { TreeNodeBuilder, TreeNode } from '@/state-tree/tree-node';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarSeparator } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

// Theme import
import './globals.css';

const defaultAccentColor = 'hsl(174, 100%, 29%)';

// Example Tree Data
const initialTreeData: TreeNode[] = [
  new TreeNodeBuilder('Root 1')
    .addChild(new TreeNodeBuilder('Child 1.1').build())
    .addChild(new TreeNodeBuilder('Child 1.2').setCompleted(true).build())
    .build(),
  new TreeNodeBuilder('Root 2')
    .addChild(new TreeNodeBuilder('Child 2.1').setEnabled(false).build())
    .build(),
];

export default function Home() {
  const [stateTree, setStateTree] = useState(new StateTree(initialTreeData));
  const [selectedNodeName, setSelectedNodeName] = useState<string | null>(null);
  const [newRootName, setNewRootName] = useState('');

  const addRootNode = () => {
    if (newRootName) {
      const newTree = new TreeNodeBuilder(newRootName).build();
      setStateTree(prevState => {
        const newStateTree = new StateTree([...prevState.trees, newTree]);
        return newStateTree;
      });
      setNewRootName('');
    }
  };

  const handleNodeSelection = (nodeName: string) => {
    setSelectedNodeName(nodeName);
  };

  const toggleNodeEnable = (node: TreeNode) => {
    setStateTree(prevState => {
      const newStateTree = new StateTree(prevState.trees);
      if (node.isEnabled) {
        newStateTree.disable(node);
      } else {
        newStateTree.enable(node);
      }
      return newStateTree;
    });
  };

  const toggleNodeComplete = (node: TreeNode) => {
    setStateTree(prevState => {
      const newStateTree = new StateTree(prevState.trees);
      if (node.isCompleted) {
        newStateTree.reset(node);
      } else {
        newStateTree.complete(node);
      }
      return newStateTree;
    });
  };

  const displayTree = (trees: TreeNode[], indent: string = '') => {
    return trees.map((node, index) => (
      <AccordionItem key={index} value={node.name}>
        <AccordionTrigger onClick={() => handleNodeSelection(node.name)}>
          {indent}
          {node.name} ({node.isEnabled ? 'Enabled' : 'Disabled'}, {node.isCompleted ? 'Completed' : 'Incomplete'})
        </AccordionTrigger>
        <AccordionContent>
          <Button onClick={() => toggleNodeEnable(node)}>{node.isEnabled ? 'Disable' : 'Enable'} Node</Button>
          <Button onClick={() => toggleNodeComplete(node)}>{node.isCompleted ? 'Reset' : 'Complete'} Node</Button>
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
          <h2 className="text-2xl font-semibold mb-4">Tree State Management</h2>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="New Root Node Name"
              value={newRootName}
              onChange={e => setNewRootName(e.target.value)}
              className="mb-2"
            />
            <Button onClick={addRootNode}>Add Root Node</Button>
          </div>
          <ScrollArea className="rounded-md border p-4 h-[500px]">
            <Accordion type="single" collapsible>
              {displayTree(stateTree.trees)}
            </Accordion>
          </ScrollArea>
          {selectedNodeName && (
            <div className="mt-4">
              <p>Selected Node: {selectedNodeName}</p>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
