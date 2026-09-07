import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContents from "./AppContents";
import SignInChoice from "./components/SignInChoice"; // 👈 import the new file
import SignInPage from "./components/StudentSignIn";
import EmailVerificationPage from "./components/EmailVerificationPage";
import StudentSignupPage from "./components/StudentSignupPage";
import AdminButtons from "./components/AdminButtons";
import AdminOptions from "./components/AdminOptions";
import SuperAdminSignIn from "./components/SuperAdminSignIn";
import AdminDashboard from "./components/AdminDashboard";
import AdminSignIn from "./components/AdminSignIn";
//import ComplainSignIn from "./components/Complain";
import ForgotPassword from "./components/ForgotPassword";
import StudentSignIn from "./components/StudentSignIn";
import Complain from "./components/Complain";
import ComplainSignIn from "./components/ComplainSignIn";
import AboutHostelManagement from "./components/AboutHostelManagement";
import ApplicationProcess from "./components/Admissions/ApplicationProcess";
import Requirements from "./components/Admissions/Requirements";
import FeesStructure from "./components/Admissions/FeesStructure";
import ImportantDates from "./components/Admissions/ImportantDates";
import HostelAccommodation from "./components/studentfacilities/HostelAccommodation";
import LibraryServices from "./components/studentfacilities/LibraryServices";
import SportsFacilities from "./components/studentfacilities/SportsFacilities";
import Cafeteria from "./components/studentfacilities/Cafeteria";
import MedicalServices from "./components/studentfacilities/MedicalServices";
import StudentPortal from "./components/StudentPortal";

import StudentProfileTable from "./studentdash/PayFee";
import StudentDetailsTable from "./admindash/Student";
import CategoryComplaints from "./components/CategoryComplaints";
import MyAccount from "./studentdash/MyAccount";
import Setting from "./studentdash/Setting";
import MessFeeRecord from "./admindash/messfeerecord";
import Dashbord from "./admindash/Dashbord";
import CanteenFeeRecord from "./admindash/CanteenFeeRecord";
import Studendatashow from "./admindash/Studentdatashow";
import Studentdatashow from "./admindash/Studentdatashow";
import MessFeeStudent from "./studentdash/MessFeeStudent";
import CanteenFeeStudent from "./studentdash/CanteenFeeStudent";
import SettingAdmin from "./admindash/SettingAdmin";
import AttendanceWorker from "./admindash/AttendanceWorker";
import TotalAttendance from "./admindash/TotalAttendance";
import AdminLayout from "./admindash/ReportAdmin";
import AdminFunction from "./admindash/AdminFunction";
import FunctionList from "./studentdash/FunctionList";
import StudentReports from "./studentdash/StudentReports";
import WorkerReports from "./studentdash/WorkerReports";
import PayFeePage from "./studentdash/PayFee.jsx";
import PendingComplain from "./studentdash/PendingComplain.jsx";






function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<AppContents />} />
         <Route path="/signin" element={<SignInChoice />} /> {/* 👈 new route */}
         <Route path="/signinasstudent" element={<StudentSignIn/>} />
         <Route path="/emailverify" element={<EmailVerificationPage/>} />
         <Route path="/studentsignup" element={<StudentSignupPage/>} />
         <Route path="/signinasadmin" element={<AdminButtons/>} />
         <Route path="/admin-options" element={<AdminOptions />} />
         <Route path="/superadmin-signin" element={<SuperAdminSignIn/>} />
         <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          <Route path="/admin-signin" element={<AdminSignIn/>} />
         <Route path="/student-signin-complain" element={<Complain/>} />
         <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/complain-signin" element={<ComplainSignIn/>} />
        <Route path="/about" element={<AboutHostelManagement/>} /> 
        <Route path="/admission/process" element={<ApplicationProcess/>} />
        <Route path="/admission/requirements" element={<Requirements/>} />
        <Route path="/admission/fees" element={<FeesStructure/>} />
        <Route path="/admission/dates" element={<ImportantDates/>} />
        <Route path="/facilities/hostel" element={<HostelAccommodation/>} />
        <Route path="/facilities/library" element={<LibraryServices/>} />
        <Route path="/facilities/sports" element={<SportsFacilities/>} />
        <Route path="/facilities/cafeteria" element={<Cafeteria/>} />
        <Route path="/facilities/medical" element={<MedicalServices/>} />
        <Route path="/student-portal" element={<StudentPortal/>} />
        <Route path="/admin-student" element={<StudentDetailsTable/>} />
        <Route path="/my-account" element={<MyAccount/>} />
       // <Route path="/pay-fee" element={<StudentProfileTable/>} />
        <Route path="/student-setting" element={<Setting/>} />
        <Route path="/messfee-record" element={<MessFeeRecord/>} />
        <Route path="/admin-dashbord" element={<Dashbord/>} />
        <Route path="/admin/canteen-fee" element={<CanteenFeeRecord/>} />
        <Route path="/mess-fee" element={<MessFeeStudent/>} />
        <Route path="/canteen-fee" element={<CanteenFeeStudent/>} />
        <Route path="/admin/settings" element={<SettingAdmin/>} />
        <Route path="/admin/attendance" element={<AttendanceWorker/>} />
        <Route path="/admin/total-attendance" element={<TotalAttendance/>} />
        <Route path="/admin/report-student" element={<AdminLayout/>} />
        <Route path="/admin/function" element={<AdminFunction/>} />
        <Route path="/admin/total-complaint" element={<FunctionList/>} />
        <Route path="/admin/reports" element={<StudentReports/>} />
         <Route path="/admin/pending-complaint" element={<PendingComplain/>} />
        
       
       
       

        
       
         
      </Routes>
    </Router>
  );
}

export default App;
