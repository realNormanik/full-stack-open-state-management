import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) return null;

  return (
    <div className="toast" role="status" data-testid="notification">
      {notification}
    </div>
  );
};

export default Notification;
