require("dotenv").config();
const mqttClient = require("./services/mqttClient");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Express uygulamasını oluştur
const app = express();

// CORS ayarları
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:8080",
    ], // Frontend'in çalıştığı portlar
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// API rotalarını ekle
app.use("/api", userRoutes);
app.use("/api/messages", messageRoutes);

// Veritabanı bağlantısını başlat
connectDB();

// MQTT bağlantısı ve topic abonelikleri
mqttClient.on("connect", () => {
  console.log("✅ MQTT Broker'a bağlandı!");
  mqttClient.subscribe("chat/connect");
  mqttClient.subscribe("chat/disconnect");
  mqttClient.subscribe("chat/message");
});

const activeConnections = new Map();

mqttClient.on("message", async (topic, message) => {
  let data;

  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    console.error(`❌ Hatalı mesaj alındı (${topic}):`, message.toString());
    return;
  }

  if (topic === "chat/connect") {
    // Kullanıcı bağlantısını kaydet
    activeConnections.set(data.userId, data.partnerId);
  }

  if (topic === "chat/disconnect") {
    // Kullanıcı bağlantısını kaldır
    activeConnections.delete(data.userId);
  }

  if (topic === "chat/message") {
    if (!data.userId || !data.partnerId || !data.message) {
      return;
    }

    // Bağlantı kontrolü
    const senderPartner = activeConnections.get(data.userId);
    const receiverPartner = activeConnections.get(data.partnerId);

    if (senderPartner !== data.partnerId || receiverPartner !== data.userId) {
      return;
    }

    try {
      // Mesajı veritabanına kaydet
      const Message = require("./models/Message");
      // senderName yoksa kullanıcıdan doldur
      let senderName = data.senderName;
      if (!senderName) {
        const sender = await User.findById(data.userId).select("username");
        senderName = sender ? sender.username : "";
      }

      const newMessage = new Message({
        senderId: data.userId,
        receiverId: data.partnerId,
        message: data.message,
        senderName,
      });
      await newMessage.save();

      const sortedIds = [String(data.userId), String(data.partnerId)].sort();
      const privateChannel = `private-chat/${sortedIds[0]}/${sortedIds[1]}`;

      const payload = {
        senderId: data.userId,
        receiverId: data.partnerId,
        message: data.message,
        senderName,
      };

      mqttClient.publish(privateChannel, JSON.stringify(payload));
    } catch (error) {
      console.error("Mesaj kaydedilirken hata:", error);
    }
  }
});

// Express sunucusunu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express sunucusu ${PORT} portunda çalışıyor`);
});
