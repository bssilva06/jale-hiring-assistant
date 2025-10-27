import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Languages size={20} className="text-gray-600" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium cursor-pointer hover:border-primary transition-colors"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
