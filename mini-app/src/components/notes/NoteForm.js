import React, { useState } from 'react';

function NoteForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'homework',
    content: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.date) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    onSubmit(formData);
  };

  return (
    <>
      <h2>Создать новую заметку</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название"
            required
          />
        </div>

        <div className="form-group">
          <label>Тип:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="homework"
                checked={formData.type === 'homework'}
                onChange={handleChange}
              />
              <span className="homework-radio">📚 Домашнее задание</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="test"
                checked={formData.type === 'test'}
                onChange={handleChange}
              />
              <span className="test-radio">✍️ Проверочная работа</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Содержание:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Введите содержание заметки"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Дата:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="create-btn">
            Создать
          </button>
        </div>
      </form>
    </>
  );
}

export default NoteForm;