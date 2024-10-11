import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import Header from "./components/Header";
import noDataImg from "../assets/images/no-data.png";

const Appointments = () => {
  const pageURL = bookingProAppointment.appointmentPageUrl;
  

  const [loading,setLoading] = useState();
  const [isUpOpen, setIsUpOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState();
  const [deleteId,setDeleteId]= useState();
  const [refreshKey, setRefreshKey] = useState(0);
  const overrideCss = {
    position: "absolute",
    top: "50%",
    left: "45%",
  };
  const popupStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    popup: {
      backgroundColor: "white",
      padding: "20px 20px",
      borderRadius: "15px",
      maxWidth: "400px",
      width: "100%",
    },
  };
  const openPopup = (e)=>{
    setAppointmentId(e.target.dataset.id);
    setIsUpOpen(true);
  }
  const closePopup = ()=>{
    setIsUpOpen(false);
  }

  // Delete appointment start
    const handleDeleteAppointment = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
      if (confirmDelete) {
        try {
          const response = await fetch(
            `${bookingProAppointment.api_base_url}delete-appointment?id=${id}`, // Adjust the API URL accordingly
            {
              method: "POST",
              headers: {
                "X-WP-Nonce": bookingProAppointment.nonce, // Adjust for appointments if needed
              },
            }
          );
          const result = await response.json();
          if (response.ok) {
            toast.success(result.message);
            setRefreshKey((oldKey) => oldKey + 1); // Refresh data after successful delete
            setCurrentPage(1);
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
  // Delete appointment end

  // State and function for appointments start
    const [services,setServices]=useState([]);
    const [staffs,setStaffs] = useState([]);
    const [timeSlots,setTimeSlots] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [itemsPerPage,setItemsPerPage] = useState(10);
    const [searchQuery,setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [expandedRow, setExpandedRow] = useState(null);
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    };
    const [formData,setFormData] = useState({
      app_status:'scheduled',
    })

    const handleStatusChange = (e) => {

      const { value } = e.target;
      setFormData({ ...formData, app_status: value });
    };
  // State and function for appointments end

  // Function to toggle expanded row start
    const toggleRow = (index) => {
      setExpandedRow(expandedRow === index ? null : index); // Toggle the row's expansion
    };
  // Function to toggle expanded row end

  // Fetch appointment status start
    const changeStatus = (e) => {
      
      e.preventDefault();
      closePopup(false);
      const formDataObj = new FormData();
      formDataObj.append("appointment_status", formData.app_status);  // Use the updated state value
      formDataObj.append("appointment_id", appointmentId);

      fetch(
        `${bookingProAppointment.api_base_url}update-appointment-status`,
        {
          method: "POST",
          headers: {
            "X-WP-Nonce": bookingProAppointment.nonce,
            
            
          },
          body: formDataObj,
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status == "success") {
            toast.success(data.message);
            fetchAppointments();
            closePopup();
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  // Fetch appointment status end

  // Fetch time slot start
   const fetchTimeSlot = () => {
      fetch(
        `${bookingProAppointment.api_base_url}get-appointment-time-slot`,
        {
          method: "GET",
          headers: {
            "X-WP-Nonce": bookingProAppointment.nonce,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status == "success") {
            setTimeSlots(data.data)
            console.log(data.data);
          } else {
            setTimeSlots([]);

          }
        })
        .catch((error) => {
          toast.error(error);
        });
    };
  // Fetch time slot end

  // Fetch services data start
    const getServiceData = () => {
      fetch(
        `${bookingProAppointment.api_base_url}get-services`,
        {
          method: "GET",
          headers: {
            "X-WP-Nonce": bookingProAppointment.nonce,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status == "success") {
            setServices(data.data);
            console.log(data.data);

          } else {
            setServices([]);
          }
        })
        .catch((error) => {
          toast.error(error);

        });
    };
  // Fetch services data end

  // Fetch staff data start
    const fetchStaffs = () => {
      fetch(
        `${bookingProAppointment.api_base_url}get-staff`,
        {
          method: "GET",
          headers: {
            "X-WP-Nonce": bookingProAppointment.nonce,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status == "success") {
            setStaffs(data.data);
            console.log(data.data);

          } else {
            setStaffs([]);
          }

        })
        .catch((error) => {
          toast.error(error);
        });
    };
    useEffect(() => {
      getServiceData();
      fetchStaffs();
      fetchTimeSlot();
    }, []);

  // Fetch staff data end

  // Fetch appointments data start
    const fetchAppointments = () => {
      setLoading(true);
      fetch(`${bookingProAppointment.api_base_url}get-appointments?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`, {
        method: "GET",
        headers: {
          "X-WP-Nonce": bookingProAppointment.nonce,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.status == "success"){
            setAppointments(data.data);
            setTotalPages(data.total_pages);
            setCurrentPage(data.current_page);
            setLoading(false);

          }else{
            setAppointments([]);

          }
          setLoading(false);

        }).catch((error)=>{
          toast.error(error);
        });
    };
    useEffect(() => {
      fetchAppointments();
    }, [refreshKey,currentPage, searchQuery])
  // Fetch appointments data start

  return (
    <>
      <div className="bp-appointments-container">
        <Header currentPage="appointments" url={pageURL} />
        <div className="bp-app-content">
          <div className="bp-app-cont-inner">
            <div className="bp-app-ci-top">
              <h2 style={{ fontSize: "23px" }}>Manage Appointments</h2>
              <input
                className="staff-search"
                value={searchQuery}
                onChange={handleSearch}
                type="text"
                placeholder="Search for customers, email..."
              />
              <input className="add-staff" style={{visibility:"hidden"}} type="button" value="Add New Appointment"/>
              

            </div>
            <div className="bpsci-second">
              {/* Table for display staff */}
              <table className="bp-staff-table">
                <thead className="bps-table-head">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Staff</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                    
                  </tr>
                </thead>
                {loading ? (
                  <HashLoader color="#687de8" cssOverride={overrideCss} />
                ) : (
                  <tbody>
                  {appointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <tr
                        className="bps-table-item"
                        
                      >
                        <td>{index + 1}</td>
                        <td>{appointment.full_name}</td>
                        <td>{services.find(service => service.id === appointment.service_id)?.service_name || 'Service not found'}</td>
                        <td>{staffs.find(staff => staff.id === appointment.staff_id)?.name || 'Staff not found'}</td>
                        <td>
                          <span
                            className={
                              appointment.status === 'scheduled'
                                ? 'status-inactive'
                                : appointment.status === 'cancelled'
                                ? 'status-cancelled'
                                : 'status-active'
                            }
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.created_at}</td>
                        <td>
                          <span
                          onClick={() => toggleRow(index)} // Toggle row when clicked
                          style={{ cursor: 'pointer' }}
                           className="dashicons dashicons-visibility"
                           ></span>
                          <span onClick={openPopup} data-id={appointment.id} className="dashicons dashicons-edit"></span>
                          <span className="dashicons dashicons-trash" onClick={() => handleDeleteAppointment(appointment.id)}></span>
                        </td>
                        
                      </tr>

                      {/* Expandable section for each appointment */}
                      {expandedRow === index && (
                        <tr className="bps-table-expanded">
                          <td colSpan="7">
                            <div className="expanded-content">
                              <div className="expanded-left-content">
                                <h2>Appointment Details</h2>
                                <p className="bp-details-title"><strong> ID :</strong> <span className="bpd-content-2">#{appointment.id}</span></p>
                                <p className="bp-details-title"><strong> Date (Y-M-D) :</strong> <span className="bpd-content-2">{appointment.appointment_date}</span></p>
                                <p className="bp-details-title"><strong> Time :</strong> <span className="bpd-content-2">{timeSlots.find(timeSlot => timeSlot.id === appointment.appointment_time)?.slot_time || 'Time not found'}</span></p>
                                <p className="bp-details-title"><strong>Service :</strong> <span className="bpd-content">{services.find(service => service.id === appointment.service_id)?.service_name || 'Service not found'}</span></p>
                                <p className="bp-details-title"><strong>Staff :</strong> <span className="bpd-content">{staffs.find(staff => staff.id === appointment.staff_id)?.name || 'Staff not found'}</span></p>
                                <p className="bp-details-title"><strong>Notes :</strong> <span className="bpd-content">{appointment.notes}</span></p>
                              </div>

                              <div className="expanded-right-content">
                                <h2>Customer Details</h2>
                                <p className="bp-details-title"><strong>Name:</strong> <span className="bpd-content">{appointment.full_name}</span></p>
                                <p className="bp-details-title"><strong> Email:</strong> <span className="bpd-content">{appointment.email}</span></p>
                                <p className="bp-details-title"><strong>Phone:</strong> <span className="bpd-content">{appointment.phone}</span></p>

                              </div>

                              <div className="expanded-right-middle">
                                <h2>Payment Status</h2>
                                <p className="bp-details-title"><strong>Payment Method :</strong> <span className="bpd-content">Manual</span></p>
                                <p className="bp-details-title"><strong>Status :</strong> <span className={appointment.status === 'scheduled'
                                  ? 'status-inactive bpd-content'
                                  : appointment.status === 'cancelled'
                                  ? 'status-cancelled bpd-content'
                                  : 'status-active bpd-content'
                                  }>{appointment.status}</span>
                                </p>
                                <p className="bp-details-title"><strong>Total Amount :</strong> <span className="bpd-content">${services.find(service => service.id === appointment.service_id)?.price || 'Service not found'}</span></p>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                )}
              </table>
              {appointments.length === 0 && !loading && (
                <div className="bp-ser-no-data">
                  <img src={noDataImg} alt="No Data" />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <p className="no-data">No Appointments found</p>
                    <input
                      className="add-staff"
                      //onClick={openPopup}
                      type="button"
                      value="Add New Appointment"
                    />
                  </div>
                </div>
              )}

              {/* Pagination Controls Start show pagination if customers more than 10*/}
              {totalPages > 1 && (
                <div className="staff-pagination" style={{marginTop:"20px"}}>
                  <button
                    className={
                      currentPage === 1 ? "pagi-deactive" : "pagi-active"
                    }
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagi-page">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    className={
                      currentPage === totalPages ? "pagi-deactive" : "pagi-active"
                    }
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            
          </div>
        </div>
                  
        {/* Popup to display update customers */}
        <div className="add-staff-popup">
          {isUpOpen && (
            <div style={popupStyles.overlay}>
              <div style={popupStyles.popup}>
                <h2 className="staff-heading">Update Staff</h2>
                <form onSubmit={changeStatus}>
                  <div className="staff-form-inner">
                    
                    <div className="staff-second">
                      
                      <select
                        name="status"
                        // value={formData.status}
                        style={{ width: "100%", borderRadius: "20px" }}
                        onClick={handleStatusChange}
                      >
                        
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <button className="staff-sub" type="submit">
                    Save
                  </button>
                  <button
                    className="staff-can"
                    type="button"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* ToastContainer to display the toast messages */}
        <ToastContainer />

      </div>
    </>
  );
};

const initAppointments = () => {
  const appointmentsDiv = document.getElementById("bp-appointments-root");

  if (appointmentsDiv) {
    const root = createRoot(appointmentsDiv);
    root.render(<Appointments />);
  } else {
    console.error("Appointments root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initAppointments);
