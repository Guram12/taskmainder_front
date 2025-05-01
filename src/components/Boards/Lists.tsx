import React from "react";
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import Task from "./Tasks";
import { lists } from "../../utils/interface";







const List: React.FC<{
  list: lists,
  moveTask: (taskId: number, sourceListId: number, targetListId: number) => void
}> = ({ list, moveTask }) => {
  
  
  const ItemTypes = {
    TASK: 'task',
  };
  
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: number, listId: number }) => {
      if (item.listId !== list.id) {
        moveTask(item.id, item.listId, list.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`list ${isOver ? 'hover' : ''}`}>
      <h3>{list.name}</h3>
      {list.tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};



export default List;