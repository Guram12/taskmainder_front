import '../styles/MindMap.css';
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThemeSpecs } from '../utils/theme';
import { useEffect } from 'react';
import { board, lists, tasks } from '../utils/interface';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Please select a board to visualize' },
    position: { x: 250, y: 25 },
    style: {
      background: '#6366f1',
      color: 'white',
      border: '2px solid #4f46e5',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '300px',
    },
  },
  
];



interface MindMapProps {
  currentTheme: ThemeSpecs;
  setIsLoading: (isLoading: boolean) => void;
  isMobile: boolean;
  boards: board[];
  selectedBoard: board | null;
  setSelectedBoard: (board: board | null) => void;
}

const MindMap: React.FC<MindMapProps> = ({
  currentTheme,
  setIsLoading,
  isMobile,
  boards,
  selectedBoard,
  setSelectedBoard
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'custom' | 'board'>('custom');

  // Helper function to check if two nodes overlap
  const checkNodeOverlap = (pos1: { x: number; y: number }, pos2: { x: number; y: number }, minDistance: number = 150) => {
    const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    return distance < minDistance;
  };

  // Helper function to find non-overlapping position
  const findNonOverlappingPosition = (
    proposedPosition: { x: number; y: number },
    existingPositions: { x: number; y: number }[],
    minDistance: number = 150,
    maxAttempts: number = 50
  ): { x: number; y: number } => {
    let position = { ...proposedPosition };
    let attempts = 0;

    while (attempts < maxAttempts) {
      const hasOverlap = existingPositions.some(existingPos => 
        checkNodeOverlap(position, existingPos, minDistance)
      );

      if (!hasOverlap) {
        return position;
      }

      // Try a new position in a spiral pattern
      const angle = (attempts * 0.5) * Math.PI;
      const radius = 50 + (attempts * 20);
      position = {
        x: proposedPosition.x + Math.cos(angle) * radius,
        y: proposedPosition.y + Math.sin(angle) * radius
      };
      attempts++;
    }

    return position;
  };

  // Convert board data to mind map format
  const convertBoardToMindMap = useCallback((board: board) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const occupiedPositions: { x: number; y: number }[] = [];
    
    // Calculate dynamic spacing based on content
    const totalLists = board.lists.length;
    const totalTasks = board.lists.reduce((acc, list) => acc + list.tasks.length, 0);
    
    // Dynamic spacing calculations
    const listSpacing = Math.max(300, 200 + (totalTasks > 20 ? 100 : 0));
    const taskSpacing = Math.max(120, 100 + (totalTasks > 10 ? 20 : 0));
    const verticalSpacing = Math.max(100, 80 + (totalTasks > 15 ? 30 : 0));
    
    // Main board node - centered
    const boardPosition = { x: (totalLists * listSpacing) / 2, y: 50 };
    const boardNode: Node = {
      id: `board-${board.id}`,
      type: 'input',
      data: { label: board.name },
      position: boardPosition,
      style: {
        background: '#6366f1',
        color: 'white',
        border: '2px solid #4f46e5',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px',
        minWidth: '150px',
      },
    };
    newNodes.push(boardNode);
    occupiedPositions.push(boardPosition);

    // Create list nodes with improved positioning
    board.lists.forEach((list: lists, listIndex: number) => {
      const baseListPosition = { 
        x: 100 + (listIndex * listSpacing), 
        y: 250 
      };
      
      const listPosition = findNonOverlappingPosition(baseListPosition, occupiedPositions);
      
      const listNode: Node = {
        id: `list-${list.id}`,
        data: { label: list.name },
        position: listPosition,
        style: {
          background: '#10b981',
          color: 'white',
          border: '2px solid #059669',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '8px',
          minWidth: '120px',
        },
      };
      newNodes.push(listNode);
      occupiedPositions.push(listPosition);

      // Connect board to list
      const boardToListEdge: Edge = {
        id: `e-board-${board.id}-list-${list.id}`,
        source: `board-${board.id}`,
        target: `list-${list.id}`,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
      };
      newEdges.push(boardToListEdge);

      // Create task nodes with improved grid layout
      const tasksPerRow = Math.min(3, Math.ceil(Math.sqrt(list.tasks.length)));
      const taskStartY = listPosition.y + 150;
      
      list.tasks.forEach((task: tasks, taskIndex: number) => {
        const row = Math.floor(taskIndex / tasksPerRow);
        const col = taskIndex % tasksPerRow;
        
        // Calculate base position for task
        const baseTaskPosition = { 
          x: listPosition.x - ((tasksPerRow - 1) * taskSpacing / 2) + (col * taskSpacing),
          y: taskStartY + (row * verticalSpacing)
        };
        
        const taskPosition = findNonOverlappingPosition(baseTaskPosition, occupiedPositions, 130);
        
        const taskNode: Node = {
          id: `task-${task.id}`,
          data: { 
            label: task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title,
            completed: task.completed,
            priority: task.priority,
            due_date: task.due_date
          },
          position: taskPosition,
          style: {
            background: task.completed ? '#6b7280' : 
                       task.priority === 'red' ? '#ef4444' :
                       task.priority === 'orange' ? '#f59e0b' :
                       task.priority === 'green' ? '#22c55e' : '#8b5cf6',
            color: 'white',
            border: `2px solid ${task.completed ? '#4b5563' : 
                                task.priority === 'red' ? '#dc2626' :
                                task.priority === 'orange' ? '#d97706' :
                                task.priority === 'green' ? '#16a34a' : '#7c3aed'}`,
            borderRadius: '8px',
            fontSize: '11px',
            padding: '6px',
            minWidth: '100px',
            maxWidth: '150px',
            opacity: task.completed ? 0.7 : 1,
            wordWrap: 'break-word',
          },
        };
        newNodes.push(taskNode);
        occupiedPositions.push(taskPosition);

        // Connect list to task
        const listToTaskEdge: Edge = {
          id: `e-list-${list.id}-task-${task.id}`,
          source: `list-${list.id}`,
          target: `task-${task.id}`,
          style: { 
            stroke: '#10b981', 
            strokeWidth: 2,
            strokeDasharray: task.completed ? '5,5' : undefined
          },
        };
        newEdges.push(listToTaskEdge);
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, []);

  // Handle board selection change
  const handleBoardChange = useCallback((boardId: string) => {
    if (boardId === '') {
      setViewMode('custom');
      setNodes(initialNodes);
      setEdges([]);
      return;
    }

    const board = boards.find(b => b.id === parseInt(boardId));
    if (board) {
      // setSelectedBoard(board);
      setViewMode('board');
      const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(board);
      setNodes(boardNodes);
      setEdges(boardEdges);
    }
  }, [boards, setSelectedBoard, convertBoardToMindMap, setNodes, setEdges]);


  // Check if edge already exists between two nodes
  const edgeExists = useCallback((source: string, target: string) => {
    return edges.some(edge => 
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source)
    );
  }, [edges]);

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      console.log('Connection created:', params);
      
      // Allow connection even if nodes are already connected to other nodes
      // Only prevent if the exact same connection already exists
      if (!edgeExists(params.source!, params.target!)) {
        setEdges((eds) => addEdge({
          ...params,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }, eds));
      } else {
        console.log('Connection already exists between these nodes');
      }
    },
    [setEdges, edgeExists]
  );

  // Handle element selection
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[]; edges: Edge[] }) => {
      const selected = [
        ...selectedNodes.map(node => node.id),
        ...selectedEdges.map(edge => edge.id)
      ];
      setSelectedElements(selected);
      console.log('Selected elements:', selected);
    },
    []
  );

  // Add new node
  const addNewNode = useCallback(() => {
    const newNodeId = `${nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: `New Node ${newNodeId}` },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      style: {
        background: '#64748b',
        color: 'white',
        border: '2px solid #475569',
        borderRadius: '8px',
        fontSize: '12px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  // Delete selected elements
  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter(node => !selectedElements.includes(node.id)));
    setEdges((eds) => eds.filter(edge => !selectedElements.includes(edge.id)));
    setSelectedElements([]);
  }, [selectedElements, setNodes, setEdges]);


  // Remove selected connections
  const removeSelectedConnections = useCallback(() => {
    const selectedEdges = selectedElements.filter(id => edges.some(e => e.id === id));
    if (selectedEdges.length > 0) {
      setEdges((eds) => eds.filter(edge => !selectedEdges.includes(edge.id)));
      setSelectedElements(prev => prev.filter(id => !selectedEdges.includes(id)));
      console.log('Removed connections:', selectedEdges);
    }
  }, [selectedElements, edges, setEdges]);

  // Auto-layout function for better organization
  const autoLayout = useCallback(() => {
    const layoutedNodes = nodes.map((node, index) => {
      if (node.id.startsWith('board-')) {
        // Keep board nodes at the top center
        return {
          ...node,
          position: { x: 400, y: 50 }
        };
      } else if (node.id.startsWith('list-')) {
        // Arrange lists in a row
        const listNodes = nodes.filter(n => n.id.startsWith('list-'));
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          position: { x: 100 + (listIndex * 300), y: 250 }
        };
      } else if (node.id.startsWith('task-')) {
        // Keep tasks near their parent lists
        return node;
      }
      return node;
    });
    
    setNodes(layoutedNodes);
  }, [nodes, setNodes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedElements();
      } else if (event.key === 'n' && event.ctrlKey) {
        event.preventDefault();
        addNewNode();
      } else if (event.key === 'c' && event.ctrlKey) {
        event.preventDefault();
      } else if (event.key === 'r' && event.ctrlKey) {
        event.preventDefault();
        removeSelectedConnections();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedElements, addNewNode, removeSelectedConnections]);


  return (
    <div className='mindmap_main_container'>
      {/* Board Selection Panel */}
      <div style={{
        zIndex: 1000,
        background: currentTheme['--background-color'],
        padding: '10px',
        borderRadius: '8px',
        border: `1px solid ${currentTheme['--border-color']}`,
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <label style={{ color: currentTheme['--main-text-coloure'], fontSize: '14px' }}>
          Select Board:
        </label>
        <select
          value={selectedBoard?.id || ''}
          onChange={(e) => handleBoardChange(e.target.value)}
          style={{
            background: currentTheme['--task-background-color'],
            color: currentTheme['--main-text-coloure'],
            border: `1px solid ${currentTheme['--border-color']}`,
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '12px',
            minWidth: '150px'
          }}
        >
          <option value="">Select a board...</option>
          {boards.map(board => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>


      </div>

      {/* Control Panel - Show for both modes */}
      <div style={{
        zIndex: 1000,
        background: currentTheme['--background-color'],
        padding: '10px',
        borderRadius: '8px',
        border: `1px solid ${currentTheme['--border-color']}`,
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={addNewNode}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Add Node (Ctrl+N)
        </button>
        <button
          disabled={selectedElements.filter(id => nodes.some(n => n.id === id)).length !== 2}
          style={{
            background: selectedElements.filter(id => nodes.some(n => n.id === id)).length === 2 ? '#10b981' : '#64748b',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Connect Nodes (Ctrl+C)
        </button>
        <button
          onClick={removeSelectedConnections}
          disabled={selectedElements.filter(id => edges.some(e => e.id === id)).length === 0}
          style={{
            background: selectedElements.filter(id => edges.some(e => e.id === id)).length > 0 ? '#f59e0b' : '#64748b',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Remove Connections (Ctrl+R)
        </button>
        <button
          onClick={deleteSelectedElements}
          disabled={selectedElements.length === 0}
          style={{
            background: selectedElements.length > 0 ? '#ef4444' : '#64748b',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Delete Selected (Del)
        </button>
        {viewMode === 'board' && selectedBoard && (
          <button
            onClick={() => {
              const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(selectedBoard);
              setNodes(boardNodes);
              setEdges(boardEdges);
            }}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Reset Board Layout
          </button>
        )}
        <button
          onClick={autoLayout}
          style={{
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Auto Layout
        </button>
      </div>

      {/* Info Panel for Board Mode */}
      {viewMode === 'board' && selectedBoard && (
        <div style={{
          zIndex: 1000,
          background: currentTheme['--background-color'],
          padding: '10px',
          borderRadius: '8px',
          border: `1px solid ${currentTheme['--border-color']}`,
          marginBottom: '10px',
          color: currentTheme['--main-text-coloure'],
          fontSize: '12px'
        }}>
          <strong>Board View:</strong> {selectedBoard.name} | 
          <span style={{ marginLeft: '10px' }}>
            Lists: {selectedBoard.lists.length} | 
            Tasks: {selectedBoard.lists.reduce((acc, list) => acc + list.tasks.length, 0)}
          </span>
          <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
            You can modify this board-based mind map by adding nodes, connections, and rearranging elements.
          </span>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Delete"
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        style={{
          background: currentTheme['--background-color'],
        }}
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id.startsWith('board-')) return '#6366f1';
            if (node.id.startsWith('list-')) return '#10b981';
            if (node.id.startsWith('task-')) {
              const taskData = node.data as any;
              if (taskData.completed) return '#6b7280';
              if (taskData.priority === 'red') return '#ef4444';
              if (taskData.priority === 'orange') return '#f59e0b';
              if (taskData.priority === 'green') return '#22c55e';
              return '#8b5cf6';
            }
            return '#10b981';
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
          maskColor="rgba(30, 41, 59, 0.8)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color={currentTheme['--due-date-color']}
        />
      </ReactFlow>
    </div>
  );
};

export default MindMap;