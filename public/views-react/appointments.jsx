import React from "react";
import { createRoot } from "react-dom/client";
import AppointmentForm from "./components/appointments-form";

const initAppointments = () => {
  const appointmentsDiv = document.getElementById("bp-appointments-form");

  if (appointmentsDiv) {
    const root = createRoot(appointmentsDiv);
    root.render(<AppointmentForm />);
  } else {
    console.error("Appointments root element not found.");
  }
};
document.addEventListener("DOMContentLoaded", initAppointments);
