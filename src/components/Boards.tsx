import { board } from "../App";
import React from "react";





interface BoardsProps {
  selectedBoard: board;
}


const Boards:React.FC<BoardsProps> = ({selectedBoard}) => {



  return(
    <div>
      <h1>Boards component</h1>
      selectedBoard: {selectedBoard.name}
      selectedboard lists : {selectedBoard.lists.map(list => list.name)}
    </div>
  )
}



export default Boards;





















