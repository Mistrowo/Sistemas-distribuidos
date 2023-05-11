function Producer(deviceId, sendInterval, payloadSize, onData) {
    this.deviceId = deviceId;
    this.sendInterval = sendInterval;
    this.payloadSize = payloadSize;
    this.onData = onData;
    this.timerId = null;
  }
  
  Producer.prototype.start = function() {
    this.timerId = setInterval(() => {
      const timestamp = Date.now();
      const value = generatePayload(this.payloadSize);
      const data = { timestamp, value };
      const message = { deviceId: this.deviceId, data };
      this.onData(message);
    }, this.sendInterval);
  };
  
  Producer.prototype.stop = function() {
    clearInterval(this.timerId);
  };
  
  function generatePayload(payloadSize) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const payload = [];
    for (let i = 0; i < payloadSize; i++) {
      payload.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }
    return { data: payload.join('') };
  }
  