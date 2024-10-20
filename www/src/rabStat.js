import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
const WorkerStatisticsPage = ({role}) => {
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // текущий месяц по умолчанию
  const [year] = useState(new Date().getFullYear()); // текущий год
  const [data, setData] = useState({ month: {}, year: {} }); // состояние для данных
  const [isLoading, setIsLoading] = useState(true); // индикатор загрузки
  const accessToken = localStorage.getItem('accessToken'); // получаем токен из localStorage
  
  // названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  useEffect(() => {
    console.log();
    fetchDataForMonth(selectedMonth);
  }, [selectedMonth]);

  // функция для запроса данных на сервер
  const fetchDataForMonth = async (month) => {
    const endDate = new Date();
    await axios.post('http://localhost:5000/personal_stat', {
      "accessToken": localStorage.getItem("accessToken"),
        "month": month + 1, // отправляем номер месяца
        "year": year,
        "endTime": endDate, // конец месяца
      }).then((response) => {
        setData(response.data); // сохраняем данные
        setIsLoading(false); // завершение загрузки
      });
  };

  // функция для обработки изменения месяца
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value)); // обновляем выбранный месяц
  };

  // функция для рендеринга нарядов и пар
  const renderStats = (stats, type) => {
    const isMonth = type === 'month'; // проверка, месяц или год
    return (
      <>
        <h3>{isMonth ? 'Наряды' : 'За ' + year + ' год:'}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {Object.keys(stats)
            .filter((key) => key !== 'pair_count' && key !== 'all_pair') // исключаем ключи пар
            .map((corpus) => {
              const { duty_count, all_duty } = stats[corpus];
              const color = duty_count === all_duty ? 'green' : 'red'; // цвет по условию
              return (
                <div key={corpus}>
                  <p style={{ color }}>{corpus}</p>
                  <p>{duty_count}/{all_duty}</p>
                </div>
              );
            })}
        </div>
        <div>
          <h3>Пары</h3>
          <p style={{ color: stats.pair_count === stats.all_pair ? 'green' : 'red' }}>
            {stats.pair_count}/{stats.all_pair}
          </p>
        </div>
      </>
    );
  };

  if (isLoading) {
    return <p>Загрузка данных...</p>; // индикатор загрузки
  }
  // if (role !== "3") {
  //       return <Navigate to="/" replace/>
  //     }
  return (
    <div className="worker-statistics-page">
      <h1>Статистика</h1>
      <div>
        <label>
          В
          <select value={selectedMonth} onChange={handleMonthChange}>
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {/* Статистика за месяц */}
        {renderStats(data.month, 'month')}
        {/* Статистика за год */}
        {renderStats(data.year, 'year')}
      </div>
    </div>
  );
};

export default WorkerStatisticsPage;
