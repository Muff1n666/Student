import React from 'react';

function ErrorMessage({ message, telegramId, onRetry }) {
  return (
    <div className="error-container">
      <h2>❌ Ошибка</h2>
      <p>{message}</p>
      <p>Напишите боту и нажмите /start</p>
      {telegramId && (
        <p style={{ fontSize: '12px', color: '#999' }}>
          Ваш ID: {telegramId}
        </p>
      )}
      <button onClick={onRetry}>
        Попробовать снова
      </button>
    </div>
  );
}

export default ErrorMessage;