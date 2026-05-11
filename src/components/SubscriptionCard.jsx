const React = require('react');
const { greenBiteEvents } = require('../patterns/observer');

const SubscriptionCard = ({ box }) => {
  const handleSubscribe = () => {
    greenBiteEvents.emit('subscription:new', {
      boxId: box.id,
      userId: box.userId
    });
    alert(`Suscrito a ${box.name}`);
  };

  return React.createElement('div', {
    style: { border: '1px solid #ccc', padding: 16, borderRadius: 8, margin: 8 }
  },
    React.createElement('h3', null, box.name),
    React.createElement('p', null, box.description),
    React.createElement('p', null,
      React.createElement('strong', null, `$${box.price}/mes`)
    ),
    React.createElement('p', null, `Temporada: ${box.season}`),
    React.createElement('button', { onClick: handleSubscribe }, 'Suscribirse')
  );
};

module.exports = SubscriptionCard;