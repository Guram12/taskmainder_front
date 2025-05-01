import React from 'react';
import { tasks } from '../../utils/interface';
import { useDrag, useDrop, } from 'react-dnd';



const Task: React.FC<{ task: tasks }> = ({ task }) => {
  const ItemTypes = {
    TASK: 'task',
  };


  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, listId: task.list },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {task.title}
    </div>
  );
};


export default Task;

