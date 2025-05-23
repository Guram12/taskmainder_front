import "../styles/Notification.css";
import React from "react";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import { NotificationData } from "../utils/interface";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { ThemeSpecs } from "../utils/theme";
import SkeletonNotification from "./Boards/SkeletonNotification";

interface NotificationProps {
  currentTheme: ThemeSpecs;
}

const Notification: React.FC<NotificationProps> = ({ currentTheme }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isNotificationLoaded, setIsNotificationLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsNotificationLoaded(true); // Start loading
      try {
        const response = await axiosInstance.get("api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setNotifications(response.data);

        // Mark all unread notifications as read
        const unreadNotifications = response.data.filter(
          (notification: NotificationData) => !notification.is_read
        );

        if (unreadNotifications.length > 0) {
          await markAllAsRead(unreadNotifications.map((n: any) => n.id));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        // Ensure loading state is set to false after fetching is complete
        setIsNotificationLoaded(false);
      }
    };

    fetchNotifications();
  }, []);

  // ========================================= mark all as read function ==========================================

  const markAllAsRead = async (ids: number[]) => {
    try {
      await axiosInstance.patch(
        "api/notifications/mark-all-as-read/",
        { ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          ids.includes(notification.id)
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // ========================================= delete notification function ==========================================

  const handleDeleteNotification = async (id: number) => {
    try {
      await axiosInstance.delete(`api/notifications/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };


  const handleDeleteAllNotifications = async () => {
    try {
      // Send API request to delete all notifications
      await axiosInstance.delete("api/notifications/delete-all/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
  
      // Update local state to clear all notifications
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  return (
    <div className="main_notification_container">
      <div className="delete_all_buttion_container">
        <button className="delete_all_notification" onClick={handleDeleteAllNotifications}>Delete All</button>
      </div>
      {isNotificationLoaded ? (
        <div  className="imported_all_skeletons_cont">
          <SkeletonNotification currentTheme={currentTheme} />
          <SkeletonNotification currentTheme={currentTheme} />
          <SkeletonNotification currentTheme={currentTheme} />
          <SkeletonNotification currentTheme={currentTheme} />

          
        </div>
      ) : (
        <>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification_card"
              style={{
                borderColor: currentTheme["--border-color"],
                fontSize: notification.is_read ? "0.9rem" : "1rem",
                backgroundColor: currentTheme["--list-background-color"],
              }}
            >
              <RiDeleteBin4Fill
                className="delete_notif_icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notification.id);
                }}
              />
              <h3 className="notification_title">{notification.title}</h3>
              <p className="notification_body_text">{notification.body}</p>
              <p className="notification_date">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Notification;