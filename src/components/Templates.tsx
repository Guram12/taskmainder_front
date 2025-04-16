import React, { useState } from "react";
import "../styles/Templates.css";

const Templates: React.FC = () => {
  const templates = [
    { id: 1, name: "Template 1", description: "This is the first template" },
    { id: 2, name: "Template 2", description: "This is the second template" },
    { id: 3, name: "Template 3", description: "This is the third template" }
  ];

  const [favorites, setFavorites] = useState<number[]>([]);

  const handleButtonClick = (templateName: string) => {
    alert(`You clicked on ${templateName}`);
  };

  const toggleFavorite = (templateId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(templateId)
        ? prevFavorites.filter((id) => id !== templateId)
        : [...prevFavorites, templateId]
    );
  };

  return (
    <div className="container">
      <h1 className="header">Templates Page</h1>
      <ul className="template-list">
        {templates.map((template) => (
          <li key={template.id} className="template-item">
            <h2>{template.name}</h2>
            <p>{template.description}</p>
            <div className="template-actions">
              <button
                className="template-button"
                onClick={() => handleButtonClick(template.name)}
              >
                Select
              </button>
              <button
                className={`favorite-button ${
                  favorites.includes(template.id) ? "favorited" : ""
                }`}
                onClick={() => toggleFavorite(template.id)}
              >
                {favorites.includes(template.id) ? "Unfavorite" : "Favorite"}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2>Favorite Templates</h2>
          <ul className="favorite-list">
            {templates
              .filter((template) => favorites.includes(template.id))
              .map((template) => (
                <li key={template.id} className="favorite-item">
                  {template.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Templates;