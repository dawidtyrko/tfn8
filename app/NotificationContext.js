'use client'
import {createContext, useContext, useEffect, useState} from "react";

const NotificationContext = createContext(null);
export const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);


    const addNotifications = (message) => {
        setNotifications((prev) => [...prev, { id: Date.now(), message }]);
        console.log(notifications);
    };
    const removeNotification = () => {
        //setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        setNotifications([])
    }
    useEffect(() => {
        console.log(notifications)
    },[notifications])
    return(
        <NotificationContext.Provider
        value={{
            addNotifications,
            notifications,
            removeNotification,
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotificationsContext = () => useContext(NotificationContext);