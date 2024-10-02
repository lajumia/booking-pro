import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import Header from "./components/Header";
import noDataImg from "../assets/images/no-data.png";

const Services = () => {
  const pageURL = bookingProService.servicePageUrl;
  //State and function fol loading end
  const [loading, setLoading] = useState(true);
  const overrideCss = {
    position: "absolute",
    top: "50%",
    left: "45%",
  };
  //State and function fol loading end

  //State and function for create/edit service Popup start
  const [isOpen, setIsOpen] = useState(false);
  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
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
      maxWidth: "500px",
      width: "100%",
    },
  };
  //State and function for create/edit services Popup start

  //State and function for  create service start
  const [createFormData, setCreateFormData] = useState({
    name: "",
    duration: "",
    price: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    closePopup();

    const formDataobj = new FormData();
    formDataobj.append("service_name", createFormData.name);
    formDataobj.append("service_duration", createFormData.duration);
    formDataobj.append("service_price", createFormData.price);
    formDataobj.append("service_description", createFormData.description);

    try {
      const response = await fetch(
        `${bookingProService.api_base_url}create-service`,
        {
          method: "POST",
          headers: {
            "X-WP-Nonce": bookingProService.nonce,
          },
          body: formDataobj,
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setRefreshKey((prevKey) => prevKey + 1);
        closePopup();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  //State and function for  create service end

  //State and function to get services start
  const [serviceData, setServiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const itemsPerPage = 10;
  const [refreshKey, setRefreshKey] = useState(0);
  const getServiceData = () => {
    fetch(
      `${bookingProService.api_base_url}get-services?page=${currentPage}&limit=${itemsPerPage}`,
      {
        method: "GET",
        headers: {
          "X-WP-Nonce": bookingProService.nonce,
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
          setServiceData(data.data);
          setTotalPages(data.total_pages);
          setCurrentPage(data.currentPage);
          setLoading(false);
        } else {
          setServiceData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    getServiceData();
  }, [refreshKey, currentPage]);
  //State and function to get services end

  //State and function to delete service start
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${bookingProService.api_base_url}delete-service/${id}`,
          {
            method: "DELETE",
            headers: {
              "X-WP-Nonce": bookingProService.nonce,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          toast.success(result.message);
          setRefreshKey((prevKey) => prevKey + 1);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };
  //State and function to delete service end

  //State and function to update service start
  const [isUpOpen, setIsUpOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    name: "",
    duration: "",
    price: "",
    description: "",
    status: "",
  });
  const handleUpChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };
  const closeUpdatePopup = () => {
    setIsUpOpen(false);
  };
  const openUpdatePopup = (e) => {
    const { id, name, duration, price, description, status } = e.target.dataset;
    setUpdateFormData({
      id,
      name,
      duration,
      price,
      description,
      status,
    });
    setIsUpOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpOpen(false);

    const fonmUpData = new FormData();
    fonmUpData.append("service_id", updateFormData.id);
    fonmUpData.append("service_name", updateFormData.name);
    fonmUpData.append("service_duration", updateFormData.duration);
    fonmUpData.append("service_price", updateFormData.price);
    fonmUpData.append("service_description", updateFormData.description);
    fonmUpData.append("service_status", updateFormData.status);

    try {
      const response = await fetch(
        `${bookingProService.api_base_url}update-service`,
        {
          method: "POST",
          headers: {
            "X-WP-Nonce": bookingProService.nonce,
          },
          body: fonmUpData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setRefreshKey((prevKey) => prevKey + 1);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  //State and function to update service end

  return (
    <>
      <div className="bp-service-container">
        <Header currentPage="services" url={pageURL} />
        <div className="bp-ser-content">
          <div className="bp-ser-cont-inner">
            <div className="bp-ser-ci-top">
              <h2 style={{ fontSize: "23px" }}>Manage Services</h2>
              <input
                className="add-service"
                onClick={openPopup}
                type="button"
                value="Add New Service"
              />
            </div>

            <div className="bp-ser-ci-second">
              {/* Table for display service */}
              <table className="bp-ser-table">
                <thead className="bp-ser-table-head">
                  <tr>
                    <th>ID</th>
                    <th>Service Name</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {loading ? (
                  <HashLoader color="#687de8" cssOverride={overrideCss} />
                ) : (
                  <tbody>
                    {serviceData.map((service, index) => (
                      <tr key={service.id} className="bp-ser-table-item">
                        <td>{index + 1}</td>
                        <td>{service.service_name}</td>
                        <td>{service.duration} min</td>
                        <td>${service.price}</td>
                        <td>
                          <span
                            className={
                              service.status === "active"
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {service.status}
                          </span>
                        </td>
                        <td>
                          <span
                            data-id={service.id}
                            data-name={service.service_name}
                            data-duration={service.duration}
                            data-price={service.price}
                            data-description={service.description}
                            data-status={service.status}
                            className="dashicons dashicons-edit"
                            onClick={openUpdatePopup}
                          ></span>
                          <span
                            data-id={service.id}
                            className="dashicons dashicons-trash"
                            onClick={() => handleDelete(service.id)}
                          ></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
              {serviceData.length === 0 && !loading && (
                <div className="bp-ser-no-data">
                  <img src={noDataImg} alt="No Data" />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <p className="no-data">No services found</p>
                    <input
                      className="add-service"
                      onClick={openPopup}
                      type="button"
                      value="Add New Service"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls Start show pagination if services more than 10*/}
            {totalPages > 1 && (
              <div className="service-pagination">
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

        {/* Add service popup */}
        <div className="add-service-popup">
          {isOpen && (
            <div style={popupStyles.overlay}>
              <div style={popupStyles.popup}>
                <h2 className="service-heading">Add New Service</h2>
                <form onSubmit={handleSubmit}>
                  <div className="service-form-inner">
                    <div className="service-first">
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="name"
                        placeholder="Service Name"
                      />
                      <input
                        type="number"
                        required
                        onChange={handleChange}
                        name="duration"
                        placeholder="Duration in minutes"
                      />
                      <input
                        type="number"
                        required
                        onChange={handleChange}
                        name="price"
                        placeholder="Price"
                      />
                    </div>
                    <div className="service-second">
                      <textarea
                        required
                        onChange={handleChange}
                        name="description"
                        placeholder="Description"
                        rows="4"
                        cols="50"
                      ></textarea>
                    </div>
                  </div>

                  <button className="service-sub" type="submit">
                    Save
                  </button>
                  <button
                    className="service-can"
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

        {/* Add service update popup */}
        <div className="add-service-popup">
          {isUpOpen && (
            <div style={popupStyles.overlay}>
              <div style={popupStyles.popup}>
                <h2 className="service-heading">Update Service</h2>
                <form onSubmit={handleUpdate}>
                  <div className="service-form-inner">
                    <div className="service-up-first">
                      <input
                        type="text"
                        required
                        value={updateFormData.name}
                        onChange={handleUpChange}
                        name="name"
                        placeholder="Service Name"
                      />
                      <input
                        type="number"
                        required
                        value={updateFormData.duration}
                        onChange={handleUpChange}
                        name="duration"
                        placeholder="Duration in minutes"
                      />
                    </div>
                    <div className="service-up-second">
                      <input
                        type="number"
                        required
                        value={updateFormData.price}
                        onChange={handleUpChange}
                        name="price"
                        placeholder="Price"
                      />
                      <select name="status" onChange={handleUpChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="service-up-third">
                      <textarea
                        required
                        value={updateFormData.description}
                        onChange={handleUpChange}
                        name="description"
                        placeholder="Description"
                        rows="4"
                        cols="50"
                      ></textarea>
                    </div>
                  </div>

                  <button className="service-sub" type="submit">
                    Save
                  </button>
                  <button
                    className="service-can"
                    type="button"
                    onClick={closeUpdatePopup}
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

const initServices = () => {
  const servicesDiv = document.getElementById("bp-services-root");

  if (servicesDiv) {
    const root = createRoot(servicesDiv);
    root.render(<Services />);
  } else {
    console.error("Services root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initServices);
