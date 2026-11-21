import { useNotification } from "../notificationStore";

const Notification = () => {
  const notification = useNotification();

  if (!notification) return null;

  return (
    <div className="toast" role="status" aria-live="polite" data-testid="notification">
      {notification}
    </div>
  );
};

export default Notification;
