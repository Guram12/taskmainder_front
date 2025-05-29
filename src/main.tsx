import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)














// case 'BOARD_INVITATION_ACCEPTED':
//   console.log('Board invitation accepted. Fetching current board users...');
//   setNotificationData(event.data); // Update state with notification data

//   // Find the board in the boards array
//   const invitedBoard = boards.find((board) => board.name === payload.boardName);
//   if (invitedBoard) {
//     console.log('Setting selectedBoard to the invited board:', invitedBoard);
//     setSelectedBoard(invitedBoard); // Explicitly set the selected board

//     // Fetch users for the updated board
//     fetch_current_board_users();
//   } else {
//     console.log('Board not found in current boards. Fetching boards...');
//     fetchBoards().then(() => {
//       // After fetching boards, try to find the board again
//       const updatedInvitedBoard = boards.find((board) => board.name === payload.boardName);
//       if (updatedInvitedBoard) {
//         console.log('Setting selectedBoard to the invited board after fetching boards:', updatedInvitedBoard);
//         setSelectedBoard(updatedInvitedBoard);
//         fetch_current_board_users();
//       } else {
//         console.error('Board still not found after fetching boards:', payload.boardName);
//       }
//     });
//   }
//   break;