import React, { useEffect, useState } from "react";

const AppointmentForm = () => {
  // State to keep track of the current step
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [staff, setStaff] = useState([]);
  const [service, setService] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);

  // Handle next and previous buttons star
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
  // Progress bar step labels
  const steps = ["Service", "Staff", "Time & Date", "Booking Info", "Payment"];

  // Handle next and previous buttons end

  // Function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <fieldset>
            <h2 className="fs-title">Choose Service</h2>
            <div className="services">
              <select name="service" className="select-service">
                {service &&
                  service.map((item, index) => (
                    <option key={index} value={item.service_name}>
                      {item.service_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="next-btn">
              <input
                type="button"
                name="next"
                className="next action-button"
                value="Next"
                onClick={nextStep}
              />
            </div>
          </fieldset>
        );
      case 2:
        return (
          <fieldset>
            <h2 className="fs-title">Choose Staff</h2>
            <div className="services staff">
              <select name="staff" className="select-service">
                {staff &&
                  staff.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="next-btn">
              <input
                type="button"
                value="Previous"
                name="previous"
                className="previous action-button"
                onClick={prevStep}
              />
              <input
                type="button"
                name="next"
                className="next action-button"
                value="Next"
                onClick={nextStep}
              />
            </div>
          </fieldset>
        );
      case 3:
        return (
          <fieldset>
            <h2 className="fs-title">Choose Time</h2>
            <div className="services staff">
              <input type="date" className="select-service" name="" id="" />
              <select className="select-service" name="" id="">
                {timeSlot &&
                  timeSlot.map((item, index) => (
                    <option key={index} value={item.slot_time}>
                      {item.slot_time}
                    </option>
                  ))}
              </select>
            </div>
            <div className="next-btn">
              <input
                type="button"
                value="Previous"
                name="previous"
                className="previous action-button"
                onClick={prevStep}
              />
              <input
                type="button"
                name="next"
                className="next action-button"
                value="Next"
                onClick={nextStep}
              />
            </div>
          </fieldset>
        );
      case 4:
        return (
          <fieldset>
            <h2 class="fs-title">Personal Details</h2>
            <div className="services">
              <input type="text" name="full_name" placeholder="Full Name" />
              <input type="email" name="email" placeholder="Email" />
              <input type="phone" name="phone" placeholder="Phone No" />
              <textarea name="notes" placeholder="Notes"></textarea>
            </div>
            <div className="next-btn">
              <input
                type="button"
                value="Previous"
                name="previous"
                className="previous action-button"
                onClick={prevStep}
              />
              <input
                type="button"
                name="next"
                className="next action-button"
                value="Next"
                onClick={nextStep}
              />
            </div>
          </fieldset>
        );
      case 5:
        return (
          <fieldset>
            <h2 class="fs-title">Payments</h2>
            <div className="services">
              <h1>Payment should be here</h1>
            </div>
            <div className="next-btn">
              <input
                type="button"
                value="Previous"
                name="previous"
                className="previous action-button"
                onClick={prevStep}
              />
              <input
                type="button"
                name="next"
                className="next action-button"
                value="Submit"
                //onClick={nextStep}
              />
            </div>
          </fieldset>
        );
    }
  };

  // Get form default data

  useEffect(() => {
    fetch(`${appointmentForm.api_base_url}appointments-data`, {
      method: "POST",
      headers: {
        "X-WP-Nonce": appointmentForm.nonce,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if ((data.status = "success")) {
          setService(data.services);
          setStaff(data.staff);
          setTimeSlot(data.slots);
        } else {
          setService([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <form id="msform">
      {/* Progress bar */}
      <ul id="progressbar">
        {steps.map((step, index) => (
          <li key={index} className={currentStep > index ? "active" : ""}>
            {step}
          </li>
        ))}
      </ul>

      {/* Render the current step */}
      {renderStep()}
    </form>
  );
};

export default AppointmentForm;
