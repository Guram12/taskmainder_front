import '../styles/MindMap.css';
import React, { useCallback, useState, useRef } from 'react';
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
import { board, lists, tasks, ProfileData } from '../utils/interface';
import axiosInstance from '../utils/axiosinstance';
import { environment_urls } from '../utils/URLS';
import TaskUpdateModal from './Boards/TaskUpdateModal';


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
  allCurrentBoardUsers: ProfileData[];
  setAllCurrentBoardUsers: (allCurrentBoardUsers: ProfileData[]) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

interface SavedPositions {
  [nodeId: string]: NodePosition;
}

const MindMap: React.FC<MindMapProps> = ({
  currentTheme,
  // setIsLoading,
  // isMobile,
  boards,
  allCurrentBoardUsers,
  setAllCurrentBoardUsers,
}) => {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'custom' | 'board'>('custom');
  const [editingTask, setEditingTask] = useState<tasks | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Add new state for naming new items
  const [newItemModal, setNewItemModal] = useState<{
    isOpen: boolean;
    type: 'task' | 'list';
    name: string;
    targetId: string;
    tempNodeId: string;
  }>({
    isOpen: false,
    type: 'task',
    name: '',
    targetId: '',
    tempNodeId: ''
  });

  const [maindmap_selected_board_data, setMaindmap_selected_board_data] = useState<board>({
    id: 0,
    name: '',
    created_at: '',
    lists: [],
    owner: '',
    owner_email: '',
    members: [],
    board_users: [],
    background_image: null,
    creation_date: '',
  });

  const mindMapSocketRef = useRef<WebSocket | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to get localStorage key for board positions
  const getPositionStorageKey = useCallback((boardId: number) => {
    return `mindmap_positions_board_${boardId}`;
  }, []);

  // Function to save positions to localStorage with debouncing
  const savePositionsToStorage = useCallback((boardId: number, positions: SavedPositions) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const key = getPositionStorageKey(boardId);
        localStorage.setItem(key, JSON.stringify(positions));
        console.log('Saved positions for board:', boardId);
      } catch (error) {
        console.error('Error saving positions to localStorage:', error);
      }
    }, 500); // Debounce for 500ms
  }, [getPositionStorageKey]);

  // Function to load positions from localStorage
  const loadPositionsFromStorage = useCallback((boardId: number): SavedPositions => {
    try {
      const key = getPositionStorageKey(boardId);
      const savedData = localStorage.getItem(key);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading positions from localStorage:', error);
    }
    return {};
  }, [getPositionStorageKey]);

  // Custom onNodesChange handler that saves positions
  const handleNodesChange: OnNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);

    // Check if any position changes occurred and we're in board mode
    const hasPositionChange = changes.some(change =>
      change.type === 'position' && change.position
    );

    if (hasPositionChange && viewMode === 'board' && maindmap_selected_board_data?.id) {
      // Get current positions after the change
      setTimeout(() => {
        setNodes((currentNodes) => {
          const positions: SavedPositions = {};
          currentNodes.forEach(node => {
            positions[node.id] = {
              x: node.position.x,
              y: node.position.y
            };
          });

          savePositionsToStorage(maindmap_selected_board_data.id, positions);
          return currentNodes;
        });
      }, 0);
    }
  }, [onNodesChange, viewMode, maindmap_selected_board_data?.id, savePositionsToStorage, setNodes]);

  useEffect(() => {

    if (!maindmap_selected_board_data?.id) return;

    // Clean up previous socket connection
    if (mindMapSocketRef.current) {
      mindMapSocketRef.current.close();
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }

    const wsUrl = `${environment_urls.URLS.websockersURL}${maindmap_selected_board_data.id}/?token=${token}`;
    console.log('Connecting to WebSocket:', wsUrl);

    const newSocket = new WebSocket(wsUrl);
    mindMapSocketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log('WebSocket connection established for board:', maindmap_selected_board_data.id);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { action, payload } = data;
        console.log('Received WebSocket message:', { action, payload });

        switch (action) {
          case 'update_task':
            console.log('Processing update_task:', payload);

            setMaindmap_selected_board_data((prevData: board) => {
              const updatedLists = prevData.lists.map((list) => ({
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === payload.id ? {
                    ...task,
                    title: payload.title,
                    description: payload.description,
                    due_date: payload.due_date,
                    completed: payload.completed,
                    priority: payload.priority,
                    task_associated_users_id: payload.task_associated_users_id,
                  } : task
                ),
              }));
              return { ...prevData, lists: updatedLists };
            });
            break;


          case 'move_task':
            const { task_id, source_list_id, target_list_id } = payload;
            setMaindmap_selected_board_data((prevData: board) => {
              const newBoardData = { ...prevData };
              const sourceListIndex = newBoardData.lists.findIndex(list => list.id === source_list_id);
              const targetListIndex = newBoardData.lists.findIndex(list => list.id === target_list_id);

              if (sourceListIndex === -1 || targetListIndex === -1) return newBoardData;

              const taskIndex = newBoardData.lists[sourceListIndex].tasks.findIndex(task => task.id === task_id);
              if (taskIndex === -1) return newBoardData;

              const [movedTask] = newBoardData.lists[sourceListIndex].tasks.splice(taskIndex, 1);
              movedTask.list = target_list_id;
              newBoardData.lists[targetListIndex].tasks.push(movedTask);

              return newBoardData;
            });
            break;

          case 'add_task':
            console.log('Received add_task:', payload);
            setMaindmap_selected_board_data((prevData: board) => {
              const updatedLists = prevData.lists.map((list) => {
                if (list.id === payload.list) {
                  return { ...list, tasks: [...list.tasks, payload] };
                }
                return list;
              });

              return { ...prevData, lists: updatedLists };
            });
            break;

          // ================================= list cases ===================================================
          case 'delete_list':
            setMaindmap_selected_board_data((prevData: board) => ({
              ...prevData,
              lists: prevData.lists.filter((list) => list.id !== payload.list_id),
            }));
            break;

          case 'add_list':
            setMaindmap_selected_board_data((prevData: board) => ({
              ...prevData,
              lists: [...prevData.lists, payload],
            }));

            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      if (event.code !== 1000) { // Not a normal closure
        console.log('WebSocket closed unexpectedly, attempting to reconnect...');
        // Optionally implement reconnection logic here
      }
    };

    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close(1000, 'Component unmounting');
      }
    };
  }, [maindmap_selected_board_data]);


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

    // Load saved positions for this board
    const savedPositions = loadPositionsFromStorage(board.id);

    // Calculate dynamic spacing based on content
    const totalLists = board.lists.length;
    const totalTasks = board.lists.reduce((acc, list) => acc + list.tasks.length, 0);

    // Dynamic spacing calculations
    const listSpacing = Math.max(300, 200 + (totalTasks > 20 ? 100 : 0));
    const taskSpacing = Math.max(120, 100 + (totalTasks > 10 ? 20 : 0));
    const verticalSpacing = Math.max(100, 80 + (totalTasks > 15 ? 30 : 0));

    // Main board node - centered or use saved position
    const boardNodeId = `board-${board.id}`;
    const defaultBoardPosition = { x: (totalLists * listSpacing) / 2, y: 50 };
    const boardPosition = savedPositions[boardNodeId] || defaultBoardPosition;

    const boardNode: Node = {
      id: boardNodeId,
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
      const listNodeId = `list-${list.id}`;
      const baseListPosition = {
        x: 100 + (listIndex * listSpacing),
        y: 250
      };

      // Use saved position if available, otherwise find non-overlapping position
      const listPosition = savedPositions[listNodeId] ||
        findNonOverlappingPosition(baseListPosition, occupiedPositions);

      const listNode: Node = {
        id: listNodeId,
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
        const taskNodeId = `task-${task.id}`;
        const row = Math.floor(taskIndex / tasksPerRow);
        const col = taskIndex % tasksPerRow;

        // Calculate base position for task
        const baseTaskPosition = {
          x: listPosition.x - ((tasksPerRow - 1) * taskSpacing / 2) + (col * taskSpacing),
          y: taskStartY + (row * verticalSpacing)
        };

        // Use saved position if available, otherwise find non-overlapping position
        const taskPosition = savedPositions[taskNodeId] ||
          findNonOverlappingPosition(baseTaskPosition, occupiedPositions, 130);

        const taskNode: Node = {
          id: taskNodeId,
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
  }, [loadPositionsFromStorage]);

  // ================================  Handle board selection change ==========================================================


  const fetchBoardData = async (selectedBoardId: string) => {
    try {
      // Fix: Use selectedBoard.id instead of mindMapSelectedBoard.id
      const response = await axiosInstance.get(`/api/boards/${selectedBoardId}/`);
      const boardData = response.data;
      setMaindmap_selected_board_data(boardData);
      setViewMode('board');
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };


  const handleBoardChange = useCallback((boardId: string) => {

    fetchBoardData(boardId);

    const board = boards.find(b => b.id === parseInt(boardId));
    if (board) {
      setMaindmap_selected_board_data(board); // Add this line to trigger WebSocket connection
      setViewMode('board');
      const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(board);
      setNodes(boardNodes);
      setEdges(boardEdges);
    }
  }, [boards, convertBoardToMindMap, setNodes, setEdges]);


  // ========================================================================================================================

  // Check if edge already exists between two nodes
  const edgeExists = useCallback((source: string, target: string) => {
    return edges.some(edge =>
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source)
    );
  }, [edges]);

  // Send WebSocket message for creating new task
  const sendCreateTask = useCallback((listId: number, taskName: string) => {
    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'add_task',
        payload: {
          list: listId, 
          title: taskName,

        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent create task:', message);
      } catch (error) {
        console.error('Error sending create task message:', error);
      }
    } else {
      console.error('WebSocket is not connected for creating task');
    }
  }, []);

  // Send WebSocket message for creating new list
  const sendCreateList = useCallback((boardId: number, listName: string) => {
    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'add_list',
        payload: {
          name: listName, // Changed from 'list_name' to 'name'
          board: boardId, // Changed from 'board_id' to 'board'
        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent create list:', message);
      } catch (error) {
        console.error('Error sending create list message:', error);
      }
    } else {
      console.error('WebSocket is not connected for creating list');
    }
  }, []);


  // Handle new connections with smart detection
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      console.log('Connection created:', params);

      if (viewMode === 'board' && params.source && params.target) {
        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);

        // Check if we're connecting a new node to an existing structure
        const isNewNodeConnection = sourceNode?.data.label?.includes('New Node') ||
          targetNode?.data.label?.includes('New Node');

        if (isNewNodeConnection) {
          let newItemType: 'task' | 'list' = 'task';
          let targetId = '';
          let tempNodeId = '';

          // Determine what type of item to create based on the connection
          if (sourceNode?.data.label?.includes('New Node')) {
            // New node is source
            tempNodeId = params.source;
            if (params.target?.startsWith('board-')) {
              newItemType = 'list';
              targetId = params.target;
            } else if (params.target?.startsWith('list-')) {
              newItemType = 'task';
              targetId = params.target;
            }
          } else if (targetNode?.data.label?.includes('New Node')) {
            // New node is target
            tempNodeId = params.target;
            if (params.source?.startsWith('board-')) {
              newItemType = 'list';
              targetId = params.source;
            } else if (params.source?.startsWith('list-')) {
              newItemType = 'task';
              targetId = params.source;
            }
          }

          if (targetId && tempNodeId) {
            // Open modal to name the new item
            setNewItemModal({
              isOpen: true,
              type: newItemType,
              name: '',
              targetId: targetId,
              tempNodeId: tempNodeId
            });
            return; // Don't create the edge yet
          }
        }
      }

      // Regular connection handling
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
    [setEdges, edgeExists, viewMode, nodes]
  );

  // Handle new item creation
  const handleCreateNewItem = useCallback(() => {
    if (!newItemModal.name.trim()) return;

    const { type, targetId, tempNodeId, name } = newItemModal;

    if (type === 'task' && targetId.startsWith('list-')) {
      const listId = parseInt(targetId.replace('list-', ''));
      sendCreateTask(listId, name.trim());
    } else if (type === 'list' && targetId.startsWith('board-')) {
      const boardId = parseInt(targetId.replace('board-', ''));
      sendCreateList(boardId, name.trim());
    }

    // Remove the temporary node
    setNodes((nds) => nds.filter(node => node.id !== tempNodeId));

    // Close modal
    setNewItemModal({
      isOpen: false,
      type: 'task',
      name: '',
      targetId: '',
      tempNodeId: ''
    });
  }, [newItemModal, sendCreateTask, sendCreateList, setNodes]);

  // Cancel new item creation
  const handleCancelNewItem = useCallback(() => {
    // Remove the temporary node
    setNodes((nds) => nds.filter(node => node.id !== newItemModal.tempNodeId));

    // Close modal
    setNewItemModal({
      isOpen: false,
      type: 'task',
      name: '',
      targetId: '',
      tempNodeId: ''
    });
  }, [newItemModal.tempNodeId, setNodes]);

  // Add new node with better labeling
  const addNewNode = useCallback(() => {
    const newNodeId = `temp-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: `New Node (Connect to create)` },
      position: { x: Math.random() * 500 + 200, y: Math.random() * 300 + 200 },
      style: {
        background: '#64748b',
        color: 'white',
        border: '2px solid #475569',
        borderRadius: '8px',
        fontSize: '12px',
        padding: '8px',
        minWidth: '150px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);


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
    const layoutedNodes = nodes.map((node) => {
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


  // ======================================= task update ================================================


  // Send WebSocket message for task update
  const sendTaskUpdate = useCallback((taskData: any) => {
    console.log('Attempting to send task update:', taskData);
    console.log('WebSocket state:', mindMapSocketRef.current?.readyState);

    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'update_task',
        payload: {
          task_id: taskData.id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date,
          completed: taskData.completed,
          task_associated_users_id: taskData.task_associated_users_id,
          user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent task update:', message);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.error('WebSocket is not connected. Current state:',
        mindMapSocketRef.current?.readyState === WebSocket.CONNECTING ? 'CONNECTING' :
          mindMapSocketRef.current?.readyState === WebSocket.CLOSING ? 'CLOSING' :
            mindMapSocketRef.current?.readyState === WebSocket.CLOSED ? 'CLOSED' : 'UNKNOWN'
      );
    }
  }, []);



  // Handle task update using the existing modal's format
  const handleTaskUpdate = useCallback((
    taskId: number,
    updatedTitle: string,
    due_date: string | null,
    description: string,
    completed: boolean,
    task_associated_users_id: number[],
    priority: 'green' | 'orange' | 'red' | null
  ) => {

    const updatedTaskData = {
      id: taskId,
      title: updatedTitle,
      description: description,
      priority: priority,
      due_date: due_date,
      completed: completed,
      task_associated_users_id: task_associated_users_id
    };

    // Send WebSocket message
    sendTaskUpdate(updatedTaskData);

    // Reset updating task ID
  }, [sendTaskUpdate]);

  // Handle task deletion (if needed)
  const handleTaskDelete = useCallback((taskId: number, listId: number) => {
    // You can implement task deletion via WebSocket if needed
    console.log('Delete task:', taskId, 'from list:', listId);
    // For now, just close the modal
    setIsEditModalOpen(false);
    setEditingTask(null);
  }, []);

  // Handle task node click for editing
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // Only allow editing task nodes in board mode
    if (viewMode === 'board' && node.id.startsWith('task-')) {
      const taskId = parseInt(node.id.replace('task-', ''));

      // Find the task in the current board data
      let foundTask: tasks | null = null;
      for (const list of maindmap_selected_board_data.lists) {
        foundTask = list.tasks.find(task => task.id === taskId) || null;
        if (foundTask) break;
      }

      if (foundTask) {
        setEditingTask(foundTask);
        setIsEditModalOpen(true);
      }
    }
  }, [viewMode, maindmap_selected_board_data]);

  // ============================ Get associated users for the current task============================
  const getAssociatedUsers = useCallback((task: tasks): ProfileData[] => {
    if (!task.task_associated_users_id) return [];

    return allCurrentBoardUsers.filter(user =>
      task.task_associated_users_id.includes(user.id)
    );
  }, [allCurrentBoardUsers]);



  // ============== Update the convertBoardToMindMap function to regenerate nodes when board data changes==============
  useEffect(() => {
    if (viewMode === 'board' && maindmap_selected_board_data?.id) {
      const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(maindmap_selected_board_data);
      setNodes(boardNodes);
      setEdges(boardEdges);
    }
  }, [maindmap_selected_board_data, viewMode, convertBoardToMindMap, setNodes, setEdges]);




  return (
    <div className='mindmap_main_container'>
      {/* Task Update Modal */}
      {isEditModalOpen && editingTask && (
        <TaskUpdateModal
          task={editingTask}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          updateTask={handleTaskUpdate}
          deleteTask={handleTaskDelete}
          currentTheme={currentTheme}
          allCurrentBoardUsers={allCurrentBoardUsers}
          associatedUsers={getAssociatedUsers(editingTask)}
        />
      )}

      {/* New Item Creation Modal */}
      {newItemModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: currentTheme['--background-color'],
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${currentTheme['--border-color']}`,
            minWidth: '300px',
            maxWidth: '400px'
          }}>
            <h3 style={{
              color: currentTheme['--main-text-coloure'],
              marginBottom: '15px',
              fontSize: '16px'
            }}>
              Create New {newItemModal.type === 'task' ? 'Task' : 'List'}
            </h3>

            <input
              type="text"
              placeholder={`Enter ${newItemModal.type} name...`}
              value={newItemModal.name}
              onChange={(e) => setNewItemModal(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newItemModal.name.trim()) {
                  handleCreateNewItem();
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${currentTheme['--border-color']}`,
                borderRadius: '4px',
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                fontSize: '14px',
                marginBottom: '15px'
              }}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelNewItem}
                style={{
                  background: '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewItem}
                disabled={!newItemModal.name.trim()}
                style={{
                  background: newItemModal.name.trim() ? '#6366f1' : '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: newItemModal.name.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '12px'
                }}
              >
                Create {newItemModal.type === 'task' ? 'Task' : 'List'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          value={maindmap_selected_board_data?.id || ''}
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
          Add Node (Connect to Board/List)
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


        {viewMode === 'board' && maindmap_selected_board_data && (
          <>
            <button
              onClick={() => {
                const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(maindmap_selected_board_data);
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
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved positions for this board?')) {
                  const key = getPositionStorageKey(maindmap_selected_board_data.id);
                  localStorage.removeItem(key);
                  // Reload the board with default positions
                  const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(maindmap_selected_board_data);
                  setNodes(boardNodes);
                  setEdges(boardEdges);
                }
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear Saved Positions
            </button>
          </>
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
      {viewMode === 'board' && maindmap_selected_board_data && (
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
          <strong>Board View:</strong> {maindmap_selected_board_data.name} |
          <span style={{ marginLeft: '10px' }}>
            Lists: {maindmap_selected_board_data.lists.length} |
            Tasks: {maindmap_selected_board_data.lists.reduce((acc, list) => acc + list.tasks.length, 0)}
          </span>
          <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
            Click task nodes to edit. Add new node and connect to board (for lists) or lists (for tasks) to create new items.
          </span>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onSelectionChange={onSelectionChange}
        onNodeClick={onNodeClick}
        fitView
        multiSelectionKeyCode="Shift"
        deleteKeyCode={null} // This disables deletion with Delete key
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