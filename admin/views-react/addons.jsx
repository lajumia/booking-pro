import React from "react";
import { createRoot } from "react-dom/client";

const Addons = () => {
    return (
        <div>
            <h1>Welcome to Simple React Addons</h1>
            
        </div>
    );
}; 

const initAddons = () => {
    const addonsDiv = document.getElementById('bp-addons-root');

    if (addonsDiv) {
        const root = createRoot(addonsDiv);
        root.render(<Addons />);
    } else {
        console.error('Addons root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initAddons);