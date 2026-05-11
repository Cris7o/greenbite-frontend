class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  subscribe(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }
  unsubscribe(event, callback) {
    this.listeners[event] = (this.listeners[event] || [])
      .filter(cb => cb !== callback);
  }
}

const greenBiteEvents = new EventEmitter();

module.exports = {
  EventEmitter,
  greenBiteEvents
};
module.exports.default = EventEmitter;