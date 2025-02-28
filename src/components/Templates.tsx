import React from "react";
import "../styles/Templates.css";
const Templates: React.FC = () => {
  const templates = [
    { id: 1, name: "Template 1", description: "This is the first template" },
    { id: 2, name: "Template 2", description: "This is the second template" },
    { id: 3, name: "Template 3", description: "This is the third template" }
  ]

  return (
    <div className="container">
      <h1 className="header">
        Templates Page
      </h1>
      <ul className="template-list">
        {templates.map(template => (
          <li key={template.id} className="template-item">
            <h2>{template.name}</h2>
            <p>{template.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Templates;