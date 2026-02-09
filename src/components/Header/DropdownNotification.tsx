'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClickOutside from '@/components/ClickOutside';
import { useNotifications } from '@/context/NotificationContext';

type Notification = {
  id: string | number;
  is_read: boolean;
  notification_type: string;
  created_by: string;
  message: string;
  created_at: string;
};

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, loadMore, totalPages, currentPage } =
    useNotifications();

  useEffect(() => {
    // console.log('DropdownNotification: Notifications rendered:', notifications);
  }, [notifications]);

  const handleNotificationClick = (notificationId: string | number) => {
    markAsRead(notificationId);
  };

  const getNotificationColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
          href="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-blue-4 dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 z-1 h-2 w-2 rounded-full bg-meta-1"
            >
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}
          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-meta-4 z-50">
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((notification: Notification) => (
                <li key={notification.id}>
                  <Link
                    href="#"
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 ${notification.is_read ? 'opacity-50' : ''} ${getNotificationColor(notification.notification_type)}`}
                  >
                    <p className="text-sm">
                      <span className="font-medium">
                        {notification.created_by}: {notification.message}
                      </span>
                    </p>
                    <p className="text-xs">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
              {currentPage < totalPages && (
                <li>
                  <button
                    onClick={loadMore}
                    className="w-full px-4.5 py-3 text-sm text-blue-600 hover:bg-gray-2 dark:hover:bg-meta-4"
                  >
                    Load More
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;