import React from "react";
import { createRoot } from "react-dom/client";

import AppointmentsChart from "./components/appointmentsChart";
import RevenueChart from "./components/RevenueChart";
import CustomersChart from "./components/customerChart";
import Header from "./components/Header";


import editLogo from '../assets/images/edit.png';

const Dashboard = () => {
    return (
        <div>
            <div className="bp-dash-container">
                <Header />

                <div className="bp-dash-content">
                    <div className="bp-dash-cont-inner">
                        <div className="bpdci-top">
                            <h2 style={{fontSize:"23px"}}>Dashboard</h2>
                            <input className=".bpd-filter-by-date" type="date" name="" id="" />
                        </div>
                        <div className="bpdci-second">
                            <div style={{backgroundColor:"rgba(112, 132, 233, 0.20)"}} className="bpdci-card">
                                <h1>25</h1>
                                <p>Total Appointments</p>
                            </div>
                            <div style={{backgroundColor:"rgba(243, 249, 0, 0.20)"}} className="bpdci-card">
                                <h1>15</h1>
                                <p>Pending Appointments</p>
                            </div>
                            <div style={{backgroundColor:"rgba(113, 236, 164, 0.20)"}} className="bpdci-card">
                                <h1>20</h1>
                                <p>Approved Appointments</p>
                            </div>
                            <div style={{backgroundColor:"rgba(235, 112, 112, 0.20)"}} className="bpdci-card">
                                <h1>10</h1>
                                <p>Rejected Appointments</p>
                            </div>
                            <div style={{backgroundColor:"rgba(113, 236, 164, 0.20)"}} className="bpdci-card">
                                <h1>$2500</h1>
                                <p>Total Revinue</p>
                            </div>
                            <div style={{backgroundColor:"rgba(185, 107, 231, 0.20)"}} className="bpdci-card">
                                <h1>200</h1>
                                <p>Total Customers</p>
                            </div>

                        </div>
                        <div className="bpdci-appointments">
                            <h2 style={{ fontSize: "20px;",padding:"10px 0px"}}>Upcomming Appointments</h2>                           
                        </div>
                        <div className="bpdci-third">
                            <table>
                                <tr className="bpd-table-head">
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Staff</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Action</th>
                                </tr>
                                <tr className="bpd-table-item">
                                    <td>1</td>
                                    <td>John Doe</td>
                                    <td>Manicure</td>
                                    <td>John Smith</td>
                                    <td>1 hour</td>
                                    <td>Pending</td>
                                    <td>$50</td>
                                    <td><img style={{width:"20px"}} src={editLogo} alt="" /></td>
                                </tr>
                                <tr className="bpd-table-item">
                                    <td>2</td>
                                    <td>Jane Smith</td>
                                    <td>Pedicure</td>
                                    <td>Emily Johnson</td>
                                    <td>1 hour and 30 minutes</td>
                                    <td>Approved</td>
                                    <td>$75</td>
                                    <td><img style={{width:"20px"}} src={editLogo} alt="" /></td>
                                </tr>
                                <tr className="bpd-table-item">
                                    <td>3</td>
                                    <td>Michael Brown</td>
                                    <td>Waxing</td>
                                    <td>David Wilson</td>
                                    <td>45 minutes</td>
                                    <td>Rejected</td>
                                    <td>$100</td>
                                    <td><img style={{width:"20px"}} src={editLogo} alt="" /></td>
                                </tr>
                                <tr className="bpd-table-item">
                                    <td>4</td>
                                    <td>Emily Davis</td>
                                    <td>Facial</td>
                                    <td>Sarah Thompson</td>
                                    <td>1 hour and 15 minutes</td>
                                    <td>Pending</td>
                                    <td>$60</td>
                                    <td><img style={{width:"20px"}} src={editLogo} alt="" /></td>
                                </tr>
                                <tr className="bpd-table-item">
                                    <td>5</td>
                                    <td>David Miller</td>
                                    <td>Manicure</td>
                                    <td>John Smith</td>
                                    <td>1 hour</td>
                                    <td>Approved</td>
                                    <td>$50</td>
                                    <td><img style={{width:"20px"}} src={editLogo} alt="" /></td>
                                </tr>
                               

                            </table>
                        </div>
                        <div className="bpdci-analytics">
                            <h2 style={{ fontSize: "20px;",padding:"30px 0px"}}>Analytics</h2>                           
                        </div>
                        <div className="bpdci-fourth">
                            <div className="appointments">
                                <AppointmentsChart />
                            </div>
                            <div className="renenue">
                                <RevenueChart />
                            </div>
                            <div className="Customer">
                                <CustomersChart />
                            </div>
                        </div>
                    </div>

                </div>


            </div>  
        </div>
    );
};

const initDashboard = () => {
    const dashboardDiv = document.getElementById('bp-dashboard-root');

    if (dashboardDiv) { 
        const root = createRoot(dashboardDiv);
        root.render(<Dashboard />);
    } else {
        console.error('Dashboard root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initDashboard);
