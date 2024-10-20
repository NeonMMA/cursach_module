import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Lessons.css"; // Не забудь подключить файл стилей

const Lessons = () => {
    const [schedule, setSchedule] = useState([]); // Хранение расписания
    const [startDate, setStartDate] = useState(new Date()); // Начальная дата
    const [endDate, setEndDate] = useState(new Date()); // Конечная дата
    
    // Функция получения данных с сервера
    const fetchData = async (start, end) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await axios.post('http://localhost:5000/get_schedule', {
                accessToken: accessToken,
                start_date: start,
                end_date: end,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching schedule data", error);
            return [];
        }
    };

    // При загрузке страницы загружаем данные за текущую неделю
    useEffect(() => {
        const fetchInitialData = async () => {
            const initialStartDate = getMondayOfCurrentWeek();
            const initialEndDate = getSundayOfWeek(initialStartDate);
            const data = await fetchData(initialStartDate, initialEndDate);
            setSchedule(data);
        };
        fetchInitialData();
    }, []);

    // Получаем понедельник текущей недели
    const getMondayOfCurrentWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        return monday.toISOString().split('T')[0]; // Преобразуем в формат YYYY-MM-DD
    };

    // Получаем воскресенье текущей недели
    const getSundayOfWeek = (startDate) => {
        const monday = new Date(startDate);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6); // Добавляем 6 дней к понедельнику
        return sunday.toISOString().split('T')[0];
    };

    // Обработка нажатия на левую кнопку
    const handleScrollLeft = async () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 7);
        const newEndDate = new Date(endDate);
        newEndDate.setDate(newEndDate.getDate() - 7);

        try {
            const data = await fetchData(newStartDate.toISOString().split('T')[0], newEndDate.toISOString().split('T')[0]);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setSchedule((prev) => [data, ...prev.slice(0, prev.length - 1)]);
        } catch (error) {
            console.error("Error fetching previous week data", error);
        }
    };

    // Обработка нажатия на правую кнопку
    const handleScrollRight = async () => {
        const newStartDate = new Date(endDate);
        newStartDate.setDate(newStartDate.getDate() + 1);
        const newEndDate = new Date(endDate);
        newEndDate.setDate(newEndDate.getDate() + 7);

        try {
            const data = await fetchData(newStartDate.toISOString().split('T')[0], newEndDate.toISOString().split('T')[0]);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setSchedule((prev) => [...prev.slice(1), data]);
        } catch (error) {
            console.error("Error fetching next week data", error);
        }
    };

    // Отрисовка расписания для одного дня
    const renderDaySchedule = (day) => {
        return (
            <div key={day[0].date}>
                <div className="day-header">{day[0].date}</div>
                {day.slice(1).map((event, index) => {
                    return (
                        <div key={index} className={`event ${event.type === "duty" ? "duty" : "lesson"}`}>
                            {event.type === "duty" ? (
                                <div>{event.start_time} - {event.end_date} (Наряд)</div>
                            ) : (
                                <div>{event.start_time} - {event.end_date} ({event.disc_name})</div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Основной рендер компонента
    return (
        <div className="lessons-container">
            <div className="schedule">
                {schedule.map((week, weekIndex) => (
                    <div key={weekIndex} className="week-schedule">
                        {Object.keys(week).map((day) => (
                            <div key={day} className="day-schedule">
                                {renderDaySchedule(week[day])}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="navigation-buttons">
                <button onClick={handleScrollLeft}>←</button>
                <button onClick={handleScrollRight}>→</button>
            </div>
        </div>
    );
};

export default Lessons;
