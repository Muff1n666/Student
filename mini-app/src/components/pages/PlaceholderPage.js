import React from 'react';

function PlaceholderPage({ title, icon }) {
  return (
    <div className="placeholder-page">
      {icon} {title} (в разработке)
    </div>
  );
}

export default PlaceholderPage;