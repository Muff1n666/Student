import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка заметок...</p>
    </div>
  );
}

export default LoadingSpinner;