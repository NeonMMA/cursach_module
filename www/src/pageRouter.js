import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import Login from "./Login";
import Upload from './Upload';
import Lessons from './Lessons';
// import AdminPage from "../pages/admin/AdminPage"
// import UserPage from "../pages/user/UserPage"

// import Lessons from "./Lessons"
// import Upload from "./Upload";

import Home from "./Home";
import { useEffect } from "react";

function PageRouter(path="/") {
    const navigate = useNavigate();
    useEffect(() => {
        
        if (localStorage.getItem("accessToken")) {
            console.log("done");
            navigate("path");
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
                {/* <Route exact path="/adminPage" element={<AdminPage />} /> */}
                {/* <Route exact path="/userPage" element={<UserPage />} /> */}
                {/* <Route path="/lessons" element={<Lessons />} /> */}
                <Route path="/login" element={<Login />} />
                {/* <Route path="/upload" element={<Upload />} /> */}
                <Route path="/upload" element={<Upload />} />
                {/* <ProtectedRoute path="/" element={<Home />} roles={['user', 'admin']} /> */}
                <Route path="/lessons" element={<Lessons />} />
                {/* <Route path="/upload" element={<Upload />} /> */}
            </Routes>
        // </Router>
    )
}

export default PageRouter;