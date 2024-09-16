import './leftpanel.css';
import './bootstrap_5.0.2/css/bootstrap.css';
import './font-awesome/css/font-awesome.css';
import {React, useEffect, useState} from 'react';

import { Link, useNavigate } from 'react-router-dom';

function Leftpanel() {
    const navigate = useNavigate();
    const [tok, setTok] = useState(localStorage.getItem("accessToken") != null);
    
    const updateToken = () => {
        const token = localStorage.getItem("accessToken");
        setTok(token != null);
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
            <nav class="main-menu" id="fix">
                <ul>
                    <li>
                        <Link to={tok ? "/" : "/login"}>
                            <i class="fa fa-home fa-lg"></i>
                            <span class="nav-text">
                                name
                                </span>
                        </Link>
                    </li>
                    <li class="has-subnav">
                        <Link to={tok ? "/upload" : "/login"}>
                            <i class="fa fa-upload fa-lg"></i>
                            <span class="nav-text">
                                    Upload
                                </span>
                        </Link>
                    </li>
                    <li class="has-subnav">
                        <Link to={tok ? "/chat" : "/login"}>
                            <i class="fa fa-telegram fa-lg"></i>
                            <span class="nav-text">
                                    Chats
                                </span>
                        </Link>
                    </li>
                    <li class="has-subnav">
                        <Link to={tok ? "/statistic" : "/login"}>
                            <i class="fa fa-bar-chart fa-lg"></i>
                            <span class="nav-text">
                                    Statistics
                                </span>
                        </Link>

                    </li>
                    <li>
                        <Link to={tok ? "/duty" : "/login"}>
                            <i class="fa fa-check-square-o fa-lg"></i>
                            <span class="nav-text">
                                    Duty
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/lessons">
                            <i class="fa fa-calendar fa-lg"></i>
                            <span class="nav-text">
                                Lessons
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i class="fa fa-cogs fa-lg"></i>
                            <span class="nav-text">
                                    Settings
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i class="fa fa-map-marker fa-lg"></i>
                            <span class="nav-text">
                                    Member Map
                                </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i class="fa fa-info fa-lg"></i>
                            <span class="nav-text">
                                    Documentation
                                </span>
                        </Link>
                    </li>
                </ul>

                <ul class="logout">
                    <li>
                        <Link to="/login" onClick={(e) => {
                e.preventDefault(); // Предотвращаем переход сразу
                handleLogout(); // Вызываем handleLogout для выхода и перенаправления
            }}>
                            <i class="fa fa-power-off fa-lg"></i>
                            <span class="nav-text">
                                    Logout
                                </span>
                        </Link>
                    </li>
                </ul>
            </nav>
  );
}

export default Leftpanel;
