import React from "react";
import { board } from "./Boards";
import "../styles/Settings.css";





interface SettingsProps {
  boards: board[];
}


const Settings: React.FC<SettingsProps> = () => {

  return (
    <div>
      <h1>Settings componennt</h1>
      {/* settings content  */}
      <div className="settings-content">
        <div className="settings-content__header">
          <h2>Settings</h2>
        </div>
        <div className="settings-content__body">
          <div className="settings-content__body__section">
            <h3>Profile</h3>
            <div className="settings-content__body__section__content">
              <div className="settings-content__body__section__content__item">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" />
              </div>
              <div className="settings-content__body__section__content__item">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" />
              </div>
              <div className="settings-content__body__section__content__item">
                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone" />
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Settings;
























































