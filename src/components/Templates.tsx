import "../styles/Templates.css";
import React from "react";
import { useState } from "react";
import { Template } from "../utils/interface";
import axiosInstance from "../utils/axiosinstance";
import { templates } from "../utils/Templates";
import { ThemeSpecs } from "../utils/theme";
import ConfirmationDialog from "./Boards/ConfirmationDialog";
import { useTranslation } from 'react-i18next';


interface TemplatesProps {
  handleTemplateSelect: (template: number) => void;
  currentTheme: ThemeSpecs;
  setIsLoading: (isLoading: boolean) => void;
}


const Templates: React.FC<TemplatesProps> = ({ handleTemplateSelect, currentTheme, setIsLoading }) => {

  const [dialogTemplateId, setDialogTemplateId] = useState<number | null>(null);

  const { t } = useTranslation();

  const handleTemplateClick = (templateId: number) => {
    setDialogTemplateId(templateId);
  };


  const handle_select_template = async (template: Template) => {
    setIsLoading(true);
    setDialogTemplateId(null); // Close the dialog after confirmation
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      async function urlToBlob(url: string): Promise<Blob> {
        const response = await fetch(url);
        return await response.blob();
      }

      const formData = new FormData();
      formData.append("name", template.board.name);

      if (template.background_image) {
        const blob = await urlToBlob(template.background_image);
        // Use a unique filename for each template
        const fileExt = template.background_image.split('.').pop() || 'webp';
        formData.append(
          "background_image",
          blob,
          `background_template_${template.id}.${fileExt}`
        );
      }
      formData.append("lists", JSON.stringify(template.lists));
      // Use the new endpoint for template creation
      const boardResponse = await axiosInstance.post(
        "/api/create-from-template/", // <-- trailing slash is important
        formData,
        config
      );

      const newBoard = boardResponse.data;

      // Notify the parent component to update the selected board
      handleTemplateSelect(newBoard.id);
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setIsLoading(false);
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
    <div className="templates_container"   >
      <h2>{t("choose_a_template")}</h2>
      <div className="templates-list">
        {templates.map((template) => (
          <div key={template.id}>
            <div className="template_boardname_button_cont" >
              <h1 className="template_boardname" style={{ color: currentTheme['--main-text-coloure'] }}>{template.name}</h1>
              <button
                className="select_template_button"
                onClick={() => handleTemplateClick(template.id)}
                style={{
                  backgroundColor: currentTheme['--task-background-color'],
                  color: currentTheme['--main-text-coloure'],
                  borderColor: currentTheme['--background-color'],
                }}
              >
                {t("select_template")}
              </button>
            </div>


            <div
              key={template.id}
              className="template_card"
              style={{ backgroundImage: `url(${template.background_image})` }}
            >
              {template.lists.map((list) => (
                <div
                  className="each_template_board_list"
                  key={list.name}
                  style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}
                >
                  <p className="template_list_name" style={{ color: currentTheme['--main-text-coloure'] }} > {list.name}</p>

                  {list.tasks.map((task) => (
                    <div key={task.title} className="task_item" style={{
                      backgroundColor: `${currentTheme['--task-background-color']}`,
                      color: `${currentTheme['--main-text-coloure']}`,
                    }}>
                      <div className="priority" style={getPriorityStyle(task.priority)}></div>
                      <p className="template_task_p" style={{ color: currentTheme['--main-text-coloure'] }} >{task.title}</p>
                      <p className='template_due_Date_p' style={{ color: currentTheme['--due-date-color'] }} >No due date</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div>
              {dialogTemplateId === template.id && (
                <ConfirmationDialog
                  onConfirm={() => handle_select_template(template)}
                  onCancel={() => setDialogTemplateId(null)}
                  message={`${t('are_you_sure_you_want_to_select_the_template')} "${template.name}"?`}
                  currentTheme={currentTheme}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;



