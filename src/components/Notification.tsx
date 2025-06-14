import "../styles/Notification.css";
import React from "react";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { ThemeSpecs } from "../utils/theme";
import SkeletonNotification from "./Boards/SkeletonNotification";
import no_notification_image from "../assets/no_notification.png";
import { NotificationPayload } from "../utils/interface";
import { FetchedNotificationData } from "../utils/interface";


interface NotificationProps {
  currentTheme: ThemeSpecs;
  setIsLoading: (isLoading: boolean) => void;
}

const Notification: React.FC<NotificationProps> = ({ currentTheme, setIsLoading }) => {
  const [notifications, setNotifications] = useState<FetchedNotificationData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true); // New state to track fetching

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsFetching(true); // Start fetching
      try {
        const response = await axiosInstance.get("api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setNotifications(response.data);

        // Mark all unread notifications as read
        const unreadNotifications = response.data.filter(
          (notification: NotificationPayload) => !notification.is_read
        );

        if (unreadNotifications.length > 0) {
          await markAllAsRead(unreadNotifications.map((n: FetchedNotificationData) => n.id));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsFetching(false);
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

  // ========================================= delete specific notification  ==========================================

  const handleDeleteNotification = async (id: number) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // ========================================= delete all notifications  ==========================================

  const handleDeleteAllNotifications = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================= show delete button  ==========================================
  const showDeleteAllButton = notifications.length > 0;

  return (
    <div className="main_notification_container">
      <div className="delete_all_buttion_container">
        {showDeleteAllButton &&
          <button className="delete_all_notification" onClick={handleDeleteAllNotifications}>
            Delete All
          </button>
        }
      </div>

      {isFetching ? (
        <div className="imported_all_skeletons_cont">
          <SkeletonNotification currentTheme={currentTheme} />
          <SkeletonNotification currentTheme={currentTheme} />
          <SkeletonNotification currentTheme={currentTheme} />
          <SkeletonNotification currentTheme={currentTheme} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="no_notification_container">
          <img src={no_notification_image} alt="No Notifications" className="no_notification_image" />
          <h3 className="no_notification_text">No Notifications</h3>
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
              <p className="notification_date" style={{ color: currentTheme['--due-date-color'] }}>
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