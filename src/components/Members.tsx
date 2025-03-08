import "../styles/Members.css";
import React, { useEffect, useState } from "react";
import { board } from "./Boards";
import { Board_Users } from "./Boards";
import testimage from "../assets/profile_3.png";

interface MembersProps {
  selectedBoard: board;
}

const Members: React.FC<MembersProps> = ({ selectedBoard }) => {
  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);

  useEffect(() => {
    if (selectedBoard?.board_users) {
      setCurrent_board_users(selectedBoard.board_users);
    }
  }, [selectedBoard]);

  useEffect(() => {
    console.log(current_board_users);
  }, [current_board_users]);

  return (
    <div className="main_members_container">
      <h3 className="members_h2"  >Members:</h3>
      {current_board_users.map((boardUser) => (
        <img
          key={boardUser.id}
          src={boardUser.profile_picture || testimage}
          alt="user profile"
          className="user_profile_images"
        />
      ))}
    </div>
  );
};

export default Members;