"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  useEffect(() => {
    // const handleInteraction = () => {
    //   setIsUserInteracted(true);
    //   window.removeEventListener("click", handleInteraction);
    //   window.removeEventListener("keydown", handleInteraction);
    // };

    // window.addEventListener("click", handleInteraction);
    // window.addEventListener("keydown", handleInteraction);
    // return () => {
    //   window.removeEventListener("click", handleInteraction);
    //   window.removeEventListener("keydown", handleInteraction);
    // };
  }, []);

  useEffect(() => {
    // const fetchNotifications = async () => {
    //   const token = localStorage.getItem("crm_token");
    //   try {
    //     if (!token) return;
    //     const response = await api.get(`/notifications/?page=${page}`);
    //     setNotifications(response.data.notifications);
    //     setTotalPages(response.data.pages);
    //     setUnreadCount(
    //       response.data.notifications.filter((n) => !n.is_read).length,
    //     );
    //   } catch (error) {
    //     console.error("Error fetching notifications:", error);
    //   }
    // };
    // fetchNotifications();
    // const token = localStorage.getItem("crm_token");
    // const ws = new WebSocket(
    //   `ws://${process.env.NEXT_PUBLIC_WS_HOST}/ws/notifications/?token=${encodeURIComponent(token)}`,
    // );

    // ws.onopen = () => {
    //   console.log("WebSocket connected");
    // };

    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === "notification") {
    //     setNotifications((prev) => [data.data, ...prev]);
    //     setUnreadCount((prev) => prev + 1);

    //     // Play notification sound if user has interacted with the page
    //     if (isUserInteracted) {
    //       try {
    //         const audio = new Audio("/audio/notification.mp3");
    //         audio.play().catch((error) => {
    //           console.error("Error playing notification sound:", error);
    //         });
    //       } catch (error) {
    //         console.error("Error initializing audio:", error);
    //       }
    //     }
    //   }
    // };
    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };

    // ws.onclose = () => {
    //   console.log("WebSocket disconnected");
    // };
    // return () => ws.close();
  }, [page, isUserInteracted]);
  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark-read/`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const createNotification = async (
    message,
    notificationType,
    targetUserId,
  ) => {
    try {
      const response = await api.post("/notifications/create/", {
        message,
        notification_type: notificationType,
        target_user_id: targetUserId,
      });
      const currentUserId = localStorage.getItem("user_id");
      if (response.data.user === currentUserId) {
        setNotifications((prev) => [response.data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        createNotification,
        loadMore,
        totalPages,
        currentPage: page,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => useContext(NotificationContext);
