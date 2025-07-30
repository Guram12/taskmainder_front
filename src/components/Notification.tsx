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
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";

interface NotificationProps {
  currentTheme: ThemeSpecs;
  setIsLoading: (isLoading: boolean) => void;
  isMobile: boolean;
}

const Notification: React.FC<NotificationProps> = ({ currentTheme, setIsLoading, isMobile }) => {
  const [notifications, setNotifications] = useState<FetchedNotificationData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true); // New state to track fetching

  // =============================  translate notification title and body  ================================
  const { t } = useTranslation();

  // Function to translate notification titles
  const translateNotificationTitle = (title: string): string => {
    // Convert title to translation key format
    const key = title.toLowerCase().replace(/\s+/g, '_');

    // Check if translation exists, otherwise return original title
    const translated = t(key);
    return translated !== key ? translated : title;
  };
  // Function to extract variables from notification body and translate
  const translateNotificationBody = (body: string, title: string): string => {
    const titleKey = title.toLowerCase().replace(/\s+/g, '_');

    // Define patterns for each notification type
    const patterns = {
      'removed_from_board': /You have been removed from the board '(.+)'\./,
      'board_member_left': /(.+) has left the board '(.+)'\./,
      'task_due_reminder': /Task '(.+)' is due on (.+) with priority (.+)\./,
      'board_invitation_accepted': /(.+) has joined your board "(.+)"\./,
      'left_board': /You have left the board '(.+)'\./
    };

    const pattern = patterns[titleKey as keyof typeof patterns];
    if (!pattern) return body;

    const match = body.match(pattern);
    if (!match) return body;

    // Extract variables based on notification type
    let variables = {};
    switch (titleKey) {
      case 'removed_from_board':
        variables = { boardName: match[1] };
        break;
      case 'board_member_left':
        variables = { userName: match[1], boardName: match[2] };
        break;
      case 'task_due_reminder':
        variables = { taskName: match[1], dueDate: match[2], priority: match[3] };
        break;
      case 'board_invitation_accepted':
        variables = { userName: match[1], boardName: match[2] };
        break;
      case 'left_board':
        variables = { boardName: match[1] };
        break;
    }

    // Try to get translated template
    const translationKey = `${titleKey}_body`;
    const translated = t(translationKey, variables);

    // If translation exists, return it; otherwise return original
    return translated !== translationKey ? translated : body;
  };

  // ==================================================================================================


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
    <>
      <Helmet>
        <title>Notifications | DailyDoer</title>
        <meta name="description" content="View all your notifications, reminders, and updates on DailyDoer. Stay informed about your boards and tasks." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dailydoer.space/mainpage/notification" />
      </Helmet>
      <div className="main_notification_container">
        <div className="delete_all_buttion_container">
          {showDeleteAllButton &&
            <button
              className="delete_all_notification"
              onClick={handleDeleteAllNotifications}
              style={{ backgroundColor: currentTheme['--task-background-color'] }}
            >
              {t('delete_all')}
            </button>
          }
        </div>

        {isFetching ? (
          <div className="imported_all_skeletons_cont">
            <SkeletonNotification currentTheme={currentTheme} isMobile={isMobile} />
            <SkeletonNotification currentTheme={currentTheme} isMobile={isMobile} />
            <SkeletonNotification currentTheme={currentTheme} isMobile={isMobile} />
            <SkeletonNotification currentTheme={currentTheme} isMobile={isMobile} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="no_notification_container">
            <img src={no_notification_image} alt="No Notifications" className="no_notification_image" />
            <h3 className="no_notification_text">{t('no_notifications')}</h3>
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
                <h3 className="notification_title">
                  {translateNotificationTitle(notification.title)}

                </h3>
                <p className="notification_body_text">
                  {translateNotificationBody(notification.body, notification.title)}
                </p>
                <p className="notification_date" style={{ color: currentTheme['--due-date-color'] }}>
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </>

  );
};

export default Notification;