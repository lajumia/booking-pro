import React from "react";
import { createRoot } from "react-dom/client";
import AppointmentForm from "./components/appointments-form";

const initAppointments = () => {
  const appointmentsDiv = document.getElementById("bp-appointments-form");

  if (appointmentsDiv) {
    const root = createRoot(appointmentsDiv);
    root.render(<AppointmentForm />);
  }
};
document.addEventListener("DOMContentLoaded", initAppointments);
