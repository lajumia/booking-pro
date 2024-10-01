import React from "react";
import { createRoot } from "react-dom/client";

const Appointments = () => {
    return (
        <div>
            <h1>Welcome to Simple React Appointments</h1>
            
        </div>
    );
};

const initAppointments = () => {
    const appointmentsDiv = document.getElementById('bp-appointments-root');

    if (appointmentsDiv) {
        const root = createRoot(appointmentsDiv);
        root.render(<Appointments />);
    } else {
        console.error('Appointments root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initAppointments);