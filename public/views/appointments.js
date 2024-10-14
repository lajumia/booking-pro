/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************************************!*\
  !*** ./public/views-react/appointments.jsx ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const AppointmentForm = () => {
  // State and function to submit appointment start
  const [appointmentFormData, setAppointmentFormData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    service: "",
    staff: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setAppointmentFormData({
      ...appointmentFormData,
      [name]: value
    });
  };
  const handleAppointmentSubmit = async e => {
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
    try {
      const response = await fetch(`${appointmentForm.api_base_url}submit-appointment`, {
        method: "POST",
        headers: {
          "X-WP-Nonce": appointmentForm.nonce
        },
        body: formDataObj
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        // redirect to a thank you page
        window.location.href = appointmentForm.thank_you_page;
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // State and function to submit appointment end

  // State to keep track of the current step
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [currentStep, setCurrentStep] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [staff, setStaff] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [service, setService] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [timeSlot, setTimeSlot] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);

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
    setCurrentStep(prev => prev + 1);
  };
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Progress bar step labels
  const steps = ["Service", "Staff", "Time & Date", "Booking Info", "Payment"];
  // Handle next and previous buttons end

  // Function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("fieldset", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
            className: "fs-title",
            children: "Choose Service"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "services",
            children: service && service.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("select", {
              onChange: handleChange,
              name: "service",
              className: "select-service",
              value: appointmentFormData.service,
              required: true,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                disabled: true,
                value: "",
                children: "Select Service"
              }), service.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                value: item.id,
                children: item.service_name
              }, index))]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              children: "Service not found. Please add a service from the admin panel."
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "next-btn",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              name: "next",
              className: "next action-button",
              value: "Next",
              onClick: nextStep
            })
          })]
        });
      case 2:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("fieldset", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
            className: "fs-title",
            children: "Choose Staff "
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "services staff",
            children: staff && staff.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("select", {
              onChange: handleChange,
              name: "staff",
              className: "select-service",
              required: true,
              value: appointmentFormData.staff,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                disabled: true,
                value: "",
                children: "Select Staff"
              }), staff.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                value: item.id,
                children: item.name
              }, index))]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              children: "Staff not found. Please add staff from the admin panel."
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "next-btn",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              value: "Previous",
              name: "previous",
              className: "previous action-button",
              onClick: prevStep
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              name: "next",
              className: "next action-button",
              value: "Next",
              onClick: nextStep
            })]
          })]
        });
      case 3:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("fieldset", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
            className: "fs-title",
            children: "Choose Time"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "services staff",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "date",
              onChange: handleChange,
              className: "select-service",
              name: "date",
              id: "",
              value: appointmentFormData.date
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("select", {
              className: "select-service",
              onChange: handleChange,
              name: "time",
              value: appointmentFormData.time,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("option", {
                disabled: true,
                value: "",
                children: ["Select time", " "]
              }), timeSlot && timeSlot.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
                value: item.id,
                children: item.slot_time
              }, index))]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "next-btn",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              value: "Previous",
              name: "previous",
              className: "previous action-button",
              onClick: prevStep
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              name: "next",
              className: "next action-button",
              value: "Next",
              onClick: nextStep
            })]
          })]
        });
      case 4:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("fieldset", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
            className: "fs-title",
            children: "Personal Details"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "services",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "text",
              onChange: handleChange,
              name: "name",
              placeholder: "Full Name",
              required: true,
              value: appointmentFormData.name
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "email",
              onChange: handleChange,
              name: "email",
              placeholder: "Email",
              required: true,
              value: appointmentFormData.email
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "phone",
              onChange: handleChange,
              name: "phone",
              placeholder: "Phone No",
              required: true,
              value: appointmentFormData.phone
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("textarea", {
              name: "notes",
              onChange: handleChange,
              placeholder: "Notes",
              value: appointmentFormData.notes
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "next-btn",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              value: "Previous",
              name: "previous",
              className: "previous action-button",
              onClick: prevStep
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              name: "next",
              className: "next action-button",
              value: "Next",
              onClick: nextStep
            })]
          })]
        });
      case 5:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("fieldset", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
            className: "fs-title",
            children: "Payments"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "services",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
              children: "Pay us locally and contact with our administrator"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "next-btn",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
              type: "button",
              value: "Previous",
              name: "previous",
              className: "previous action-button",
              onClick: prevStep
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
              className: "next action-button",
              type: "submit",
              children: "Submit"
            })]
          })]
        });
    }
  };

  // Get form default data

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(`${appointmentForm.api_base_url}appointments-data`, {
      method: "POST",
      headers: {
        "X-WP-Nonce": appointmentForm.nonce,
        "Content-Type": "application/json"
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.status = "success") {
        setService(data.services);
        setStaff(data.staff);
      } else {
        setService([]);
      }
    }).catch(error => {
      console.log(error);
    });
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Only fetch available time slots when both staff and date are selected
    if (appointmentFormData.staff && appointmentFormData.date) {
      const requestBody = {
        staff_id: appointmentFormData.staff,
        date: appointmentFormData.date
      };
      fetch(`${appointmentForm.api_base_url}available-time-slot`, {
        method: "POST",
        headers: {
          "X-WP-Nonce": appointmentForm.nonce,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }).then(response => response.json()).then(data => {
        if (data.status === "success") {
          // Convert the object to an array
          const slotsArray = Object.values(data.data);
          setTimeSlot(slotsArray); // Now use the filtered available slots
        } else {
          setTimeSlot([]);
        }
      }).catch(error => console.log(error));
    }
  }, [appointmentFormData.staff, appointmentFormData.date]); // Trigger when staff and date change

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("form", {
    id: "msform",
    onSubmit: handleAppointmentSubmit,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("ul", {
      id: "progressbar",
      children: steps.map((step, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("li", {
        className: currentStep > index ? "active" : "",
        children: step
      }, index))
    }), renderStep()]
  });
};
const initAppointments = () => {
  const appointmentsDiv = document.getElementById("bp-appointments-form");
  if (appointmentsDiv) {
    const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(appointmentsDiv);
    root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(AppointmentForm, {}));
  }
};
document.addEventListener("DOMContentLoaded", initAppointments);
/******/ })()
;
//# sourceMappingURL=appointments.js.map