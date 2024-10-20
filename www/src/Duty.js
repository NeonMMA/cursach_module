import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import "./Duty.css";

const DutyForm = () => {
  const [duties, setDuties] = useState([{ date: '', corpus: '', teacher: '' }]);
  const [corpusOptions, setCorpusOptions] = useState([]);
  const [teachersByRow, setTeachersByRow] = useState([]); // массив для хранения учителей по каждой строке
  const currentDate = useState(moment().format('YYYY-MM-DD'));

  // Fetch corpus options from the server on mount
  useEffect(() => {
    axios.post('http://localhost:5000/duty_type').then((response) => {
      setCorpusOptions(response.data);
    });
  }, []);

  // Function to fetch teachers for a specific row when a date is selected
  const fetchTeachers = (index, selectedDate) => {
    axios
      .post('http://localhost:5000/duty_date', { date: selectedDate })
      .then((response) => {
        const sortedTeachers = response.data.sort((a, b) => a.duty_num - b.duty_num);
        // Сохраняем учителей для конкретной строки
        const newTeachersByRow = [...teachersByRow];
        newTeachersByRow[index] = sortedTeachers;
        setTeachersByRow(newTeachersByRow);
      });
  };

  // Handle date change
  const handleDateChange = (index, value) => {
    const newDuties = [...duties];
    newDuties[index].date = value;
    setDuties(newDuties);
    fetchTeachers(index, value); // Fetch teachers based on the selected date
  };

  // Handle corpus change
  const handleCorpusChange = (index, value) => {
    const newDuties = [...duties];
    newDuties[index].corpus = value;
    setDuties(newDuties);
  };

  // Handle teacher change
  const handleTeacherChange = (index, value) => {
    const newDuties = [...duties];
    newDuties[index].teacher = value;
    setDuties(newDuties);
  };

  // Add new row
  const addDutyRow = () => {
    setDuties([...duties, { date: '', corpus: '', teacher: '' }]);
    setTeachersByRow([...teachersByRow, []]); // добавляем пустой список учителей для новой строки
  };

  // Handle submit
  const handleSubmit = () => {
    const payload = {
      accessToken: localStorage.getItem("accessToken"), // This should come from your auth logic
      duties: duties.map((duty) => ({
        date: duty.date,
        current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        corpus_id: duty.corpus, // Send corpus_id
        teacher_id: duty.teacher // Send teacher_id
      }))
    };

    axios.post('http://localhost:5000/duty', payload).then((response) => {
      alert('Уведомления успешно отправлены');
    });
  };

  return (
    <div>
      {duties.map((duty, index) => (
        <div key={index} className="duty-row">
          <input
            type="date"
            min={currentDate}
            value={duty.date}
            onChange={(e) => handleDateChange(index, e.target.value)}
          />
          <select value={duty.corpus} onChange={(e) => handleCorpusChange(index, e.target.value)}>
            <option value="">Выберите корпус</option>
            {corpusOptions.map((corpus) => (
              <option key={corpus.id} value={corpus.id}>
                {corpus.name}
              </option>
            ))}
          </select>
          <select value={duty.teacher} onChange={(e) => handleTeacherChange(index, e.target.value)}>
            <option value="">Выберите преподавателя</option>
            {/* Показываем список преподавателей для конкретной строки */}
            {(teachersByRow[index] || []).map((teacher) => (
              <option
                key={teacher.teacher_id}
                value={teacher.teacher_id}
                style={{ color: teacher.lesson_today ? 'red' : 'black' }}
              >
                {`${teacher.first_name} ${teacher.last_name} (${teacher.duty_num})`}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={addDutyRow}>+</button>
      <button onClick={handleSubmit}>Подтвердить и отправить уведомления</button>
    </div>
  );
};

export default DutyForm;
