import "../styles/Members.css";
import React, { useEffect, useState } from "react";
import { board } from "./Boards";
import { Board_Users } from "./Boards";
import testimage from "../assets/profile_3.png";
import { LuUserRoundPlus } from "react-icons/lu";





interface MembersProps {
  selectedBoard: board;
}

const Members: React.FC<MembersProps> = ({ selectedBoard }) => {
  const [current_board_users, setCurrent_board_users] = useState<Board_Users[]>([]);
  const [isUsersWindowOpen, setIsUsersWindowOpen] = useState<boolean>(false);


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
      <LuUserRoundPlus className="add_user_icon" onClick={() => setIsUsersWindowOpen(true)} />
      <div>

        {isUsersWindowOpen && (
          <div className="all_users_main_window">
            <div className="bloored_ackgrownd" ></div>
            <div className="each_user_container" >
              {current_board_users.map(boardUser => (
                <div className="each_user" key={boardUser.id}>
                  <div className="image_and_name_cont" >
                    <img
                      src={boardUser.profile_picture || testimage}
                      alt="user profile"
                      className="board_user_images"
                    />
                    <p>{boardUser.username}</p>
                  </div>
                  <p>{boardUser.status}</p>

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