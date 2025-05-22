import "../styles/NoBoards.css";
import React from "react"
import { ThemeSpecs } from "../utils/theme";
import nothink_selected from '../assets/nothing_selected.png';




interface NoBoardProps {
  currentTheme: ThemeSpecs;
}

const NoBoards: React.FC<NoBoardProps> = ({ currentTheme }) => {

  return (
    <div className="no_boards_container" style={{ color: currentTheme['--main-text-coloure'] }}>
      <img src={nothink_selected} alt="nothing selected" className="nothing_selected_img" />
      <h2>No Boards Available</h2>
      <p>Please create a new board to get started.</p>
    </div>
  );
}



export default NoBoards;
















