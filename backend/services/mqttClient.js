const mqtt = require("mqtt");

// Create a singleton MQTT client for the backend
const mqttUrl = process.env.MQTT_URL || "mqtt://localhost:1883";
const mqttClient = mqtt.connect(mqttUrl);

mqttClient.on("connect", () => {
  console.log("✅ MQTT client connected:", mqttUrl);
});

mqttClient.on("error", (err) => {
  console.error("MQTT client error:", err);
});

module.exports = mqttClient;
