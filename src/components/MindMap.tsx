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
  // EdgeChange,
  OnConnect,
  // OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,

} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThemeSpecs } from '../utils/theme';
import { useEffect } from 'react';
import { board, lists, tasks, ProfileData } from '../utils/interface';
import axiosInstance from '../utils/axiosinstance';
import { environment_urls } from '../utils/URLS';
import TaskUpdateModal from './Boards/TaskUpdateModal';
import HashLoader from 'react-spinners/HashLoader';
// import { use } from 'i18next';
// import { openSync } from 'fs';
import Mindmap_ListName_Modal from './Mindmap_ListName_Modal';
import Mindmap_BoardName_Modal from './Mindmap_BoardName_Modal';
import Select from 'react-select';
import { PiWarningFill } from "react-icons/pi";
import { FaClipboardList } from "react-icons/fa";
import CustomTaskNode from './CustomTaskNode';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const nodeTypes = {
  customTask: CustomTaskNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Please select or create a board to visualize' },
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


interface NodePosition {
  x: number;
  y: number;
}

interface SavedPositions {
  [nodeId: string]: NodePosition;
}

interface MindMapProps {
  currentTheme: ThemeSpecs;
  boards: board[];
  setBoards: (boards: board[]) => void;
  allCurrentBoardUsers: ProfileData[];
  setSelectedBoard: (board: board | null) => void;
  setSelectedComponent: (component: string) => void;
}


const MindMap: React.FC<MindMapProps> = ({
  currentTheme,
  boards,
  allCurrentBoardUsers,
  setBoards,
  setSelectedBoard,
  setSelectedComponent,
}) => {



  const [diagram_loading, setDiagram_loading] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [viewMode, setViewMode] = useState<'custom' | 'board'>('custom');
  const [editingTask, setEditingTask] = useState<tasks | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [editingList, setEditingList] = useState<lists | null>(null);
  const [isListEditModalOpen, setIsListEditModalOpen] = useState<boolean>(false);
  const [listNameInput, setListNameInput] = useState<string>('');

  const [isBoardEditModalOpen, setIsBoardEditModalOpen] = useState<boolean>(false);
  const [editingBoard, setEditingBoard] = useState<board | null>(null);
  const [boardNameInput, setBoardNameInput] = useState<string>('');

  const [cannot_connect_to_task_warning, setCannot_connect_to_task_warning] = useState<{ isConnected: boolean, message: string }>({ isConnected: false, message: '' });


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

  const { t } = useTranslation();
  const navigate = useNavigate();

  const prev_mindmap_selected_board = localStorage.getItem('prev_mindmap_selected_board_id');




  //-------------  when page opens automatically select boar from localstorage prev selected ---------
  useEffect(() => {
    if (prev_mindmap_selected_board) {
      const selectedBoard = boards.find(board => board.id === parseInt(prev_mindmap_selected_board));
      if (selectedBoard) {
        setMaindmap_selected_board_data(selectedBoard);
        setViewMode('board');
        setDiagram_loading(true);
        fetchBoardData(selectedBoard.id.toString());
      } else {
        return;
      }
    }
  }, []);
  // --------------------------------------------------------------------------------------------------
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

  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

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

  //================================ Function to load positions from localStorage =========================================
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

  //================================= Custom onNodesChange handler that saves positions
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

  // =============================== websocket playload useefect for boarddata update   ========================================
  useEffect(() => {
    if (!maindmap_selected_board_data?.id) return;

    // Clean up previous socket connection
    if (mindMapSocketRef.current) {
      // Only close if OPEN or CONNECTING
      if (
        mindMapSocketRef.current.readyState === WebSocket.OPEN ||
        mindMapSocketRef.current.readyState === WebSocket.CONNECTING
      ) {
        mindMapSocketRef.current.close();
      }
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }

    const wsUrl = `${environment_urls.URLS.websockersURL}${maindmap_selected_board_data.id}/?token=${token}`;

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
          case 'delete_task':
            console.log('Received delete_task:', payload);
            setMaindmap_selected_board_data((prevData: board) => {
              const updatedLists = prevData.lists.map((list) => {
                if (list.id === payload.list_id) {
                  return { ...list, tasks: list.tasks.filter((task) => task.id !== payload.task_id) };
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
          case 'edit_list_name':
            console.log('Received edit_list_name:', payload);
            setMaindmap_selected_board_data((prevData: board) => {
              const updatedLists = prevData.lists.map((list) =>
                list.id === payload.list_id ? { ...list, name: payload.new_name } : list
              );
              return { ...prevData, lists: updatedLists };
            });
            break;

          // ================================= board cases ===================================================
          case 'update_board_name':
            console.log('Received update_board_name:', payload);
            // Update boardData
            setMaindmap_selected_board_data((prevData: board) => ({
              ...prevData,
              name: payload.new_name,
            }));

            if (typeof payload.new_name === 'string') {
              const updatedBoard: board = {
                ...maindmap_selected_board_data,
                name: payload.new_name,
              };
              setMaindmap_selected_board_data(updatedBoard);
            } else {
              console.error('Invalid board name:', payload.new_name);
            }
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

  // ================================  Convert board data to mind map format ================================================
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
          background: currentTheme['--list-background-color'],
          color: currentTheme['--main-text-coloure'],
          border: `2px solid ${currentTheme['--border-color']}`,
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
      const taskStartY = listPosition.y + 150;
      list.tasks.forEach((task: tasks, taskIndex: number) => {
        const taskNodeId = `task-${task.id}`;
        // Each task is placed directly below the previous one
        const baseTaskPosition = {
          x: listPosition.x,
          y: taskStartY + (taskIndex * verticalSpacing)
        };

        // Use saved position if available, otherwise use calculated
        const taskPosition = savedPositions[taskNodeId] ||
          findNonOverlappingPosition(baseTaskPosition, occupiedPositions, 100);


        const associatedUsers = allCurrentBoardUsers.filter(user =>
          task.task_associated_users_id?.includes(user.id)
        );
        const taskNode: Node = {
          id: taskNodeId,
          type: 'customTask',
          data: {
            label: task.title,
            completed: task.completed,
            priority: task.priority,
            due_date: task.due_date,
            associatedUsers,
            style: {
              background: currentTheme['--task-background-color'],
              color: currentTheme['--main-text-coloure'],
              border: `3px solid`,
              borderColor:
                task.priority === 'red' ? '#ef4444' :
                  task.priority === 'orange' ? '#f59e0b' :
                    task.priority === 'green' ? '#22c55e' :
                      currentTheme['--border-color'],
              borderRadius: '8px',
              fontSize: '11px',
              padding: '6px',
              minWidth: '100px',
              maxWidth: '200px',
              opacity: task.completed ? 0.4 : 1,
              wordWrap: 'break-word',
            }
          },
          position: taskPosition,
        };
        newNodes.push(taskNode);
        occupiedPositions.push(taskPosition);

        // Connect list to task
        const listToTaskEdge: Edge = {
          id: `e-list-${list.id}-task-${task.id}`,
          source: `list-${list.id}`,
          target: `task-${task.id}`,
          style: {
            stroke: currentTheme['--scrollbar-thumb-color'],
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
    } finally {
      setDiagram_loading(false);
    }
  };


  const handleBoardChange = useCallback((boardId: string) => {
    localStorage.setItem('prev_mindmap_selected_board_id', boardId);
    setDiagram_loading(true);
    fetchBoardData(boardId);

    const board = boards.find(b => b.id === parseInt(boardId));
    if (board) {
      setMaindmap_selected_board_data(board);
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

  // ============================== BOARD name update  ==========================================

  const sendBoardNameUpdate = useCallback((boardId: number, newName: string) => {
    const set_new_boards: board[] = boards.map((board) => {
      if (board.id === boardId) {
        return { ...board, name: newName };
      }
      return board;
    });

    setBoards(set_new_boards);

    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'edit_board_name',
        payload: {
          board_id: boardId,
          new_name: newName
        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent board name update:', message);
      } catch (error) {
        console.error('Error sending board name update message:', error);
      }
    } else {
      console.error('WebSocket is not connected for updating board name');
    }
  }, []);

  const handleBoardNameUpdate = useCallback(() => {
    if (!editingBoard || !boardNameInput.trim()) return;
    sendBoardNameUpdate(editingBoard.id, boardNameInput.trim());
    setIsBoardEditModalOpen(false);
    setEditingBoard(null);
    setBoardNameInput('');

    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'update_board_name',
        payload: {
          board_id: editingBoard.id,
          new_name: boardNameInput.trim()
        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent board name update:', message);
      } catch (error) {
        console.error('Error sending board name update message:', error);
      }
    }

  }, [editingBoard, boardNameInput, sendBoardNameUpdate]);

  const handleCancelBoardEdit = useCallback(() => {
    setIsBoardEditModalOpen(false);
    setEditingBoard(null);
    setBoardNameInput('');
  }, []);
  // ============================== Send WebSocket message for creating new LIST ==========================================

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


  // =========================================== list name update =========================================================

  const sendListNameUpdate = useCallback((listId: number, newName: string) => {
    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'edit_list_name',
        payload: {
          list_id: listId,
          new_name: newName
        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent list name update:', message);
      } catch (error) {
        console.error('Error sending list name update message:', error);
      }
    } else {
      console.error('WebSocket is not connected for updating list name');
    }
  }, []);
  // ------------------------------------------------------------------------------------------
  const handleListNameUpdate = useCallback(() => {
    if (!editingList || !listNameInput.trim()) return;

    sendListNameUpdate(editingList.id, listNameInput.trim());

    // Close modal
    setIsListEditModalOpen(false);
    setEditingList(null);
    setListNameInput('');
  }, [editingList, listNameInput, sendListNameUpdate]);

  // Cancel list editing
  const handleCancelListEdit = useCallback(() => {
    setIsListEditModalOpen(false);
    setEditingList(null);
    setListNameInput('');
  }, []);


  const sendMoveTask = useCallback((taskId: number, sourceListId: number, targetListId: number) => {
    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'move_task',
        payload: {
          task_id: taskId,
          source_list_id: sourceListId,
          target_list_id: targetListId,
        }
      };
      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent move_task:', message);
      } catch (error) {
        console.error('Error sending move_task message:', error);
      }
    } else {
      console.error('WebSocket is not connected for moving task');
    }
  }, []);

  // ========================================================================================================================
  // ========================================================================================================================
  // ========================================================================================================================
  // ================================== Handle new connections with smart detection  ========================================


  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      console.log('Connection created:', params);

      if (viewMode === 'board' && params.source && params.target) {
        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);


        // Prevent connecting a new node to a task node
        const isNewNodeSource = sourceNode?.data.isTemp; // <-- use isTemp
        const isNewNodeTarget = targetNode?.data.isTemp; // <-- use isTemp
        const isTaskSource = params.source?.startsWith('task-');
        const isTaskTarget = params.target?.startsWith('task-');
        const isListSource = params.source?.startsWith('list-');
        const isListTarget = params.target?.startsWith('list-');

        // Prevent connecting task to task
        if (isTaskSource && isTaskTarget) {
          let message = t('cannot_connect_task_to_task');
          setCannot_connect_to_task_warning({ isConnected: true, message });
          return;
        }
        // Prevent connecting list to list
        if (isListSource && isListTarget) {
          let message = t('cannot_connect_list_to_list');
          setCannot_connect_to_task_warning({ isConnected: true, message });
          return;
        }

        // Prevent connecting new node to task or task to new node
        if ((isNewNodeSource && isTaskTarget) || (isNewNodeTarget && isTaskSource)) {
          let message = t('cannot_connect_new_node_to_task');
          setCannot_connect_to_task_warning({ isConnected: true, message });
          return;
        }

        if ((isTaskSource && params.target?.startsWith('board-')) ||
          (isTaskTarget && params.source?.startsWith('board-'))) {
          let message = t('cannot_connect_task_to_board');
          setCannot_connect_to_task_warning({ isConnected: true, message });
          return;
        }

        // --- Move task to another list if connecting task to list ---
        if (
          ((isTaskSource && isListTarget) || (isListSource && isTaskTarget)) &&
          !isNewNodeSource && !isNewNodeTarget
        ) {
          // Determine taskId, sourceListId, targetListId
          let taskId: number | null = null;
          let sourceListId: number | null = null;
          let targetListId: number | null = null;

          if (isTaskSource && isListTarget) {
            taskId = parseInt(params.source!.replace('task-', ''));
            targetListId = parseInt(params.target!.replace('list-', ''));
            // Find the source list by searching which list contains this task
            for (const list of maindmap_selected_board_data.lists) {
              if (list.tasks.some(task => task.id === taskId)) {
                sourceListId = list.id;
                break;
              }
            }
          } else if (isListSource && isTaskTarget) {
            taskId = parseInt(params.target!.replace('task-', ''));
            targetListId = parseInt(params.source!.replace('list-', ''));
            // Find the source list by searching which list contains this task
            for (const list of maindmap_selected_board_data.lists) {
              if (list.tasks.some(task => task.id === taskId)) {
                sourceListId = list.id;
                break;
              }
            }
          }

          // Only move if source and target lists are different
          if (
            taskId &&
            sourceListId &&
            targetListId &&
            sourceListId !== targetListId
          ) {
            sendMoveTask(taskId, sourceListId, targetListId);
          }
          // Do not create a new edge in this case
          return;
        }


        if (isNewNodeSource || isNewNodeTarget) {
          let newItemType: 'task' | 'list' = 'task';
          let targetId = '';
          let tempNodeId = '';

          if (isNewNodeSource) {
            tempNodeId = params.source!;
            if (params.target?.startsWith('board-')) {
              newItemType = 'list';
              targetId = params.target;
            } else if (params.target?.startsWith('list-')) {
              newItemType = 'task';
              targetId = params.target;
            }
          } else if (isNewNodeTarget) {
            tempNodeId = params.target!;
            if (params.source?.startsWith('board-')) {
              newItemType = 'list';
              targetId = params.source;
            } else if (params.source?.startsWith('list-')) {
              newItemType = 'task';
              targetId = params.source;
            }
          }

          if (targetId && tempNodeId) {
            setNewItemModal({
              isOpen: true,
              type: newItemType,
              name: '',
              targetId: targetId,
              tempNodeId: tempNodeId
            });
            return;
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
    [setEdges, edgeExists, viewMode, nodes, maindmap_selected_board_data, sendMoveTask]
  );



  // ========================================  Handle new item creation  ================================================
  const [isTempNodeCreated, setIsTempNodeCreated] = useState<boolean>(false);
  const [tempNodeId, setTempNodeId] = useState<string | null>(null);


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
    setIsTempNodeCreated(false);
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
    setNodes((nds) => nds.filter(node => node.id !== newItemModal.tempNodeId));
    setIsTempNodeCreated(false);
    setTempNodeId(null);

    setNewItemModal({
      isOpen: false,
      type: 'task',
      name: '',
      targetId: '',
      tempNodeId: ''
    });
  }, [newItemModal.tempNodeId, setNodes]);

  // =================================   Add new node with better labeling =========================================

  const addNewNode = useCallback(() => {
    setIsTempNodeCreated(true);

    const newNodeId = `temp-${Date.now()}`;
    setTempNodeId(newNodeId); // <-- store the ID

    let label_text = t('connect_board_or_list');

    const newNode: Node = {
      id: newNodeId,
      data: { label: label_text, isTemp: true },
      position: { x: Math.random() * 500 + 200, y: Math.random() * 300 + 200 },
      style: {
        background: currentTheme['--task-background-color'],
        color: 'white',
        border: '2px solid',
        borderColor: currentTheme['--border-color'],
        borderRadius: '8px',
        fontSize: '12px',
        padding: '8px',
        minWidth: '150px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, currentTheme]);

  // ================================== delete newly created node befor connection =====================================

  const handle_delete_new_node = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setIsTempNodeCreated(false);
    setTempNodeId(null); // <-- clear the temp node id

    setNewItemModal((prev) => {
      if (prev.tempNodeId === nodeId) {
        return {
          isOpen: false,
          type: 'task',
          name: '',
          targetId: '',
          tempNodeId: ''
        };
      }
      return prev;
    });
  }, [setNodes, setIsTempNodeCreated, setNewItemModal]);


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


  // ====================================================== move task ===================================================




  // ================================= Handle task update using the existing modal's format===========================
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
    if (mindMapSocketRef.current && mindMapSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        action: 'delete_task',
        payload: {
          task_id: taskId,
          list_id: listId
        }
      };

      try {
        mindMapSocketRef.current.send(JSON.stringify(message));
        console.log('Successfully sent delete task:', message);
      } catch (error) {
        console.error('Error sending delete task message:', error);
      }
    } else {
      console.error('WebSocket is not connected for deleting task');
    }
  }, []);

  // ========================================================================================================================
  // ========================================================================================================================
  // ====================================== Handle TASK node click for editing ==============================================
  // ========================================================================================================================
  // ========================================================================================================================

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    console.log('Mouse event:', event);

    if (viewMode === 'board') {
      // Handle task node clicks
      if (node.id.startsWith('task-')) {
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
      // Handle list node clicks
      else if (node.id.startsWith('list-')) {
        const listId = parseInt(node.id.replace('list-', ''));

        // Find the list in the current board data
        const foundList = maindmap_selected_board_data.lists.find(list => list.id === listId);

        if (foundList) {
          setEditingList(foundList);
          setListNameInput(foundList.name);
          setIsListEditModalOpen(true);
        }
      }

      else if (node.id.startsWith('board-')) {
        const boardId = parseInt(node.id.replace('board-', ''));

        // Use the main board object for editing
        if (maindmap_selected_board_data.id === boardId) {
          setEditingBoard(maindmap_selected_board_data);
          setBoardNameInput(maindmap_selected_board_data.name);
          setIsBoardEditModalOpen(true);
        }
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



  // ============== Update the convertBoardToMindMap function to regenerate nodes when board data changes ==============

  useEffect(() => {
    if (viewMode === 'board' && maindmap_selected_board_data?.id) {
      const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(maindmap_selected_board_data);
      setNodes(boardNodes);
      setEdges(boardEdges);

    }
  }, [maindmap_selected_board_data, viewMode, convertBoardToMindMap, setNodes, setEdges]);



  const boardOptions = boards.map(board => ({
    value: board.id,
    label: board.name,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      background: currentTheme['--task-background-color'],
      color: currentTheme['--main-text-coloure'],
      borderColor: currentTheme['--border-color'],
      borderRadius: 6,
      minHeight: 35,
      boxShadow: 'none',
      width: 220,
      height: 35,
      minWidth: 220,
      maxWidth: 220,
    }),
    menu: (provided: any) => ({
      ...provided,
      background: currentTheme['--task-background-color'],
      color: currentTheme['--main-text-coloure'],
      borderColor: currentTheme['--border-color'],
      zIndex: 10,
      width: 260,
      minWidth: 260,
      maxWidth: 260,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      background: state.isFocused
        ? currentTheme['--hover-color']
        : currentTheme['--task-background-color'],
      color: currentTheme['--main-text-coloure'],
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
    input: (provided: any) => ({
      ...provided,
      color: currentTheme['--main-text-coloure'],
    }),
  };

  // ================================= reset positions to default =========================================

  const handleResetPositions = useCallback(() => {
    if (!maindmap_selected_board_data?.id) return;
    // Remove saved positions from localStorage
    const key = getPositionStorageKey(maindmap_selected_board_data.id);
    localStorage.removeItem(key);

    // Regenerate nodes/edges with default positions
    const { nodes: boardNodes, edges: boardEdges } = convertBoardToMindMap(maindmap_selected_board_data);
    setNodes(boardNodes);
    setEdges(boardEdges);
  }, [
    maindmap_selected_board_data,
    getPositionStorageKey,
    convertBoardToMindMap,
    setNodes,
    setEdges,
  ]);

  // =============================================== return to boards ================================================

  const returnToBoards = () => {
    if (maindmap_selected_board_data.id !== 0 && maindmap_selected_board_data.id !== null) {
      setSelectedBoard(maindmap_selected_board_data)
      setSelectedComponent("Boards"); // Switch to the Boards view
      navigate(`/mainpage/boards/`);
    } else {
      return;
    }
  }


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

      {isListEditModalOpen && editingList && (
        <Mindmap_ListName_Modal
          editingList={editingList}
          isListEditModalOpen={isListEditModalOpen}
          currentTheme={currentTheme}
          handleCancelListEdit={handleCancelListEdit}
          listNameInput={listNameInput}
          setListNameInput={setListNameInput}
          handleListNameUpdate={handleListNameUpdate}

        />
      )}
      {isBoardEditModalOpen && editingBoard && (
        <Mindmap_BoardName_Modal
          editingBoard={editingBoard}
          isBoardEditModalOpen={isBoardEditModalOpen}
          currentTheme={currentTheme}
          handleCancelBoardEdit={handleCancelBoardEdit}
          boardNameInput={boardNameInput}
          setBoardNameInput={setBoardNameInput}
          handleBoardNameUpdate={handleBoardNameUpdate}
        />
      )}

      {cannot_connect_to_task_warning.isConnected && (
        <div className='warning_message_container'>
          <div className='dark_background'> </div>
          <div
            className='warning_text'
            style={{
              color: currentTheme['--main-text-coloure'],
              background: currentTheme['--list-background-color'],
              borderColor: currentTheme['--border-color'],
            }}
          >
            <div className='warning_little_container'>
              <PiWarningFill className='taskwarning_icon' />
              <p className='warning_text_message'
                style={{
                  color: currentTheme['--main-text-coloure'],

                }}
              >
                {cannot_connect_to_task_warning.message}
              </p>
            </div>
            <button
              onClick={() => setCannot_connect_to_task_warning({ isConnected: false, message: '' })}
              className='warning_close_button'
              style={{
                backgroundColor: currentTheme['--task-background-color'],
                borderColor: currentTheme['--border-color'],
              }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* New Item Creation Modal */}
      {newItemModal.isOpen && (
        <div className='diagram_new_item_container'>
          <div
            className='new_item_modal'
            style={{
              background: currentTheme['--background-color'],
              border: `1px solid ${currentTheme['--border-color']}`,
            }}
          >
            <h3 style={{
              color: currentTheme['--main-text-coloure'],
              marginBottom: '15px',
              fontSize: '16px'
            }}>
              {t('create')} {newItemModal.type === 'task' ? t('task_only') : t('list_only')}
            </h3>

            <input
              type="text"
              placeholder={`${t('enter')}  ${t(`${newItemModal.type}`)}  ${t('name')}...`}
              value={newItemModal.name}
              onChange={(e) => setNewItemModal(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newItemModal.name.trim()) {
                  handleCreateNewItem();
                }
              }}
              className='new_item_input'
              maxLength={newItemModal.type === 'task' ? 50 : 1000}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: `1px solid ${currentTheme['--border-color']}`,
                ['--placeholder-color']: currentTheme['--due-date-color'],
              } as React.CSSProperties}
              autoFocus
            />

            <div className='create_new_item_buttons_cont' >
              <button
                onClick={handleCancelNewItem}
                className='cancel_new_item_button'
                style={{
                  background: currentTheme['--task-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  borderColor: currentTheme['--border-color'],
                }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateNewItem}
                disabled={!newItemModal.name.trim()}
                className='create_new_item_button'
                style={{
                  background: currentTheme['--task-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  borderColor: currentTheme['--border-color'],
                  cursor: newItemModal.name.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {t('create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Board Selection Panel */}
      {boards.length > 0 && (
        <div
          className='mindmap_board_selection_panel_container'
          style={{
            background: currentTheme['--background-color'],
            borderColor: currentTheme['--border-color'],
          }}
        >

          {maindmap_selected_board_data.id !== 0 && (
            <div
              className='mindmap_board_return_container'
              style={{ background: currentTheme['--task-background-color'] }}
              onClick={returnToBoards}
            >
              <FaClipboardList className='mindmap_board_selection_icon'
                style={{ color: currentTheme['--main-text-coloure'] }}
              />
              <p className='return_board_p'> {t('boards_mode')}</p>
            </div>
          )}


          <Select
            value={boardOptions.find(opt => opt.value === maindmap_selected_board_data?.id)}
            onChange={option => handleBoardChange(String(option?.value))}
            options={boardOptions}
            styles={customStyles}
            placeholder="Select a board..."
            isSearchable
          />

          {maindmap_selected_board_data.id !== 0 && (
            <>
              {isTempNodeCreated && tempNodeId ? (
                <button
                  onClick={() => handle_delete_new_node(tempNodeId)}
                  className='delete_new_node_button'
                  style={{
                    background: currentTheme['--task-background-color'],
                    color: currentTheme['--main-text-coloure'],
                  }}
                >
                  {t('delete')}
                </button>
              ) : (
                <button
                  onClick={addNewNode}
                  style={{
                    background: currentTheme['--task-background-color'],
                    color: currentTheme['--main-text-coloure'],
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  className='add_new_node_button'
                >
                  {t('add_list_task')}
                </button>
              )}
            </>
          )}

          {viewMode === 'board' && maindmap_selected_board_data && (
            <button
              onClick={handleResetPositions}
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              className='reset_positions_button'
            >
              {t('reset_positions')}
            </button>
          )}

        </div>

      )}


      <div className='mindmap_diagram_container'>
        {diagram_loading ? (
          <div className="diagram_loader_container"><HashLoader color={currentTheme['--main-text-coloure']} className='hashloader' /></div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView={true}
            multiSelectionKeyCode="Shift"
            deleteKeyCode={null}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            style={{
              background: currentTheme['--background-color'],
              width: '800px',
              height: '600px',
            }}
            onInit={(instance) => {
              reactFlowInstanceRef.current = instance;
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
                  return `${currentTheme['--task-background-color']}`;
                }
                return '#10b981';
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
              maskColor="rgba(30, 41, 59, 0.8)"
              style={{
                backgroundColor: currentTheme['--background-color'],
              }}
            />

            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color={currentTheme['--due-date-color']}
            />
          </ReactFlow>

        )}
      </div>

    </div>
  );
};

export default MindMap;