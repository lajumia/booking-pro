import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import Header from "./components/Header";

import avaLogo from "../assets/images/avatar.png";

const Customers = () => {
  // Page URL
  const pageURL = bookingProNonce.customersPageUrl;
  // State for loading
  const [loading, setLoading] = useState(false);
  const overrideCss = {
    position: "absolute",
    top: "50%",
    left: "45%",
  };

  // State and function for popup
  const [isOpen, setIsOpen] = useState(false);
  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };

  // Simple CSS styles for the pop-up
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

  // State and function to handle add new customer
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
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
    formDataObj.append("first_name", formData.first_name);
    formDataObj.append("last_name", formData.last_name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("profile_photo", formData.profile_photo);

    try {
      const response = await fetch(
        `${bookingProNonce.api_base_url}add-bp-user`,
        {
          method: "POST",
          headers: {
            "X-WP-Nonce": bookingProNonce.nonce, // Pass the nonce for security
          },
          body: formDataObj,
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Show success toast with message from API
        toast.success(result.message);
        // Trigger a refresh by changing the refreshKey
        setRefreshKey((oldKey) => oldKey + 1);
      } else {
        // Show error toast with message from API
        toast.error(result.message);
      }

      // Reset the form fields after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        profile_photo: null,
      });
    } catch (error) {
      toast.error(error);
    }
  };

  // State and function to Get All BP Customer
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage to 1
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch users
  const fetchUsers = () => {
    setLoading(true); // Start loading before fetching
    fetch(
      `${bookingProNonce.api_base_url}bp-users?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`, // Use backticks here
      {
        method: "GET",
        headers: {
          "X-WP-Nonce": bookingProNonce.nonce,
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
        console.log("Users:", data);
        const result = data.data;
        if (result) {
          setCustomers(result);
          setTotalPages(data.total_pages);
          setCurrentPage(data.current_page); // Ensure currentPage is updated
        } else {
          setError("Error fetching users");
        }
        setLoading(false); // Stop loading after fetching
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Error fetching users");
        setLoading(false); // Stop loading if there's an error
      });
  };

  useEffect(() => {
    fetchUsers(); // Call the fetch function on component mount and state changes
  }, [currentPage, refreshKey, searchQuery]); // Add currentPage and refreshKey as dependencies

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Update the current page
    }
  };
  // Function to handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query
    setCurrentPage(1); // Reset to first page when searching
  };

  // State and functon to delete customer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `${bookingProNonce.api_base_url}delete-bp-user/${id}`,
          {
            method: "DELETE",
            headers: {
              "X-WP-Nonce": bookingProNonce.nonce, // Send the nonce for security
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Show success toast
          toast.success(result.message);

          // Remove the deleted user from the state
          setRefreshKey((oldKey) => oldKey - 1);
        } else {
          // Show error toast
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <>
      <div className="bp-cus-container">
        <Header currentPage="customers" url={pageURL} />

        <div className="bp-cus-content">
          <div className="bp-cus-cont-inner">
            <div className="bpdci-top">
              <h2 style={{ fontSize: "23px" }}>Manage Customers</h2>
              <input
                className="cus-search"
                value={searchQuery}
                onChange={handleSearch}
                type="text"
                placeholder="Search customers..."
              />
              <input
                className="add-customer"
                onClick={openPopup}
                type="button"
                value="Add New Customer"
              />
            </div>
            {/* Table for display  customers */}
            <div className="bpdci-third">
              <table>
                <thead className="bpd-table-head">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {loading ? (
                  <HashLoader color="#687de8" cssOverride={overrideCss} />
                ) : (
                  <tbody>
                    {customers.map((user, index) => (
                      <tr key={user.id} className="bpd-table-item">
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={
                              user.profile_photo ? user.profile_photo : avaLogo
                            }
                            alt=""
                            style={{ width: "30px", borderRadius: "20px" }}
                          />
                        </td>
                        <td>{user.name ? user.name : "Not Found"}</td>
                        <td>{user.email ? user.email : "Not Found"}</td>
                        <td>{user.phone ? user.phone : "Not Found"}</td>
                        <td>
                          <span
                            data-user={user.id}
                            className="dashicons dashicons-trash"
                            onClick={() => handleDelete(user.id)} // Trigger the delete function
                          ></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            {/* Pagination Controls Start show pagination if customers more than 10*/}
            {customers.length > itemsPerPage && (
              <div className="customers-pagination">
                <button
                  className={
                    currentPage === 1 ? "pagi-deactive" : "pagi-active"
                  }
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span style={{ fontWeight: "500" }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className={
                    currentPage === totalPages ? "pagi-deactive" : "pagi-active"
                  }
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}

            {/* Pagination Controls Finished */}
          </div>
        </div>
        {/* Popup to display create customers */}
        <div className="add-customer-popup">
          {isOpen && (
            <div style={popupStyles.overlay}>
              <div style={popupStyles.popup}>
                <h2 className="customer-heading">Add New Customer</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="cus-form-inner">
                    <div className="cusf-first">
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="first_name"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        required
                        onChange={handleChange}
                        name="last_name"
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="cusf-second">
                      <input
                        type="email"
                        required
                        onChange={handleChange}
                        name="email"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        required
                        onChange={handleChange}
                        name="phone"
                        placeholder="Phone No"
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

                  <button className="cus-sub" type="submit">
                    Save
                  </button>
                  <button
                    className="cus-can"
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

const initCustomers = () => {
  const customersDiv = document.getElementById("bp-customers-root");

  if (customersDiv) {
    const root = createRoot(customersDiv);
    root.render(<Customers />);
  } else {
    console.error("Customers root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initCustomers);
