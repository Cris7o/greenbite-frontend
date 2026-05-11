const React = require('react');
const { render, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');
const SubscriptionCard = require('../src/components/SubscriptionCard');

const mockBox = {
  id: '1',
  name: 'Caja BÃ¡sica',
  description: 'Verduras de temporada',
  price: 15000,
  season: 'verano',
  userId: 'u1'
};

test('renderiza el nombre de la caja', () => {
  render(React.createElement(SubscriptionCard, { box: mockBox }));
  expect(screen.getByText('Caja BÃ¡sica')).toBeInTheDocument();
});

test('renderiza el precio correctamente', () => {
  render(React.createElement(SubscriptionCard, { box: mockBox }));
  expect(screen.getByText('$15000/mes')).toBeInTheDocument();
});

test('botÃ³n de suscripciÃ³n existe', () => {
  render(React.createElement(SubscriptionCard, { box: mockBox }));
  expect(screen.getByText('Suscribirse')).toBeInTheDocument();
});