const { FilterByPrice, FilterBySeason, CatalogFilter } = require('../src/patterns/strategy');

const boxes = [
  { id: '1', name: 'BÃ¡sica', price: 15000, season: 'verano' },
  { id: '2', name: 'Premium', price: 25000, season: 'otoÃ±o' },
  { id: '3', name: 'Familiar', price: 35000, season: 'verano' },
];

test('FilterByPrice filtra correctamente', () => {
  const filter = new CatalogFilter(FilterByPrice);
  const result = filter.apply(boxes, 20000);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('BÃ¡sica');
});

test('FilterBySeason filtra por temporada', () => {
  const filter = new CatalogFilter(FilterBySeason);
  const result = filter.apply(boxes, 'verano');
  expect(result).toHaveLength(2);
});