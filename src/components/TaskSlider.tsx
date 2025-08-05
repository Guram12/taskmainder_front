import '../styles/taskSlider.css';
import '../styles/Board Styles/Task.css'; // Import real task styles
import React from 'react';
import { ThemeSpecs } from '../utils/theme';
import { MdRadioButtonChecked } from "react-icons/md";




const slides = [
  { title: "📋 Plan it. Prioritize it. Finish it.", due: "Today", priority: "" },
  { title: "Call designer", due: "Tomorrow", priority: "Medium" },
  { title: "📊 Visualize your workflow like never before.", due: "This Week", priority: "" },
  { title: "⏱️ Built for people who don’t have time to waste.", due: "Next Week", priority: "" },
  { title: "📦 Turn chaos into checklists.", due: "Monday", priority: "" },
  { title: "🚀 Make everyday productivity effortless.", due: "Anytime", priority: "" },
];


// const priorityColors = {
//   High: '#d60000',
//   Medium: '#fcc603',
//   Low: '#15cf8a',
// };


interface TaskSliderProps {
  currentTheme: ThemeSpecs;
}



const TaskSlider: React.FC<TaskSliderProps> = ({ currentTheme }) => {



  return (
    <div className="slider-wrapper">
      <div className="slider-track">
        {[...slides, ...slides].map((task, index) => (
          <div className="each_task"
            key={index}
            style={{
              backgroundColor: currentTheme['--task-background-color'],
              color: currentTheme['--main-text-coloure'],
              minWidth: 300,
              margin: '0 15px',
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}>
            <div className="task_complition_checkbox_container" style={{ borderColor: currentTheme['--border-color'] }}>
              <div className="completed_task_icon_cont">
                <MdRadioButtonChecked
                  style={{
                    color: currentTheme['--main-text-coloure'],
                    fontSize: '1.5rem',
                  }}
                />

              </div>
            </div>
            <div className="conteiner_for_task_title  sluider_task_title_container">
              <p className="task_title"
                style={{
                  maxWidth: '300px'
                }}>{task.title}</p>
            </div>
            <div className="task_description_and_due_date_container">
              <p className="due_Date_p" style={{ color: currentTheme['--due-date-color'] }} >Due: {task.due}</p>
              {/* <p className="no_associated_users_p">No users</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskSlider;