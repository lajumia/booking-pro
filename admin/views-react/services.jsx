import React from "react";
import { createRoot } from "react-dom/client";

const Services = () => {
    return (
        <div>
            <h1>Welcome to Services</h1>
            
        </div>
    );
};

const initServices = () => {
    const servicesDiv = document.getElementById('bp-services-root');

    if (servicesDiv) {
        const root = createRoot(servicesDiv);
        root.render(<Services />);
    } else {
        console.error('Services root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initServices);