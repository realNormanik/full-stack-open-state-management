import { createContext, useContext, useReducer, useRef } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return ""
    default:
      return state
  };
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, "");
  const timeoutRef = useRef(null);

  const notify = (message) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: "SET", payload: message });
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => useContext(NotificationContext).notification;

export const useNotify = () => useContext(NotificationContext).notify;
