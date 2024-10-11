import React from "react";


const ThankYou = () => {
  return (
    <div className="content">
      <div className="wrapper-1">
        <div className="wrapper-2">
          <h2 className="thank-you">Thank you!</h2>
          <p>Your appointment submited succesfully </p>

          <div className="go-home-cont">
            <a className="go-home" href={`${window.location.origin}/`}>Go Home</a>
          </div>

        </div>
       
      </div>
    </div>
  );
};

export default ThankYou;