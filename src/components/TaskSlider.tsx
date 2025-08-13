import '../styles/taskSlider.css';
import '../styles/Board Styles/Task.css';
import React from 'react';
import { useState } from 'react';
import { ThemeSpecs } from '../utils/theme';
import { MdRadioButtonChecked } from "react-icons/md";
import { useTranslation } from 'react-i18next';




const slides = [
  { titleKey: "slider_plan_prioritize_finish", dueKey: "slider_due_today", priority: "" },
  { titleKey: "slider_call_designer", dueKey: "slider_due_tomorrow", priority: "Medium" },
  { titleKey: "slider_visualize_workflow", dueKey: "slider_due_this_week", priority: "" },
  { titleKey: "slider_built_for_busy", dueKey: "slider_due_next_week", priority: "" },
  { titleKey: "slider_turn_chaos", dueKey: "slider_due_monday", priority: "" },
  { titleKey: "slider_make_productivity_effortless", dueKey: "slider_due_anytime", priority: "" },
];


interface TaskSliderProps {
  currentTheme: ThemeSpecs;
}


const TaskSlider: React.FC<TaskSliderProps> = ({ currentTheme }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { t } = useTranslation();

  return (
    <div className="slider-wrapper">
      <div
        className={`slider-track${hoveredIndex !== null ? ' hovering' : ''}`}
      >
        {[...slides, ...slides].map((task, index) => (
          <div
            className={`each_task${hoveredIndex === index ? ' hovered' : ''}`}
            key={index}
            style={{
              backgroundColor: currentTheme['--task-background-color'],
              color: currentTheme['--main-text-coloure'],
              minWidth: 300,
              margin: '0 15px',
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
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
                }}>{t(task.titleKey)}</p>
            </div>
            <div className="task_description_and_due_date_container">
              <p className="due_Date_p" style={{ color: currentTheme['--due-date-color'] }} >
                {t('due_date')} {t(task.dueKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default TaskSlider;