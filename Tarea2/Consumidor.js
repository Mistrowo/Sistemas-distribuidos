function Consumer(onMessage) {
    this.onMessage = onMessage;
  }
  
  Consumer.prototype.start = function() {
    // Aquí se podría abrir una conexión a un servidor que envía los mensajes
    // o hacer polling a una API REST, pero por simplicidad simplemente generamos mensajes aleatorios
    setInterval(() => {
      const timestamp = Date.now();
      const deviceId = Math.floor(Math.random() * 3); // Generamos un ID de dispositivo aleatorio entre 0 y 2
      const value = generatePayload(Math.floor(Math.random() * 100)); // Generamos un payload aleatorio
      const data = { timestamp, value };
      const message = { deviceId, data };
      this.onMessage(message);
    }, 1000);
  };
  
  function generatePayload(payloadSize) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const payload = [];
    for (let i = 0; i < payloadSize; i++) {
      payload.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }
    return { data: payload.join('') };
  }
  