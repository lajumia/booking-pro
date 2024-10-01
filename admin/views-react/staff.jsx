import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import Header from "./components/Header";

const Staff = () => {
  const pageURL = bookingProStaff.staffPageUrl;

  //State and function fol loading end
  const [loading, setLoading] = useState(true);
  const overrideCss = {
    position: "absolute",
    top: "50%",
    left: "45%",
  };
  //State and function fol loading end

  //State and function for create/edit staff Popup start
  const [isOpen, setIsOpen] = useState(false);
  const [isUpOpen, setIsUpOpen] = useState(false);
  const [upDataId, setUpDataId] = useState();
  const [editStaffData, setEditStaffData] = useState({
    full_name: "",
    email: "",
    phone: "",
    status: "",
  });
  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };
  const openUpdatePopup = (e) => {
    const staffId = e.target.getAttribute("data-id");
    setUpDataId(staffId);
    const staffName = e.target.getAttribute("data-name");
    const staffEmail = e.target.getAttribute("data-email");
    const staffPhone = e.target.getAttribute("data-phone");
    const staffStatus = e.target.getAttribute("data-status");

    setEditStaffData({
      full_name: staffName,
      email: staffEmail,
      phone: staffPhone,
      status: staffStatus,
    });

    setIsUpOpen(true);
  };
  const closeUpdatePopup = () => {
    setIsUpOpen(false);
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
  //State and function for create/edit staff Popup end

  //State and function for create staff start
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    profile_photo: null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_photo: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    closePopup();

    const formDataObj = new FormData();
    formDataObj.append("full_name", formData.full_name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("role", formData.role);
    formDataObj.append("profile_photo", formData.profile_photo);

    try {
      const response = await fetch(
        `${bookingProStaff.api_base_url}create-staff`,
        {
          method: "POST",
          headers: {
            "X-WP-Nonce": bookingProStaff.nonce,
          },
          body: formDataObj,
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setRefreshKey((oldKey) => oldKey + 1);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  //State and function for create staff end

  //State and function to get staff start
  const [staffData, setStaffData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const fetchStaff = () => {
    fetch(
      `${bookingProStaff.api_base_url}get-staff?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "X-WP-Nonce": bookingProStaff.nonce,
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
          setStaffData(data.data);
          setTotalPages(data.total_pages);
          setCurrentPage(data.current_page);
          setLoading(false);
        } else {
          setStaffData([]);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  useEffect(() => {
    fetchStaff();
  }, [refreshKey, currentPage, searchQuery]);
  //State and function to get staff end

  //State and function for delete staff start
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${bookingProStaff.api_base_url}delete-staff/${id}`,
          {
            method: "DELETE",
            headers: {
              "X-WP-Nonce": bookingProStaff.nonce,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          toast.success(result.message);
          setRefreshKey((oldKey) => oldKey - 1);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };
  //State and function for delete staff end

  //State and function for update staff start
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setEditStaffData({ ...editStaffData, status: value });
  };
  const handleUpChange = (e) => {
    const { name, value } = e.target;
    setEditStaffData({ ...editStaffData, [name]: value });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    closeUpdatePopup();

    const upFormDataObj = new FormData();
    upFormDataObj.append("full_name", editStaffData.full_name);
    upFormDataObj.append("email", editStaffData.email);
    upFormDataObj.append("phone", editStaffData.phone);
    upFormDataObj.append("status", editStaffData.status);

    try {
      const response = await fetch(
        `${bookingProStaff.api_base_url}update-staff/${upDataId}`,
        {
          method: "POST",
          headers: {
            "X-WP-Nonce": bookingProStaff.nonce,
          },
          body: upFormDataObj,
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setRefreshKey((oldKey) => oldKey + 1);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  //State and function for update staff end

  return (
    <>
      <div className="bp-staff-container">
        <Header currentPage="staff" url={pageURL} />
        <div className="bp-staff-content">
          <div className="bp-staff-cont-inner">
            <div className="bpsci-top">
              <h2 style={{ fontSize: "23px" }}>Manage Staff</h2>
              <input
                className="staff-search"
                value={searchQuery}
                onChange={handleSearch}
                type="text"
                placeholder="Search staff..."
              />
              <input
                className="add-staff"
                onClick={openPopup}
                type="button"
                value="Add New Staff"
              />
            </div>

            <div className="bpsci-second">
              {/* Table for display staff */}
              <table className="bp-staff-table">
                <thead className="bps-table-head">
                  <tr>
                    <th>ID</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {loading ? (
                  <HashLoader color="#687de8" cssOverride={overrideCss} />
                ) : (
                  <tbody>
                    {staffData.map((staff, index) => (
                      <tr key={staff.id} className="bps-table-item">
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={staff.profile}
                            alt=""
                            style={{ width: "30px", borderRadius: "20px" }}
                          />
                        </td>
                        <td>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>{staff.phone}</td>
                        <td>{staff.role}</td>
                        <td>
                          <span
                            className={
                              staff.status === "active"
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {staff.status}
                          </span>
                        </td>
                        <td>
                          <span
                            data-id={staff.id}
                            data-name={staff.name}
                            data-email={staff.email}
                            data-phone={staff.phone}
                            data-role={staff.role}
                            data-status={staff.status}
                            className="dashicons dashicons-edit"
                            onClick={openUpdatePopup}
                          ></span>
                          <span
                            data-staff={staff.id}
                            className="dashicons dashicons-trash"
                            onClick={() => handleDelete(staff.id)}
                          ></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            {/* Pagination Controls Start show pagination if customers more than 10*/}
            {totalPages > 1 && (
              <div className="staff-pagination">
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

        {/* Popup to display create customers */}
        <div className="add-staff-popup">
          {isOpen && (
            <div style={popupStyles.overlay}>
              <div style={popupStyles.popup}>
                <h2 className="staff-heading">Add New Staff</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="staff-form-inner">
                    <div className="staff-first">
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="full_name"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="staff-second">
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="phone"
                        placeholder="Mobile No"
                      />
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="role"
                        placeholder="Designation"
                      />
                    </div>

                    <input
                      placeholder="Uplaod Image"
                      required
                      onChange={handleFileChange}
                      className="up-profle"
                      type="file"
                      name="profile_photo"
                    />
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

        {/* Popup to display update customers */}
        <div className="add-staff-popup">
          {isUpOpen && (
            <div style={popupStyles.overlay}>
              <div style={popupStyles.popup}>
                <h2 className="staff-heading">Update Staff</h2>
                <form onSubmit={handleUpdate}>
                  <div className="staff-form-inner">
                    <div className="staff-first">
                      <input
                        type="text"
                        required
                        value={editStaffData.full_name}
                        onChange={handleUpChange}
                        name="full_name"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        required
                        value={editStaffData.email}
                        onChange={handleUpChange}
                        name="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="staff-second">
                      <input
                        type="text"
                        required
                        value={editStaffData.phone}
                        onChange={handleUpChange}
                        name="phone"
                        placeholder="Mobile No"
                      />
                      <select
                        name="status"
                        //value={editStaffData.status}
                        style={{ width: "45%", borderRadius: "20px" }}
                        onChange={handleStatusChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <button className="staff-sub" type="submit">
                    Save
                  </button>
                  <button
                    className="staff-can"
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

const initStaff = () => {
  const staffDiv = document.getElementById("bp-staff-root");

  if (staffDiv) {
    const root = createRoot(staffDiv);
    root.render(<Staff />);
  } else {
    console.error("Staff root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initStaff);
