import "../styles/Members.css";
import React, { useEffect, useState, useCallback } from "react";
import { board } from "./Boards";
import { Board_Users } from "./Boards";
import testimage from "../assets/profile_3.png";
import { LuUserRoundPlus } from "react-icons/lu";
import { CgCloseR } from "react-icons/cg";
import axiosInstance from "../utils/axiosinstance";
import { RiCloseFill } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";


interface MembersProps {
  selectedBoard: board;
  socketRef: React.MutableRefObject<WebSocket | null>;
  current_user_email: string;
}

const Members: React.FC<MembersProps> = ({ selectedBoard, socketRef, current_user_email }) => {
  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);
  const [isUsersWindowOpen, setIsUsersWindowOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<{ email: string }[]>([]);


  const [isDeletingSelectedUser, setIsDeletingSelectedUser] = useState<boolean>(false);
  const [current_board_user_to_delete, setCurrent_board_user_to_delete] = useState({} as Board_Users);
  const [selected_emails, setSelected_emails] = useState<string[]>([]);



  const is_current_user_owner = current_board_users.find(user => user.email === current_user_email)?.user_status === 'owner'
  const is_current_user_admin = current_board_users.find(user => user.email === current_user_email)?.user_status === 'admin'
  // const is_current_user_member = current_board_users.find(user => user.email === current_user_email)?.user_status === 'member'
  const is_current_user_admin_or_owner = is_current_user_owner || is_current_user_admin



  // ============================================  set new statuses for users ============================================
  const handleStatusChange = (userId: number, newStatus: string) => {
    console.log(`Changing status for user ${userId} to ${newStatus}`);
    setCurrent_board_users((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      );

      console.log('Updated users:', updatedUsers);
      return updatedUsers;
    });

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'set_status',
        payload: {
          user_id: userId,
          new_status: newStatus,
          board_id: selectedBoard.id
        }
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
    if (selectedBoard.id) {
      fetch_current_board_users();
    }
  }, [selectedBoard]);
  // -------------------------------------------- fetch current board users ------------------------------------------------
  const fetch_current_board_users = async () => {
    try {
      const response = await axiosInstance.get(`/api/boards/${selectedBoard.id}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("fetched board users ", response.data);
      setCurrent_board_users(response.data);
    } catch (error) {
      console.error('Error fetching board users:', error);
    }
  };


  // -------------------------------------------- add new users to board ------------------------------------------------

  const handleAddUsers = async () => {
    console.log('Adding users:', selected_emails);
    try {
      const response = await axiosInstance.post(`/api/boards/${selectedBoard.id}/add_users/`, {
        emails: selected_emails
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("Added users to board:", response.data);
      if (response.status === 200) {
        fetch_current_board_users();
      }
      else {
        console.log('Error adding users to board:', response.data);
      }
    } catch (error) {
      console.error('Error adding users to board:', error);
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
    const response = await axiosInstance.delete(`/api/boards/${selectedBoard.id}/users/${userId}/delete/`, {
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


  // =========================================================================================================================



  return (
    <div className="main_members_container">
      <h3 className="members_h2"></h3>
      {current_board_users.map((boardUser) => (
        <img
          key={boardUser.id}
          src={boardUser.profile_picture || testimage}
          alt="user profile"
          className="user_profile_images"
        />
      ))}
      <LuUserRoundPlus className="add_user_icon" onClick={() => setIsUsersWindowOpen(true)} />
      <div>
        {isUsersWindowOpen && (
          <div className="all_users_main_window">
            <div className="bloored_ackgrownd"></div>
            <div className="each_user_container">
              <div className="close_icon_cont">
                <CgCloseR className="close_icon" onClick={() => setIsUsersWindowOpen(false)} />
              </div>

              {/* search input for searchjing users  */}
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
                  Add Users
                </button>
              )}


              {current_board_users.map(boardUser => (
                <div className="each_user" key={boardUser.id}  >

                  <div className="image_and_name_cont">
                    <img
                      src={boardUser.profile_picture || testimage}
                      alt="user profile"
                      className="board_user_images"
                    />
                    <p>{boardUser.username}</p>
                    <p className="boarduser_email">{boardUser.email}</p>
                  </div>

                  <div className="select_and_delete_icon">
                    {is_current_user_admin_or_owner ? (
                      boardUser.user_status === 'owner' && !is_current_user_owner ? (
                        <p>{boardUser.user_status}</p>
                      ) : (
                        <select
                          className="select_status"
                          value={boardUser.user_status}
                          onChange={(e) => handleStatusChange(boardUser.id, e.target.value)}
                        >
                          <option value="owner" disabled={!is_current_user_owner}>owner</option>
                          <option value="admin">admin</option>
                          <option value="member">member</option>
                        </select>
                      )
                    ) : (
                      <p>{boardUser.user_status}</p>
                    )}
                    <RiDeleteBinLine
                      className={`delete_user ${is_current_user_admin_or_owner ? "delete_icon_for_admin" : "delete_icon_for_member"}`}
                      onClick={() => handle_delete_icon_click(boardUser)}
                    />
                  </div>
                </div>
              ))}
              {isDeletingSelectedUser && (
                <div className="delete_user_window">
                  <div className="dark_background_for_delete" ></div>
                  <p>Do you want to delete <b>{current_board_user_to_delete.username}</b> from current board?</p>
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