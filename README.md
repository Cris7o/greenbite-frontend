# greenbite-frontend

Componente NPM del catálogo de cajas orgánicas para GreenBite.

## Instalación
```bash
npm install greenbite-frontend
```

## Uso
```javascript
import { CatalogList } from 'greenbite-frontend';
```

## Estructura del proyecto

- `__tests__/` — pruebas unitarias de componentes y patrones
- `src/components/` — componentes React (CatalogList, SubscriptionCard)
- `src/patterns/` — patrones de diseño (observer.js, strategy.js)
- `src/index.js` — exports del componente NPM
- `.babelrc` — configuración de Babel para Jest
- `package.json` — dependencias y scripts

## Patrones implementados

### Observer
Manejo de eventos de suscripción entre componentes. Cuando un usuario se suscribe a una caja, se emite un evento `subscription:new` que puede ser escuchado por cualquier parte de la aplicación.

### Strategy
Filtros intercambiables para el catálogo. Permite cambiar el algoritmo de filtrado sin modificar el componente:
- `FilterByPrice` — filtra cajas por precio máximo
- `FilterBySeason` — filtra cajas por temporada
- `FilterByProducer` — filtra cajas por nombre de productor

## Pruebas
```bash
npm test
```

## Resultados de pruebas
- 5/5 tests pasando
- SubscriptionCard: renderizado y botón de suscripción
- Strategy: filtrado por precio y temporada
