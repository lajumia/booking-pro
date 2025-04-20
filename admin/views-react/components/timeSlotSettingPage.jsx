import { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";


const TimeSlotSettingPage = () => {
    const [slots, setSlots] = useState([]);
    const [slotId, setSlotId] =useState(null);
    const [newSlot, setNewSlot] = useState('');
    const [refreshKey,setRefreshKey] = useState(0);


    const handleAddSlot = (e) => {
      e.preventDefault();
      
      const formDataObj = new FormData();
      formDataObj.append("slot_time", newSlot);
    
      fetch(`${bookingProSettings.api_base_url}add-time-slot`, {
        method: "POST",
        headers: {
          "X-WP-Nonce": bookingProSettings.nonce,
        },
        body: formDataObj,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            toast.success(data.message);
            setRefreshKey((oldKey) => oldKey + 1);
          } else if (data.status === "failed") {
            toast.error(data.message);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((error) => {
          // Display network-related or unexpected errors
          toast.error(`Error: ${error.message || "An unknown error occurred"}`);
        });
    };
    
    //State and function for delete staff start
      const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
          try {
            const response = await fetch(
              `${bookingProSettings.api_base_url}remove-time-slot/${id}`,
              {
                method: "DELETE",
                headers: {
                  "X-WP-Nonce": bookingProSettings.nonce,
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

    const handleInputChange = (e) => {
      const inputValue = e.target.value;
    
      // Regex for time format: 11:00 AM - 12:00 PM
      const timeSlotPattern = /^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])) - ((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/;
    
      // Check if input matches the required format
      if (!timeSlotPattern.test(inputValue)) {
        toast.error("Invalid time format. Please use format like '11:00 AM - 12:00 PM'");
      } else {
        setNewSlot(inputValue); // Only update state if the format is valid
      }
    };
    
    const fetchSlots = () => {
      // Fetch slots from the server and update the state
      fetch(`${bookingProSettings.api_base_url}get-time-slots`,
        {
          method: 'GET',
          headers: {
            'X-WP-Nonce': bookingProSettings.nonce,
          },
        }
      )
        .then(response => response.json())
        .then((data)=>{
          const result = data.data;
          if(result){
            setSlots(result);
          }

        })
        .catch(error => console.error('Error fetching slots:', error));
    };

    useEffect(() => {
      fetchSlots();
    }, [refreshKey]);
    
    return (
      <>
        <div className="slots_container">
          <div className="slot-con-inner">
            <div className="sci-left">
              
              {slots.map((slot, index) => (
                <div key={index} className="sci-item">
                  <span className='slot'>{slot.slot_time}</span>
                  <span class="dashicons dashicons-dismiss" onClick={() => handleDelete(slot.id)}></span>
                  
                </div>
              ))}

            </div>
            <div className="sci-right">
              <form>
                <div className="sci-form">
                  <input type="text" onChange={handleInputChange} value={newSlot} class="add_slot_input" placeholder="ex : 10 AM - 11 AM"/>
                  <button type="submit" className="add_slot" onClick={handleAddSlot}>Add</button>
                </div>
              </form>

            </div>
          </div>
          {/* ToastContainer to display the toast messages */}
          <ToastContainer />

        </div>

      </>
    );
  };
  
  export default TimeSlotSettingPage;
  