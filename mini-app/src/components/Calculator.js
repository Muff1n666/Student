import React, { useState } from 'react';

function Calculator() {
  const [input, setInput] = useState('');

  const calculateAverage = (text) => {
    const numbers = text.split('').filter(char => /[1-5]/.test(char)).map(Number);
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
  };

  const getGradeCount = () => {
    const numbers = input.split('').filter(char => /[1-5]/.test(char));
    return numbers.length;
  };

  const getGradeDistribution = () => {
    const grades = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    input.split('').forEach(char => {
      if (/[1-5]/.test(char)) grades[parseInt(char)]++;
    });
    return grades;
  };

  const average = calculateAverage(input);
  const count = getGradeCount();
  const distribution = getGradeDistribution();

  const getGradeColor = (grade) => {
    if (grade === 5) return '#10b981';
    if (grade === 4) return '#22c55e';
    if (grade === 3) return '#f59e0b';
    if (grade === 2) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="calculator">
      <div className="calc-card">
        <h2>Введите оценки</h2>
        <p className="calc-hint">Вводите оценки от 1 до 5 (остальные символы будут игнорироваться)</p>
        
        <textarea
          className="calc-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="12345..."
          rows="4"
        />
        
        <div className="calc-result">
          <div className="result-main">
            <span className="result-label">Средний балл</span>
            <span className="result-value">{average}</span>
          </div>
          <div className="result-count">
            Оценок: {count}
          </div>
        </div>
      </div>

      {count > 0 && (
        <div className="calc-card">
          <h3>Распределение оценок</h3>
          <div className="grade-bars">
            {[5, 4, 3, 2, 1].map(grade => (
              <div key={grade} className="grade-row">
                <span className="grade-num" style={{ color: getGradeColor(grade) }}>{grade}</span>
                <div className="grade-bar-bg">
                  <div 
                    className="grade-bar-fill"
                    style={{ 
                      width: `${count > 0 ? (distribution[grade] / count) * 100 : 0}%`,
                      backgroundColor: getGradeColor(grade)
                    }}
                  />
                </div>
                <span className="grade-count">{distribution[grade]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
