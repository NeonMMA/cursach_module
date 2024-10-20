import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./Stat.css";

// Цвета для диаграмм
const COLORS = ["#FFBB28", "#0088FE", "#00C49F", "#FF8042"];

// Месяцы
const months = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

// Текущая дата для предустановки месяца и года
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const Statistics = () => {
  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear] = useState(currentYear);

  const handleDateChange = async (new_month) => {
    setSelectedMonth(new_month);
    fetchData(monthData,yearData);
  }

  // Функция для получения данных с сервера
  const fetchData = async (month, year) => {
    try {
      const response = await axios.post(`http://localhost:5000/adstat`, {"month": month + 1, "year": year});
      setMonthData(response.data.month);
      setYearData(response.data.year);
      console.clear();
      console.log("response: ");
      console.log(response);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Загружаем данные при первой загрузке страницы
  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Форматирование данных для круговой диаграммы
  const formatDataForPie = (data) => {
    return data.map((item) => ({
      name: `${item.first_name} ${item.last_name}`,
      pairs: item.pair_count,
      duties: item.duty_count
    }));
  };

  return (
    <div className="statistics-page">
      <h1>Статистика</h1>

      {/* Выбор месяца */}
      <div className="controls">
        <label>Месяц: </label>
        <select
          value={selectedMonth}
          onChange={(e) => handleDateChange(parseInt(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="charts">
        {/* Месячные данные */}
        <div className="chart-section">
          <h2>Наряды (месяц)</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={formatDataForPie(monthData)}
              dataKey="duties"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
            >
              {monthData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h2>Пары (месяц)</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={formatDataForPie(monthData)}
              dataKey="pairs"
              nameKey="name"
              outerRadius={100}
              fill="#82ca9d"
            >
              {monthData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Годовые данные */}
        <div className="chart-section">
          <h2>Наряды (год)</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={formatDataForPie(yearData)}
              dataKey="duties"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
            >
              {yearData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h2>Пары (год)</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={formatDataForPie(yearData)}
              dataKey="pairs"
              nameKey="name"
              outerRadius={100}
              fill="#82ca9d"
            >
              {yearData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
