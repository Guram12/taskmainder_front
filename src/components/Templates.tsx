import "../styles/Templates.css";
import React from "react";
import { useState } from "react";
import { Template } from "../utils/interface";
import axiosInstance from "../utils/axiosinstance";
import { templates } from "../utils/Templates";
import { ThemeSpecs } from "../utils/theme";
import GridLoader from "react-spinners/GridLoader";



interface TemplatesProps {
  handleTemplateSelect: (template: number) => void;
  currentTheme: ThemeSpecs;
}


const Templates: React.FC<TemplatesProps> = ({ handleTemplateSelect, currentTheme }) => {
  const [isTemplateSaved, setIsTemplateSaved] = useState<boolean>(false);





  const handle_tanmplate_click = async (template: Template) => {
    setIsTemplateSaved(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      // Set the Authorization header with the access token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Create the board
      const boardResponse = await axiosInstance.post(
        "/api/boards/",
        {
          name: template.board.name,
        },
        config
      );

      const newBoard = boardResponse.data;

      // Create the lists and tasks
      for (const list of template.lists) {
        const listResponse = await axiosInstance.post(
          "/api/lists/",
          {
            name: list.name,
            board: newBoard.id,
          },
          config
        );

        const newList = listResponse.data;

        for (const task of list.tasks) {
          await axiosInstance.post(
            "/api/tasks/",
            {
              title: task.title,
              description: task.description,
              due_date: task.due_date,
              list: newList.id,
              priority: task.priority,
            },
            config
          );
        }
      }

      // Notify the parent component to update the selected board
      handleTemplateSelect(newBoard.id);
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setIsTemplateSaved(false);
    }
  };

  // =========================================== set priority styles ==========================================

  const priorityStyles = {
    green: { backgroundColor: '#15cf8a' },
    orange: { backgroundColor: '#fcc603' },
    red: { backgroundColor: '#d60000' },
  };

  const getPriorityStyle = (priority: 'green' | 'orange' | 'red' | null) => {
    return priority ? priorityStyles[priority] : {};
  };


  return (
    <div className="templates_container">
      {isTemplateSaved && (
        <div className="template_loader_container" >
          <GridLoader color={`${currentTheme['--main-text-coloure']}`} size={20} className="gridloader" />
        </div>
      )}

      <h2>Choose a Template</h2>
      <div className="templates-list">
        {templates.map((template) => (
          <div key={template.id}>
            <div className="template_boardname_button_cont" >
              <h1 className="template_boardname">{template.name}</h1>
              <button onClick={() => handle_tanmplate_click(template)} >select template</button>
            </div>

            <div
              key={template.id}
              className="template_card"
            >
              {template.lists.map((list) => (
                <div className="each_template_board_list" key={list.name} style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}>
                  <p className="template_list_name"> {list.name}</p>

                  {list.tasks.map((task) => (
                    <div key={task.title} className="task_item">
                      <div className="priority" style={getPriorityStyle(task.priority)}></div>
                      <p className="template_task_p" >{task.title}</p>
                      <p className='template_due_Date_p'>No due date</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;



