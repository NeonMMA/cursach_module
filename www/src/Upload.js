import React, { Component, useState, useEffect } from "react";
import axios from 'axios';

class UploadFile extends Component  {
    state = {
        // Initially, no file is selected
        tableName: "teachers",
        selectedFile: null,
    };

    // On file select (from the pop up)
    onFileChange = (event) => {

        const file = event.target.files[0];
        
        if (file && file.name.endsWith('.csv')) {
            this.setState({ selectedFile: file });
        } else {
            alert("Please select a valid CSV file.");
            event.target.value = null; 
        }
    };

  onFileUpload = () => {
    // Создаем объект FormData
    const formData = new FormData();

    // Добавляем файл и имя таблицы в FormData
    formData.append("file", this.state.selectedFile);  // файл CSV
    formData.append("table_name", this.state.tableName);  // имя таблицы

    // Вывод информации о файле
    console.log("Selected file:", this.state.selectedFile);

    // Отправляем запрос на сервер
    axios.post("http://localhost:5000/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
        .then(response => {
            console.log("Response from server:", response.data);
        })
        .catch(error => {
            console.error("Error uploading file:", error.response ? error.response.data : error.message);
        });
};

    render() {
        return (
            <div>
                <input
                    type="file"
                    onChange={this.onFileChange}
                    accept=".csv"
                />
                <button onClick={this.onFileUpload}>
                    Upload!
                </button>
            </div>
        );
    }
}


const Upload = () => {
  // Создаем состояние для хранения данных о таблицах
  const [tableNames, setTableNames] = useState([]);

  // Функция для загрузки данных с сервера
  const uploadData = async () => {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    try {
      const response = await axios.post("http://localhost:5000/upload_items", { s: "q" });
      console.clear();
      console.log("upload_response:", response.data.names); // Проверяем данные с сервера

      // Сохраняем имена таблиц в состояние
      setTableNames(response.data.names);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
  };

  // Запускаем загрузку данных при первом рендере компонента
  useEffect(() => {
    uploadData();  // Загрузка данных
  }, []);  // Пустой массив зависимостей, чтобы эффект сработал один раз при загрузке компонента

  return (
    <div>
      <label htmlFor="tables">Выберите таблицу:</label>
      <select id="tables">
        <option value="">-- Выберите таблицу --</option>
        {tableNames.map((table, index) => (
          <option key={index} value={table}>
            {table}
          </option>
        ))}
      </select>

      {/* Компонент UploadFile можно вставить ниже */}
      <UploadFile />
    </div>
  );
};



export default Upload;