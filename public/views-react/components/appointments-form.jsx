import { toast } from 'react-toastify';
import React, { useEffect, useState } from "react";

const AppointmentForm = () => {

  // State and function to submit appointment start
    const [appointmentFormData,setAppointmentFormData] = useState({
      service:"",  
      staff: "",
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    })

    const handleChange = (e) => {
      const {name, value} = e.target; 
      setAppointmentFormData({
        ...appointmentFormData,
        [name]:value,
      });
    };
    
    const handleAppointmentSubmit = async (e)=> {
      e.preventDefault();

      const formDataObj = new FormData();
      formDataObj.append("service_id", appointmentFormData.service);
      formDataObj.append("staff_id", appointmentFormData.staff);
      formDataObj.append("appointment_date", appointmentFormData.date);
      formDataObj.append("appointment_time", appointmentFormData.time);
      formDataObj.append("customer_name", appointmentFormData.name);
      formDataObj.append("customer_email", appointmentFormData.email);
      formDataObj.append("customer_phone", appointmentFormData.phone);
      formDataObj.append("customer_notes", appointmentFormData.notes);

      try{
        const response = await fetch(
          `${appointmentForm.api_base_url}submit-appointment`,
          {
            method: "POST",
            headers: {
              "X-WP-Nonce": appointmentForm.nonce,
            },
            body: formDataObj,
          }
        );;
        const result = await response.json();
        if(response.ok){
          console.log(result.message);
          // redirect to a thank you page
          window.location.href = appointmentForm.thank_you_page;
        }else{
          console.log(result.message);
        }
      }catch(error){
        console.log(error);
      }

    }
      
  // State and function to submit appointment end

  // State to keep track of the current step
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [staff, setStaff] = useState([]);
  const [service, setService] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);

  // Handle next and previous buttons star
      const nextStep = () => {
        if (currentStep === 1 && !appointmentFormData.service) {
          // If no service is selected, prevent moving to the next step
          alert("Please select a service to proceed.");
          return;
        }
        
        if (currentStep === 2 && !appointmentFormData.staff) {
          // If no staff is selected, prevent moving to the next step
          alert("Please select a staff member to proceed.");
          return;
        }
        
        if (currentStep === 3 && (!appointmentFormData.date || !appointmentFormData.time)) {
          // If no date or time is selected, prevent moving to the next step
          alert("Please select a date and time to proceed.");
          return;
        }
      
        if (currentStep === 4 && (!appointmentFormData.name || !appointmentFormData.email || !appointmentFormData.phone)) {
          // If personal details are incomplete, prevent moving to the next step
          alert("Please fill out your name, email, and phone number to proceed.");
          return;
        }
      
        // Proceed to the next step if validation passes
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

            {service && service.length > 0 ? (
              <select onChange={handleChange} name="service" className="select-service" value={appointmentFormData.service} required>
                <option disabled value="">Select Service</option>
                {service.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.service_name}
                  </option>
                ))}
              </select>
            ) : (
              <span>Service not found. Please add a service from the admin panel.</span>
            )}
              
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
            <h2 className="fs-title">Choose Staff </h2>
            <div className="services staff">
            {staff && staff.length > 0 ? (
              <select onChange={handleChange} name="staff" className="select-service" required value={appointmentFormData.staff}>
                <option disabled value="">Select Staff</option>
                {staff.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : (
              <span>Staff not found. Please add staff from the admin panel.</span>
            )}

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
              <input type="date" onChange={handleChange} className="select-service" name="date" id="" value={appointmentFormData.date} />
              <select className="select-service" onChange={handleChange} name="time" value={appointmentFormData.time}>
                <option disabled value="">Select time </option>
                {timeSlot &&
                  timeSlot.map((item, index) => (
                    <option key={index} value={item.id}>
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
              <input type="text" onChange={handleChange} name="name" placeholder="Full Name" required value={appointmentFormData.name}/>
              <input type="email" onChange={handleChange} name="email" placeholder="Email" required value={appointmentFormData.email}/>
              <input type="phone" onChange={handleChange} name="phone" placeholder="Phone No" required value={appointmentFormData.phone} />
              <textarea name="notes" onChange={handleChange} placeholder="Notes" value={appointmentFormData.notes}></textarea>
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
              <h3>Pay us locally and contact with our administrator</h3>
            </div>
            <div className="next-btn">
              <input
                type="button"
                value="Previous"
                name="previous"
                className="previous action-button"
                onClick={prevStep}
              />
              <button className="next action-button" type="submit">Submit</button>
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
        } else {
          setService([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // Only fetch available time slots when both staff and date are selected
    if (appointmentFormData.staff && appointmentFormData.date) {
      const requestBody = {
        staff_id: appointmentFormData.staff,
        date: appointmentFormData.date,
      };
  
      fetch(`${appointmentForm.api_base_url}available-time-slot`, {
        method: "POST",
        headers: {
          "X-WP-Nonce": appointmentForm.nonce,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {

            // Convert the object to an array
            const slotsArray = Object.values(data.data);
            setTimeSlot(slotsArray); // Now use the filtered available slots
          } else {
            setTimeSlot([]);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [appointmentFormData.staff, appointmentFormData.date]); // Trigger when staff and date change
  

  return (
    <form id="msform" onSubmit={handleAppointmentSubmit}>
      
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
