import React from "react";

const AppointmentDetailsModal = ({ appointment, onClose }) => {
  if (!appointment) return null; // If no appointment is selected, don't render

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Appointment Details</h2>
        <p>
          <strong>Name:</strong> {appointment.title}
        </p>
        <p>
          <strong>Date:</strong> {appointment.start.toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong>{" "}
          {appointment.start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {appointment.end.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {/* Add any other details you want to show */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
