import "../styles/Templates.css";
import React from "react";
import { Template } from "../utils/interface";
import axiosInstance from "../utils/axiosinstance";



interface TemplatesProps {
  handleTemplateSelect: (template: number) => void;
}


const Templates: React.FC<TemplatesProps> = ({ handleTemplateSelect }) => {

  const handle_tanmplate_click = async (template: Template) => {
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
            },
            config
          );
        }
      }

      // Notify the parent component to update the selected board
      handleTemplateSelect(newBoard.id);
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };
  return (
    <div className="templates_container">
      <h2>Choose a Template</h2>
      <div className="templates-list">
        {templates.map((template) => (
          <div>
            <div className="template_boardname_button_cont" >
              <h1 className="template_boardname">{template.name}</h1>
              <button onClick={() => handle_tanmplate_click(template)} >select template</button>
            </div>

            <div
              key={template.id}
              className="template_card"
            >
              {template.lists.map((list) => (
                <div className="each_template_board_list" key={list.name}>
                  {list.name}
                  {list.tasks.map((task) => (
                    <li key={task.title} className="task_item">
                      <strong>{task.title}</strong>: {task.description || "No description"}
                    </li>
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











export const templates: Template[] = [
  {
    id: 1,
    name: "Project Management",
    board: {
      name: "Project Board",
    },
    lists: [
      {
        name: "To Do",
        tasks: [
          { title: "Task 1", description: "Description 1", due_date: null },
          { title: "Task 2", description: "Description 2", due_date: null },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Task 3", description: "Description 3", due_date: null },
        ],
      },
      {
        name: "Done",
        tasks: [],
      },
      {
        name: "To Do1",
        tasks: [
          { title: "Task 1", description: "Description 1", due_date: null },
          { title: "Task 2", description: "Description 2", due_date: null },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Personal Goals 0",
    board: {
      name: "Goals Board",
    },
    lists: [
      {
        name: "Short Term Goals",
        tasks: [
          { title: "Goal 1", description: "Description 1", due_date: null },
        ],
      },
      {
        name: "Long Term Goals",
        tasks: [],
      },
    ],
  },
  {
    id: 3,
    name: "Personal Goals",
    board: {
      name: "Goals Board",
    },
    lists: [
      {
        name: "Short Term Goals 1",
        tasks: [
          { title: "Goal 1", description: "Description 1", due_date: null },
        ],
      },
      {
        name: "Long Term Goals",
        tasks: [],
      },
    ],
  },
  {
    id: 4,
    name: "Personal Goals 2",
    board: {
      name: "Goals Board",
    },
    lists: [
      {
        name: "Short Term Goals",
        tasks: [
          { title: "Goal 1", description: "Description 1", due_date: null },
        ],
      },
      {
        name: "Long Term Goals",
        tasks: [],
      },
    ],
  },
];