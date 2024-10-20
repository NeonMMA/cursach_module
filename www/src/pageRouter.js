import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import Login from "./Login";
import Upload from './Upload';
import Lessons from './Lessons';
import Notifications from "./Notifications";
import DutyForm from "./Duty";
import Statistics from "./Stat";
import WorkerStatisticsPage from "./rabStat";
import {jwtDecode} from 'jwt-decode';

// import AdminPage from "../pages/admin/AdminPage"
// import UserPage from "../pages/user/UserPage"

// import Lessons from "./Lessons"
// import Upload from "./Upload";

import Home from "./Home";
import { useEffect, useState } from "react";

function PageRouter(path="/") {
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        
        if (localStorage.getItem("accessToken")) {
            setRole(jwtDecode(localStorage.getItem("accessToken")).sub.role);
            console.log("role: ");
            console.log(role);
            console.log("role-end");
            navigate(path);
        }
        else {
            console.log("no tokens");
            navigate("/login");

        }
    },[]);

    return (
        // <Router>
            
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                {(role === "devop" || role === "distributing") && <Route path="/upload" element={<Upload />} />}
                <Route path="/statistic" element={(role === "devop" || role === "distributing")?<Statistics /> : <WorkerStatisticsPage role={role}/>} />
                
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/chat" element={<Notifications />} />
                {(role === "devop" || role === "distributing") && <Route path="/duty" element={<DutyForm />} />}
                <Route path="/rabstat" element={<WorkerStatisticsPage role={role}/>} />
            </Routes>
        // </Router>
    )
}

export default PageRouter;