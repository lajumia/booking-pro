import React from "react";
import { createRoot } from "react-dom/client";

const Notifications = () => {
    return (
        <div>
            <h1>Notifications</h1>
            
        </div>
    );
};

const initNotifications = () => {
    const notificationsDiv = document.getElementById('bp-notifications-root');

    if (notificationsDiv) { 
        const root = createRoot(notificationsDiv);
        root.render(<Notifications />);
    } else {
        console.error('Notifications root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initNotifications);