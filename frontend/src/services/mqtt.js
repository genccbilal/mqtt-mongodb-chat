import mqtt from "mqtt";

class MQTTService {
  constructor() {
    this.client = null;
    this.messageHandlers = new Map();
  }

  // MQTT bağlantısını başlat
  connect() {
    if (this.client) return;

    this.client = mqtt.connect("ws://localhost:9001");

    this.client.on("connect", () => {
      console.log("MQTT bağlantısı başarılı");
    });

    this.client.on("message", (topic, message) => {
      try {
        const messageData = JSON.parse(message.toString());
        const handlers = this.messageHandlers.get(topic);
        if (handlers) {
          handlers.forEach((handler) => handler(messageData));
        }
      } catch (err) {
        console.error("Mesaj işlenirken hata:", err);
      }
    });

    this.client.on("error", (error) => {
      console.error("MQTT bağlantı hatası:", error);
    });
  }

  // Özel kanal oluştur
  createPrivateChannel(user1Id, user2Id) {
    const sortedIds = [user1Id, user2Id].sort();
    return `private-chat/${sortedIds[0]}/${sortedIds[1]}`;
  }

  // Kanala abone ol
  subscribe(channel, messageHandler) {
    if (!this.client) {
      console.error("MQTT bağlantısı yok");
      return;
    }

    this.client.subscribe(channel, (err) => {
      if (err) {
        console.error("Kanal aboneliği hatası:", err);
        return;
      }

      if (!this.messageHandlers.has(channel)) {
        this.messageHandlers.set(channel, new Set());
      }
      this.messageHandlers.get(channel).add(messageHandler);
    });
  }

  // Kanal aboneliğini kaldır
  unsubscribe(channel, messageHandler) {
    if (!this.client) return;

    if (this.messageHandlers.has(channel)) {
      this.messageHandlers.get(channel).delete(messageHandler);
      if (this.messageHandlers.get(channel).size === 0) {
        this.client.unsubscribe(channel);
        this.messageHandlers.delete(channel);
      }
    }
  }

  publish(channel, message) {
    if (!this.client) {
      console.error("MQTT bağlantısı yok");
      return;
    }

    this.client.publish(channel, JSON.stringify(message));
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.messageHandlers.clear();
    }
  }
}

// Singleton instance oluştur
const mqttService = new MQTTService();
export default mqttService;
