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


  const [selected_emails, setSelected_emails] = useState<string[]>([]);



  // const is_current_user_owner = current_board_users.find(user => user.email === current_user_email)?.status === 'owner'
  // const is_current_user_admin = current_board_users.find(user => user.email === current_user_email)?.status === 'admin'
  // const is_current_user_member = current_board_users.find(user => user.email === current_user_email)?.status === 'member'
  // const is_current_user_admin_or_owner = is_current_user_owner || is_current_user_admin 



  // console.log('is_current_user_admin_or_owner >>', is_current_user_admin_or_owner)
  // // =========================================================================================================

  // useEffect(() => {
  //   console.log("suggestedUsers", suggestedUsers);
  // }, [suggestedUsers]);


  useEffect(() => {
    if (selectedBoard?.board_users) {
      setCurrent_board_users(selectedBoard.board_users);
    }
  }, [selectedBoard]);

  const handleStatusChange = (userId: number, newStatus: string) => {
    setCurrent_board_users((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'set_status',
        payload: {
          user_id: userId,
          new_status: newStatus,
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
  // =========================================================================================================

  const handle_email_click = (email: string) => {
    setSelected_emails((prev_emails) => {
      if (prev_emails.includes(email)) {
        return prev_emails.filter((prev_email) => prev_email !== email);
      } else {
        return [...prev_emails, email];
      }
    });
  };

  const handleAddUsers = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'add_user',
        payload: {
          emails: selected_emails, // Send an array of emails
          board_id: selectedBoard.id, // Include the current board ID
        }
      }));
      setIsUsersWindowOpen(false);
      setSelected_emails([]);
      setSearchInput("");
      setSuggestedUsers([]);
    }
  };


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

              <button onClick={handleAddUsers}>Add Users</button>


              {current_board_users.map(boardUser => (
                <div className="each_user" key={boardUser.id}>
                  <div className="image_and_name_cont">
                    <img
                      src={boardUser.profile_picture || testimage}
                      alt="user profile"
                      className="board_user_images"
                    />
                    <p>{boardUser.username}</p>
                  </div>

                  <div className="select_and_delete_icon">
                    <select
                      className="select_status"
                      value={boardUser.status}
                      onChange={(e) => handleStatusChange(boardUser.id, e.target.value)}
                    >
                      <option value="owner">owner</option>
                      <option value="admin">admin</option>
                      <option value="member">member</option>
                    </select>

                    {/* <RiDeleteBinLine className={`delete_user ${is_current_user_admin_or_owner ? "delete_icon_for_admin" : "delete_icon_for_member"} `} /> */}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;