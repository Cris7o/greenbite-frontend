// Patrón Strategy — distintos algoritmos de filtrado intercambiables
export const FilterByPrice = {
  filter: (boxes, value) => boxes.filter(b => b.price <= value)
};

export const FilterBySeason = {
  filter: (boxes, value) => boxes.filter(b => b.season === value)
};

export const FilterByProducer = {
  filter: (boxes, value) => 
    boxes.filter(b => b.producer.toLowerCase().includes(value.toLowerCase()))
};

export class CatalogFilter {
  constructor(strategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  apply(boxes, value) {
    return this.strategy.filter(boxes, value);
  }
}