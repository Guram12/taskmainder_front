import "../styles/Members.css";
import React, { useEffect, useState } from "react";
import { board } from "./Boards";
import { Board_Users } from "./Boards";
import testimage from "../assets/profile_3.png";
import { LuUserRoundPlus } from "react-icons/lu";
import { CgCloseR } from "react-icons/cg";
import axiosInstance from "../utils/axiosinstance";

interface MembersProps {
  selectedBoard: board;
  socketRef: React.MutableRefObject<WebSocket | null>;
}

const Members: React.FC<MembersProps> = ({ selectedBoard, socketRef }) => {
  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);
  const [isUsersWindowOpen, setIsUsersWindowOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<{ email: string }[]>([]);

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

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0) {
      try {
        const response = await axiosInstance.get(`acc/user-emails/?search=${value}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error("Error fetching user emails:", error);
      }
    } else {
      setSuggestedUsers([]);
    }
  };

  return (
    <div className="main_members_container">
      <h3 className="members_h2">Members:</h3>
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
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search users by email"
              />
              <div className="suggested_users_list">
                {suggestedUsers.map((user) => (
                  <div key={user.email} className="suggested_user">
                    {user.email}
                  </div>
                ))}
              </div>
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
                  <select
                    className="select_status"
                    value={boardUser.status}
                    onChange={(e) => handleStatusChange(boardUser.id, e.target.value)}
                  >
                    <option value="member">member</option>
                    <option value="owner">owner</option>
                  </select>
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