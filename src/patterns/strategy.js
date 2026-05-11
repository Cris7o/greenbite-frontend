export const FilterByPrice = {
  filter: (boxes, value) => boxes.filter(b => b.precio <= value)
};

export const FilterBySeason = {
  filter: (boxes, value) => boxes.filter(b => b.categoria === value)
};

export const FilterByProducer = {
  filter: (boxes, value) =>
    boxes.filter(b => b.nombre.toLowerCase().includes(value.toLowerCase()))
};

export class CatalogFilter {
  constructor(strategy) { this.strategy = strategy; }
  setStrategy(strategy) { this.strategy = strategy; }
  apply(boxes, value) { return this.strategy.filter(boxes, value); }
}
