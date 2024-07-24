import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [cityName, setCityName] = useState('');

  const handleSearch = () => {
    if (cityName.trim() !== '') {
      onSearch(cityName);
      setCityName('');
    }
  };

  return (
    <div>
      <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
