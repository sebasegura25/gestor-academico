
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        <p>Soluciones Digitales - {new Date().getFullYear()} - General Madariaga</p>
      </div>
    </footer>
  );
};

export default Footer;
