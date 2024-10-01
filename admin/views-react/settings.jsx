import React from "react";
import { createRoot } from "react-dom/client";

const Settings = () => {
    return (
        <div>
            <h1>Welcome to Simple React Settings</h1>
            
        </div>
    );
};

const initSettings = () => {
    const settingsDiv = document.getElementById('bp-settings-root');

    if (settingsDiv) {
        const root = createRoot(settingsDiv);
        root.render(<Settings />);
    } else {
        console.error('Settings root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initSettings);