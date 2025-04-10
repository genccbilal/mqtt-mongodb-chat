import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mqttService from "../services/mqtt";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mesaj geçmişini yükle
  const loadMessageHistory = async (userId, partnerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${userId}/${partnerId}`
      );
      if (!response.ok) throw new Error("Mesaj geçmişi yüklenemedi");
      const history = await response.json();
      setMessages(history);
    } catch (err) {
      console.error("Mesaj geçmişi yüklenirken hata:", err);
      setError("Mesaj geçmişi yüklenemedi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userStr = localStorage.getItem("user");
      const partnerId = localStorage.getItem("chatPartnerId");

      if (!userStr || !partnerId) {
        navigate("/select-user");
        return;
      }

      const user = JSON.parse(userStr);
      setCurrentUser(user);

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${partnerId}`
        );
        if (!response.ok) throw new Error("Kullanıcı bulunamadı");
        const data = await response.json();
        setChatPartner(data);

        await loadMessageHistory(user._id, partnerId);

        mqttService.connect();

        const privateChannel = mqttService.createPrivateChannel(
          user._id,
          partnerId
        );
        mqttService.subscribe(privateChannel, (messageData) => {
          // Sadece karşıdan gelen mesajları ekle
          if (messageData.senderId !== user._id) {
            setMessages((prev) => [...prev, messageData]);
          }
        });

        return () => {
          mqttService.unsubscribe(privateChannel);
        };
      } catch (err) {
        setError(err.message);
        console.error("Hata:", err);
      }
    };

    init();
  }, [navigate]);

  const sendMessage = async () => {
    if (!message.trim() || !chatPartner) return;

    const messageData = {
      message: message,
      sender: currentUser.username,
      senderId: currentUser._id,
      receiverId: chatPartner._id,
      senderName: currentUser.username,
    };

    try {
      // Mesajı veritabanına kaydet
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser._id,
          senderName: currentUser.username,
          receiverId: chatPartner._id,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Mesaj gönderilemedi");
      }

      // Mesajı MQTT üzerinden gönder
      const privateChannel = mqttService.createPrivateChannel(
        currentUser._id,
        chatPartner._id
      );
      mqttService.publish(privateChannel, messageData);

      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    } catch (err) {
      console.error("Mesaj gönderilirken hata:", err);
      setError("Mesaj gönderilemedi");
    }
  };

  const handleLogout = () => {
    mqttService.disconnect(); // MQTT bağlantısını kapat
    localStorage.clear(); // Tüm localStorage'ı temizle
    navigate("/"); // Ana giriş sayfasına yönlendir
  };

  if (error) {
    return (
      <div className="chat-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/select-user")}>Geri Dön</button>
      </div>
    );
  }

  if (isLoading || !currentUser || !chatPartner) {
    return <div className="chat-container">Yükleniyor...</div>;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
        <h2>Hoş Geldin {currentUser.username}</h2>
        <p className="chat-partner">Sohbet: {chatPartner.username}</p>
      </div>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              (msg.senderId || msg.userId) === currentUser._id
                ? "sent"
                : "received"
            }`}
          >
            <div className="message-header">
              <span className="sender">{msg.senderName || msg.sender}</span>
            </div>
            <div className="content">{msg.message}</div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gönder</button>
      </div>
    </div>
  );
};

export default Chat;
