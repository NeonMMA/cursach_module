import './leftpanel.css';
import './bootstrap_5.0.2/css/bootstrap.css';
import './font-awesome/css/font-awesome.css';
import {React, useEffect, useState} from 'react';

import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


function Leftpanel() {
    const navigate = useNavigate();
    const [tok, setTok] = useState(localStorage.getItem("accessToken") != null);
    const [role, setRole] = useState("");

    const updateToken = () => {
        const token = localStorage.getItem("accessToken");
        setTok(token != null);
        if (token != null || token === "") setRole(jwtDecode(token).sub.role);
        else setRole("");
    };

    useEffect(() => {
        // Проверяем токен при первой загрузке компонента
        updateToken();

        // Добавляем обработчик на изменение localStorage в других вкладках
        const handleStorageChange = (e) => {
            if (e.key === "accessToken") {
                updateToken();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Функция для выхода (удаления токена и обновления состояния)
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        updateToken(); // Обновляем состояние вручную после выхода
        navigate("/login");
    };


  return (
            <nav className="main-menu" id="fix">
                <ul>
                    <li>
                        <Link to={tok ? "/" : "/login"}>
                            <i className="fa fa-home fa-lg"></i>
                            <span className="nav-text">
                                name
                                </span>
                        </Link>
                    </li>
                    {(role === "devop" || role === "distributing") &&
                                <li className="has-subnav">
                                    <Link to={tok ? "/upload" : "/login"}>
                                        <i className="fa fa-upload fa-lg"></i>
                                        <span className="nav-text">
                                                Upload
                                            </span>
                                    </Link>
                                </li>
                    }
                    <li className="has-subnav">
                        <Link to={tok ? "/chat" : "/login"}>
                            <i className="fa fa-telegram fa-lg"></i>
                            <span className="nav-text">
                                    Chats
                                </span>
                        </Link>
                    </li>
                    <li className="has-subnav">
                        <Link to={tok ? "/statistic" : "/login"}>
                            <i className="fa fa-bar-chart fa-lg"></i>
                            <span className="nav-text">
                                    Statistics
                                </span>
                        </Link>

                    </li>
                    {(role === "devop" || role === "distributing") &&
                        <li>
                            <Link to={tok ? "/duty" : "/login"}>
                                <i className="fa fa-check-square-o fa-lg"></i>
                                <span className="nav-text">
                                        Duty
                                    </span>
                            </Link>
                        </li>
                    }
                    <li>
                        <Link to="/lessons">
                            <i className="fa fa-calendar fa-lg"></i>
                            <span className="nav-text">
                                Lessons
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i className="fa fa-cogs fa-lg"></i>
                            <span className="nav-text">
                                    Settings
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i className="fa fa-map-marker fa-lg"></i>
                            <span className="nav-text">
                                    Member Map
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/rabstat">
                            <i className="fa fa-info fa-lg"></i>
                            <span className="nav-text">
                                    Documentation
                                </span>
                        </Link>
                    </li>
                </ul>

                <ul className="logout">
                    <li>
                        <Link to="/login" onClick={(e) => {
                e.preventDefault(); // Предотвращаем переход сразу
                handleLogout(); // Вызываем handleLogout для выхода и перенаправления
            }}>
                            <i className="fa fa-power-off fa-lg"></i>
                            <span className="nav-text">
                                    Logout
                                </span>
                        </Link>
                    </li>
                </ul>
            </nav>
  );
}

export default Leftpanel;
