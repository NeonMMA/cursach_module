import React, { useState, useEffect } from "react";
import axios from 'axios';
import UploadFile from './UploadFile';

const Upload = () => {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');  // Состояние для выбранной таблицы

  // Загрузка данных о таблицах с сервера
  const uploadData = async () => {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    try {
      const response = await axios.post("http://localhost:5000/upload_items", { s: "q" });
      console.clear();
      console.log("upload_response:", response.data.names);  // Проверяем данные с сервера

      setTableNames(response.data.names);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
  };

  useEffect(() => {
    uploadData();  // Загрузка данных при первом рендере
  }, []);

  // Обработчик изменения значения в <select>
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);  // Устанавливаем выбранную таблицу в состояние
  };

  return (
    <div>
      <label htmlFor="tables">Выберите таблицу:</label>
      <select id="tables" value={selectedTable} onChange={handleTableChange}>
        <option value="">-- Выберите таблицу --</option>
        {tableNames.map((table, index) => (
          <option key={index} value={table}>
            {table}
          </option>
        ))}
      </select>

      {/* Передаем выбранное значение таблицы в UploadFile */}
      <UploadFile tableName={selectedTable} />
    </div>
  );
};

export default Upload;
