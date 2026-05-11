// Patrón Strategy — distintos algoritmos de filtrado intercambiables
const FilterByPrice = {
  filter: (boxes, value) => boxes.filter(b => b.price <= value)
};

const FilterBySeason = {
  filter: (boxes, value) => boxes.filter(b => b.season === value)
};

const FilterByProducer = {
  filter: (boxes, value) => 
    boxes.filter(b => b.producer.toLowerCase().includes(value.toLowerCase()))
};

class CatalogFilter {
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

module.exports = {
  FilterByPrice,
  FilterBySeason,
  FilterByProducer,
  CatalogFilter
};