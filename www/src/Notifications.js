import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';  // CSS стили

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Запрос для получения уведомлений с сервера
    axios.post('http://localhost:5000/notifications', {"tok":localStorage.getItem('accessToken')})
    .then(response => {
      setNotifications(response.data);
    })
    .catch(error => {
      console.error('Error fetching notifications:', error);
    });
  }, []);

  const handleResponse = (id, confirmed) => {
    const responseTime = new Date();

    // Отправляем данные на сервер
    axios.post('http://localhost:5000/not_response', {
      notification_id: id,
      response_time: responseTime,
      confirmed: confirmed
    })
    .then(response => {
      console.log('Response sent successfully:', response.data);
      // Обновляем состояние уведомлений после ответа
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, response_time: responseTime, confirmed: confirmed } : notification
      ));
    })
    .catch(error => {
      console.error('Error sending response:', error);
    });
  };

  return (
    <div className='notifications-container-fullscreen'> {/* Фон на всю страницу */}
      <h1>Уведомления</h1>
      <hr />
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${notification.confirmed === null ? 'pending' : notification.confirmed ? 'confirmed' : 'declined'}`}
          >
            <div className="notification-content">
              <p>Сутки: {notification.corpus_name} {new Date(notification.intercession_date).toLocaleDateString()}</p>
              <div className="notification-buttons">
                {notification.confirmed === null ? (
                  <>
                    <button className="confirm-button" onClick={() => handleResponse(notification.id, true)}>Подтвердить</button>
                    <button className="decline-button" onClick={() => handleResponse(notification.id, false)}>Отклонить</button>
                  </>
                ) : (
                  <span>Время ответа: {notification.response_time.toLocaleTimeString}</span>
                )}
              </div>
            </div>
            <div className="notification-time">
              {new Date(notification.request_time).toLocaleTimeString()}
            </div>
          </div>
        ))
      ) : (
        <p>Нет уведомлений</p>
      )}
    </div>
  );
};

export default Notifications;
