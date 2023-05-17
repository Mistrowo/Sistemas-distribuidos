const EventEmitter = require('events');
const crypto = require('crypto');

class IoTDevice extends EventEmitter {
  constructor(id, dt) {
    super();
    this.id = id;
    this.dt = dt;
  }

  start() {
    setInterval(() => {
      const timestamp = Date.now();
      const dataSize = Math.floor(Math.random() * 20) + 1;
      const data = crypto.randomBytes(dataSize).toString('hex');
      const message = {
        timestamp,
        value: { data },
      };
      console.log(`Device ${this.id} sending:`, JSON.stringify(message));
      this.emit('data', message);
    }, this.dt);
  }
}

module.exports = IoTDevice