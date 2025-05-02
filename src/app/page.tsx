'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Survey } from '@/state-tree/survey';
import { Question } from '@/state-tree/question';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

// Theme import
import './globals.css';

const defaultAccentColor = 'hsl(174, 100%, 29%)';

// Example Tree Data
const initialQuestions: Question[] = [
  new Question('Initial Root', true, false)]

export default function Home() {

  const [stateTree, setStateTree] = useState(new Survey(initialQuestions));
    const surveyStatistics = {
        totalQuestions: stateTree.count(),
        enabledQuestions: stateTree.count(q=> q.isEnabled),
        disabledQuestions: stateTree.count(q => !q.isEnabled),
        completedQuestions: stateTree.count(q=> q.isCompleted),
        incompletedQuestions: stateTree.count(q=> !q.isCompleted),
    };

    useEffect(() => {
        surveyStatistics.totalQuestions = stateTree.count()
        surveyStatistics.enabledQuestions = stateTree.count(q=> q.isEnabled)
        surveyStatistics.disabledQuestions = stateTree.count(q => !q.isEnabled)
        surveyStatistics.completedQuestions = stateTree.count(q=> q.isCompleted)
        surveyStatistics.incompletedQuestions = stateTree.count(q=> !q.isCompleted)
    }, [stateTree])

  const [selectedNode, setSelectedNode] = useState<Question | null>(() => {
    // Select the initial root node by default
    return initialQuestions.length > 0 ? initialQuestions[0] : null;
  });


  const [newNodeName, setNewNodeName] = useState(''); //State for new nodes name.
  const [newChildName, setNewChildName] = useState(''); //state for new child name.
  const [expandedNodes, setExpandedNodes] = useState<string[]>(() => {
    // Initially expand only the root node
    return initialQuestions.length > 0 ? [initialQuestions[0].name] : [];
});



  const [surveyName, setSurveyName] = useState('Default Survey');
  const [isEditingSurveyName, setIsEditingSurveyName] = useState(false);

  useEffect(() => {
    console.log(`expandedNodes node changed! ${JSON.stringify(expandedNodes)}`)
  }, [expandedNodes])

  const updateNodeName = () => {
    if (selectedNode && newNodeName) {
      setStateTree(prevState => {
        const newStateTree = new Survey(prevState.questions);
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
        const newStateTree = new Survey(prevState.questions);
        const nodeToUpdate = newStateTree.first(node => node === selectedNode);
        if (nodeToUpdate) {
          // Check if a child with the same name already exists
          const childExists = nodeToUpdate.children.some(child => child.name === newChildName);
          if (!childExists) {
            const newChild = new Question(newChildName);
            nodeToUpdate.children = [...nodeToUpdate.children, newChild];

            setExpandedNodes(prevExpandedNodes => {
              const updatedExpandedNodes = new Set(prevExpandedNodes);
              updatedExpandedNodes.add(nodeToUpdate.name);
              updatedExpandedNodes.add(newChild.name);
              return Array.from(updatedExpandedNodes);
            });

            setNewChildName('');
            return newStateTree;
          }
        }
        return prevState;
      });
      setExpandedNodes(prevExpandedNodes => {
        const updatedExpandedNodes = new Set(prevExpandedNodes);
        if (selectedNode) updatedExpandedNodes.add(selectedNode.name);
        return Array.from(updatedExpandedNodes);
      });
    }
  };

  const deleteNode = () => {
    if (selectedNode) {
      setStateTree(prevState => {
        let newStateTree = new Survey(prevState.questions);

        // Function to recursively find and delete the node
        const deleteRecursive = (
          nodes: Question[],
          nodeToDelete: Question
        ): Question[] => {
          return nodes.filter(node => {
            if (node === nodeToDelete) {
              return false; // Exclude the node to delete
            }
            node.children = deleteRecursive(node.children, nodeToDelete); // Check children
            return true; // Keep other nodes
          });
        };

        newStateTree.questions = deleteRecursive(newStateTree.questions, selectedNode);

        // If the tree is empty after deleting the node, add a default root node
        if (newStateTree.questions.length === 0) {
          newStateTree = new Survey([
            new Question('Initial Root', true, false)
          ]);
          setExpandedNodes(['Initial Root']); // Expand the new root node
        }

        return newStateTree;
      });
      setSelectedNode(null); // Clear selection after deletion
    }
  };

  const toggleNodeEnable = () => {
    setStateTree((prevTree) => {
      if (selectedNode) {
        const newTree = new Survey([], prevTree.name);
        newTree.updateQuestions(prevTree.questions)
        const nodeToUpdate = newTree.first((node) => node.name === selectedNode.name);
        if (nodeToUpdate) {
          newTree.toggle(nodeToUpdate)
          setSelectedNode(nodeToUpdate);
        }
        return newTree
      }
      return prevTree
    });
  };


  const toggleNodeComplete = () => {
    if (selectedNode) {
      setStateTree(prevState => {
        const newStateTree = new Survey([], prevState.name);
        newStateTree.updateQuestions(prevState.questions)
        const nodeToUpdate = newStateTree.first(node => node.name === selectedNode.name);
        if (nodeToUpdate) {
          nodeToUpdate.isCompleted = !nodeToUpdate.isCompleted;
          setSelectedNode(nodeToUpdate);
          return new Survey(newStateTree.questions);
        }
        return prevState;
      });
    }
  };

  const handleNodeSelection = useCallback((node: Question) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const toggleExpanded = (node: Question) => {
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

  const handleHeaderClick = useCallback((node: Question) => {
    if (!expandedNodes.includes(node.name)) setExpandedNodes(prev => [...prev, node.name])
    setSelectedNode(node);
    if (expandedNodes.includes(node.name)) {
      toggleExpanded(node);
    }
  }, [expandedNodes, setSelectedNode, handleNodeSelection]);

  const displayTree = (trees: Question[], indentLevel: number = 1) => {
    const indent = 1 * indentLevel; // Indent 1rem per level
    return trees.map((node, index) => (
      <AccordionItem
        key={index}
        value={node.name}
        className={selectedNode === node ? "bg-blue-100" : ""}
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

  const handleSetSurveyName = () => {
    stateTree.setName(surveyName);
    setIsEditingSurveyName(false);
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

          <div className="flex-1 p-4 overflow-auto flex">
            <div className="w-3/4">
              <h2 className="text-2xl font-semibold mb-4">
                Tree State Management
              </h2>

              <div className='mb-4 flex items-center'>
                {isEditingSurveyName ? (
                  <>
                    <Input
                  type="text"
                  placeholder="Survey Name"
                  value={surveyName}
                  onChange={e => setSurveyName(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={handleSetSurveyName}>Set Name</Button>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold mb-2">{stateTree.name}</p>
                    <div className='ml-auto'>
                      <Button onClick={() => setIsEditingSurveyName(true)} className="text-sm"
                  >Set Name
                      </Button>
                    </div>
                  </>
                )}
          </div>

          {selectedNode && (
            <div className="mb-4">
              <p className="text-lg font-semibold">Selected: {selectedNode.name}</p>
              <Input
                type="text"
                placeholder="New Node Name"
                value={newNodeName}
                onChange={e => setNewNodeName(e.target.value)}
                className="mb-2"
              />
              <Button onClick={updateNodeName}>Update Name</Button>

              <Input
              type="text"
              placeholder="New Child Node Name"
              value={newChildName}
              onChange={e => setNewChildName(e.target.value)}
              className="mb-2"
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && newChildName) {
                      addChildNode();
                  }
              }}
              />
              <Button onClick={addChildNode}>Add Child</Button>
              <Button
                onClick={deleteNode}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete Node
              </Button>
              <Button onClick={toggleNodeEnable}>
                {selectedNode.isEnabled ? 'Disable' : 'Enable'}
              </Button>
              <Button onClick={toggleNodeComplete}>
                {selectedNode.isCompleted ? 'Reset' : 'Complete'}
              </Button>
            </div>
          )}

          <ScrollArea className="rounded-md border p-4 h-[500px]">
            <Accordion type="multiple" defaultValue={expandedNodes}>
              {displayTree(stateTree.questions)}
            </Accordion>
            </ScrollArea>
            </div>

            <div className="w-1/4 ml-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">Survey Statistics</h3>
              <ul className="text-sm">
                <li className="flex justify-between">
                  <span>Questions:</span> <span className="text-right">{surveyStatistics.totalQuestions}</span>
                </li>
                <li className="flex justify-between">
                  <span>Enabled:</span> <span className="text-right">{surveyStatistics.enabledQuestions}</span>
                </li>
                <li className="flex justify-between">
                  <span>Disabled:</span> <span className="text-right">{surveyStatistics.disabledQuestions}</span>
                </li>
                <li className="flex justify-between">Completed: <span className="text-right">{surveyStatistics.completedQuestions}</span></li>
                <li className="flex justify-between">Incomplete: <span className="text-right">{surveyStatistics.incompletedQuestions}</span></li>
                </ul>
            </div>


        </div>
      </div>
    </SidebarProvider>
  );
}
