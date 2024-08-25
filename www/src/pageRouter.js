import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import Login from "./Login";
// import AdminPage from "../pages/admin/AdminPage"
// import UserPage from "../pages/user/UserPage"
import Lessons from "./Lessons"
import Upload from "./Upload";
import Home from "./Home";

function PageRouter() {
    const navigate = useNavigate();
    if (localStorage.getItem("accessToken")) {
        alert("done");
        navigate("/");
    }
    else {
        console.log("no tokens");
        alert("/login")
    }
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                {/* <Route exact path="/adminPage" element={<AdminPage />} /> */}
                {/* <Route exact path="/userPage" element={<UserPage />} /> */}
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<Upload />} />
            </Routes>
        </Router>
    )
}

export default PageRouter;