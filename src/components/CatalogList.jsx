import React, { useState } from 'react';
import SubscriptionCard from './SubscriptionCard';
import { CatalogFilter, FilterByPrice, FilterBySeason } from '../patterns/strategy';

const mockBoxes = [
  { id: '1', name: 'Caja Básica', description: 'Verduras de temporada', price: 15000, season: 'verano', producer: 'Huerto Los Andes' },
  { id: '2', name: 'Caja Premium', description: 'Frutas y verduras orgánicas', price: 25000, season: 'otoño', producer: 'Finca Verde' },
  { id: '3', name: 'Caja Familiar', description: 'Para toda la familia', price: 35000, season: 'verano', producer: 'Huerto Los Andes' },
];

const catalogFilter = new CatalogFilter(FilterByPrice);

const CatalogList = () => {
  const [boxes, setBoxes] = useState(mockBoxes);
  const [filterType, setFilterType] = useState('price');
  const [filterValue, setFilterValue] = useState('');

  const handleFilter = () => {
    if (!filterValue) return setBoxes(mockBoxes);
    if (filterType === 'price') {
      catalogFilter.setStrategy(FilterByPrice);
      setBoxes(catalogFilter.apply(mockBoxes, Number(filterValue)));
    } else {
      catalogFilter.setStrategy(FilterBySeason);
      setBoxes(catalogFilter.apply(mockBoxes, filterValue));
    }
  };

  return (
    <div>
      <h2>Catálogo GreenBite 🌿</h2>
      <div>
        <select onChange={e => setFilterType(e.target.value)}>
          <option value="price">Precio máximo</option>
          <option value="season">Temporada</option>
        </select>
        <input
          placeholder={filterType === 'price' ? 'Ej: 20000' : 'Ej: verano'}
          onChange={e => setFilterValue(e.target.value)}
        />
        <button onClick={handleFilter}>Filtrar</button>
        <button onClick={() => setBoxes(mockBoxes)}>Limpiar</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {boxes.map(box => <SubscriptionCard key={box.id} box={box} />)}
      </div>
    </div>
  );
};

export default CatalogList;