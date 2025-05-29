import "../styles/Members.css";
import React, { useEffect, useState, useCallback } from "react";
import { board } from "../utils/interface";
import { Board_Users } from "../utils/interface";
import { CgCloseR } from "react-icons/cg";
import axiosInstance from "../utils/axiosinstance";
import { RiCloseFill } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { ThemeSpecs } from "../utils/theme";
import { MdModeEdit } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { GrFormCheckmark } from "react-icons/gr";
import { HiOutlineXMark } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationDialog from "./Boards/ConfirmationDialog";
import Avatar from '@mui/material/Avatar';
import getAvatarStyles from "../utils/SetRandomColor";
import Skeleton from 'react-loading-skeleton';






interface MembersProps {
  selectedBoard: board | null;
  socketRef: React.MutableRefObject<WebSocket | null>;
  current_user_email: string;
  currentTheme: ThemeSpecs;
  update_board_name: (new_board_name: string) => void;
  deleteBoard: () => void;
  setCurrent_board_users: (users: Board_Users[]) => void;
  current_board_users: Board_Users[];
  is_cur_Board_users_fetched: boolean;
  fetch_current_board_users: () => Promise<void>;
  setBoards: (boards: board[]) => void;
  boards: board[];
}

const Members: React.FC<MembersProps> = ({
  selectedBoard,
  socketRef,
  current_user_email,
  currentTheme,
  update_board_name,
  deleteBoard,
  setCurrent_board_users,
  current_board_users,
  is_cur_Board_users_fetched,
  fetch_current_board_users,
  setBoards,
  boards,

}) => {

  const [isUsersWindowOpen, setIsUsersWindowOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<{ email: string }[]>([]);


  const [isDeletingSelectedUser, setIsDeletingSelectedUser] = useState<boolean>(false);
  const [current_board_user_to_delete, setCurrent_board_user_to_delete] = useState({} as Board_Users);
  const [selected_emails, setSelected_emails] = useState<string[]>([]);

  const [isBoardEditing, setIsBoardEditing] = useState<boolean>(false);
  const [isBoardDeleting, setIsBoardDeleting] = useState<boolean>(false);
  const [newBoardName, setNewBoardName] = useState<string>('');


  useEffect(() => {
    console.log("is_cur_Board_users_fetched", is_cur_Board_users_fetched);
  }, [is_cur_Board_users_fetched]);


  const is_current_user_owner = current_board_users.find(user => user.email === current_user_email)?.user_status === 'owner'
  const is_current_user_admin = current_board_users.find(user => user.email === current_user_email)?.user_status === 'admin'
  // const is_current_user_member = current_board_users.find(user => user.email === current_user_email)?.user_status === 'member'
  const is_current_user_admin_or_owner = is_current_user_owner || is_current_user_admin




  // ============================================  set new statuses for users ============================================
  const handleStatusChange = (userId: number, newStatus: string) => {
    console.log(`Changing status for user ${userId} to ${newStatus}`);

    const updatedUsers: Board_Users[] = current_board_users.map((user) =>
      user.id === userId ? { ...user, user_status: newStatus } : user
    );
    setCurrent_board_users(updatedUsers);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'set_status',
        payload: {
          user_id: userId,
          new_status: newStatus,
          board_id: selectedBoard?.id,
        },
      }));
    }
  };
  // ======================================== debaunce function for search input ========================================
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestedUsers([]);
      return;
    }
  }, [searchInput]);

  const fetchSuggestedUsers = async (value: string) => {
    console.log('value', value);
    try {
      if (!value.trim()) {
        setSuggestedUsers([]);
        return;
      }
      const response = await axiosInstance.get(`acc/user-emails/?search=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSuggestedUsers(response.data);
    } catch (error) {
      console.error("Error fetching user emails:", error);
    }
  };

  const debouncedFetchSuggestedUsers = useCallback(debounce((value: string) => {
    if (value.trim()) {
      fetchSuggestedUsers(value);
    } else {
      setSuggestedUsers([]);
    }
  }, 300), []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0) {
      debouncedFetchSuggestedUsers(value);
    } else {
      setSuggestedUsers([]);
    }
  };



  // ======================================== fetch current  board useers ==================================================

  useEffect(() => {
    if (selectedBoard?.id) {
      fetch_current_board_users();
    }
  }, [selectedBoard?.id]);
  // -------------------------------------------- fetch current board users ------------------------------------------------

  // -------------------------------------------- add new users to board ------------------------------------------------
  // boards/<int:board_id>/send-invitation/

  const handleAddUsers = async () => {
    console.log('Sending invitations to:', selected_emails);
    try {
      const response = await axiosInstance.post(
        `/api/boards/${selectedBoard?.id}/send-invitation/`, // Add trailing slash here
        { email: selected_emails }, // array of emails 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Invitation sent successfully:", response.data);
        setSelected_emails([]); // Clear selected emails after sending invitations
      } else {
        console.error("Error sending invitation:", response.data);
        alert("Failed to send the invitation. Please try again.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("An error occurred while sending the invitation.");
    }
  };
  // --------------------------------------------- email click --------------------------------------

  const handle_email_click = (email: string) => {
    setSelected_emails((prev_emails) => {
      if (prev_emails.includes(email)) {
        let filtered_emails = prev_emails.filter((prev_email) => prev_email !== email);
        return filtered_emails;
      } else {
        return [...prev_emails, email];
      }
    });
  };

  // ========================================== delete user from members ==================================================
  const handleDeleteUser = async (userId: number) => {
    console.log('Deleting user:', userId);
    const response = await axiosInstance.delete(`/api/boards/${selectedBoard?.id}/users/${userId}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    console.log("response", response)
    if (response.status === 200) {
      fetch_current_board_users();
      setIsDeletingSelectedUser(false);
    }
  };


  const handle_delete_icon_click = (boardUser: Board_Users) => {
    setIsDeletingSelectedUser(true);
    setCurrent_board_user_to_delete(boardUser);
  }


  // =============================================   Edit board name   ========================================================


  const handle_edit_board_click = () => {
    setIsBoardEditing(true);
  }

  const handleBoardNameUpdate = () => {
    console.log('Updating board name:', newBoardName);

    // Create the updated boards array
    const updatedBoards = boards.map((board: board) =>
      board.id === selectedBoard?.id ? { ...board, name: newBoardName } : board
    );

    // Update the board name in the sidebar
    setBoards(updatedBoards);

    // Send the update to the server
    update_board_name(newBoardName);

    setIsBoardEditing(false);
  };

  // =============================================   Delete Board   ========================================================



  const handle_delete_board_icon_click = () => {
    setIsBoardDeleting(true);
  }

  const delete_board = () => {
    console.log('Deleting board:', selectedBoard?.id);
    deleteBoard();
    setIsBoardDeleting(false);
  }

  const canselBoardDelete = () => {
    setIsBoardDeleting(false);
  }

  useEffect(() => {
    console.log("Updated current board users:", current_board_users);
  }, [current_board_users]);


  // ============================================== Leav board ========================================================


  const [is_leaving_board, setIs_leaving_board] = useState<boolean>(false);

  const handleLeaveBoardClick = () => {
    setIs_leaving_board(true);
  }

  const handleLeaveBoard = async () => {
    try {
      const response = await axiosInstance.delete(`/api/boards/${selectedBoard?.id}/self-delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.status === 200) {
        console.log("Successfully left the board:", response.data);
        // Optionally, you can update the UI or redirect the user
        // For example, you might want to remove the board from the list of boards
        const updatedBoards = boards.filter(board => board.id !== selectedBoard?.id);
        setBoards(updatedBoards);



      } else {
        console.error("Failed to leave the board:", response.data);
      }
    } catch (error) {

    }
  }

  // =====================================================================================================================

  return (
    <div className="main_members_container">
      <RiUserSettingsFill className="add_user_icon" onClick={() => setIsUsersWindowOpen(true)} />

      {/* skeleton loader  befire fetching current board users, and after fetching current board users,
       it will be replaced with actual user avatars */}
      {!is_cur_Board_users_fetched ? (
        <div className="user_avatar_skeleton_cont" >
          <Skeleton
            circle
            height={30}
            width={30}
            style={{ marginLeft: '-10px' }}
            baseColor={currentTheme['--list-background-color']}
            highlightColor="#e0e0e0"
          />
          <Skeleton
            circle
            height={30}
            width={30}
            style={{ marginLeft: '-10px' }}
            baseColor={currentTheme['--list-background-color']}
            highlightColor="#e0e0e0"
          />
          <Skeleton
            circle
            height={30}
            width={30}
            style={{ marginLeft: '-10px' }}
            baseColor={currentTheme['--list-background-color']}
            highlightColor="#e0e0e0"
          />
        </div>
      )
        :
        (
          <>
            {current_board_users.map((boardUser) => (
              boardUser.profile_picture !== null ? (
                <img
                  key={boardUser.id}
                  src={boardUser.profile_picture}
                  alt="user profile"
                  className="user_profile_images"
                />
              ) : (

                <Avatar
                  key={boardUser.id}
                  className="user_profile_images"
                  sx={{ width: 30, height: 30 }}
                  alt={boardUser.username}
                  style={{
                    backgroundColor: getAvatarStyles(boardUser.username.charAt(0)).backgroundColor,
                    color: getAvatarStyles(boardUser.username.charAt(0)).color
                  }}
                >
                  {boardUser.username.charAt(0).toUpperCase()}
                </Avatar>
              )
            ))}
          </>
        )}


      {/* board name and icons for editing and deleting board, and board name */}
      <>
        <FaClipboardList className='board_icon' style={{ fill: `${currentTheme['--main-text-coloure']}` }} />
        <div className="board_name_cont">

          {isBoardEditing ? (
            <div className="board_name_inp_cont" >
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="board_name_input"
                placeholder="Enter new board name"
              />
              <GrFormCheckmark
                style={{ color: `${currentTheme['--main-text-coloure']}` }}
                className="save_board_name_icon"
                onClick={() => { handleBoardNameUpdate() }}
              />
              <HiOutlineXMark
                style={{ color: `${currentTheme['--main-text-coloure']}` }}
                className="discard_board_name_icon"
                onClick={() => setIsBoardEditing(false)}
              />
            </div>
          ) : (
            <>
              <h3 className="board_name" style={{ color: `${currentTheme['--main-text-coloure']}` }} >{selectedBoard?.name}</h3>
              {is_current_user_admin_or_owner && (

                <MdModeEdit
                  className="edit_board_name_icon"
                  style={{ fill: `${currentTheme['--main-text-coloure']}` }}
                  onClick={() => handle_edit_board_click()}
                />
              )}
              {is_current_user_owner && (

                <MdDeleteForever
                  className="delete_board_icon"
                  style={{ fill: `${currentTheme['--main-text-coloure']}` }}
                  onClick={() => handle_delete_board_icon_click()}
                />
              )}
              {isBoardDeleting && (
                <ConfirmationDialog
                  message={`Are you sure you want to delete the board "${selectedBoard?.name}"?`}
                  onConfirm={delete_board}
                  onCancel={canselBoardDelete}
                />
              )}
            </>
          )}
        </div>
      </>


      {/* current board users list and their permission in window */}
      <div>
        {isUsersWindowOpen && (
          <div className="all_users_main_window">
            <div className="bloored_ackgrownd"></div>
            <div className="each_user_container">
              <div className="close_icon_cont">
                <CgCloseR className="close_icon" onClick={() => setIsUsersWindowOpen(false)} />
              </div>
              <p>guram</p>
              {/* search input for searching users  */}
              {is_current_user_admin_or_owner && (
                <div className="parent_of_input_and_emails" >

                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    placeholder="Search users by email"
                  />

                  {/* suggested users conmtainer  */}
                  <div className="suggested_users_list">
                    {suggestedUsers.map((user) => (
                      <div key={user.email} className="suggested_user" onClick={() => handle_email_click(user.email)}>
                        {user.email}
                      </div>
                    ))}
                  </div>

                  <div style={{ width: '80%', height: '1px', backgroundColor: "black" }} ></div>

                  <div className="selected_emails_cont" >
                    {selected_emails.map((email) => (
                      <div key={email} className="selected_email" >
                        {email}
                        <RiCloseFill className='unselect_email' />
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* button for adding selected emails to board users  */}
              {is_current_user_admin_or_owner && (
                <button
                  onClick={() => handleAddUsers()}
                  style={{ cursor: `${selected_emails.length > 0 ? 'pointer' : 'not-allowed'}` }}
                  disabled={selected_emails.length === 0}
                >
                  Invite
                </button>
              )}

              <div className="each_user_child_container">
                {/* Rendering each user */}
                {current_board_users.map(boardUser => (
                  <div className="each_user" key={boardUser.id}>

                    <div className="image_and_name_cont">
                      {boardUser.profile_picture !== null ? (

                        <img
                          src={boardUser.profile_picture}
                          alt="user profile"
                          className="board_user_images"
                        />
                      ) : (
                        <Avatar
                          className="board_user_images"
                          alt={boardUser.username}
                          style={{
                            backgroundColor: getAvatarStyles(boardUser.username.charAt(0)).backgroundColor,
                            color: getAvatarStyles(boardUser.username.charAt(0)).color
                          }}
                        >
                          {boardUser.username.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                      <p>{boardUser.username}</p>
                      <p className="boarduser_email">{boardUser.email}</p>
                    </div>

                    <div className="select_and_delete_icon">
                      {is_current_user_admin_or_owner ? (
                        boardUser.user_status === 'owner' ? (
                          <p className="owner_status" >{boardUser.user_status}</p> // Owner cannot change their status
                        ) : (
                          <select
                            className="select_status"
                            value={boardUser.user_status}
                            onChange={(e) => handleStatusChange(boardUser.id, e.target.value)}
                          >
                            <option value="admin">admin</option>
                            <option value="member">member</option>
                          </select>
                        )
                      ) : (
                        <p >{boardUser.user_status}</p>
                      )}
                      {boardUser.user_status !== 'owner' && (
                        <RiDeleteBinLine
                          className={`delete_user ${is_current_user_admin_or_owner ? "delete_icon_for_admin" : "delete_icon_for_member"}`}
                          onClick={() => handle_delete_icon_click(boardUser)}
                        />
                      )}
                    </div>
                  </div>
                ))}
                {!is_current_user_owner && (
                  <div>
                    <button onClick={handleLeaveBoardClick} className="leave_board_button" >Leave board</button>
                    {is_leaving_board && (
                      <ConfirmationDialog
                        message={`Are you sure you want to leav the board "${selectedBoard?.name}"?`}
                        onConfirm={handleLeaveBoard}
                        onCancel={() => setIs_leaving_board(false)}
                      />
                    )}
                  </div>
                )}
              </div>

              {isDeletingSelectedUser && (
                <div className="delete_user_window">
                  <div className="dark_background_for_delete" ></div>
                  <p>Do you want to delete board: <b>{current_board_user_to_delete.username}</b> from current board?</p>
                  <button onClick={() => handleDeleteUser(current_board_user_to_delete.id)} >Yes</button>
                  <button onClick={() => setIsDeletingSelectedUser(false)} >No</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;