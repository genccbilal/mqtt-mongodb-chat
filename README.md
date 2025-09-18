# MQTT Tabanlı Gerçek Zamanlı Sohbet Uygulaması

MQTT protokolü kullanılarak geliştirilmiş, MongoDB veritabanı ile entegre edilmiş gerçek zamanlı bir sohbet uygulamasıdır.

## 📁 Proje Yapısı

```
mqtt-mongodb-chat/
├── frontend/                    # Frontend uygulaması
│   ├── src/                     # Kaynak kodlar
│   │   ├── pages/               # Sayfa bileşenleri
│   │   │   ├── Chat.jsx         # Sohbet sayfası
│   │   │   ├── Login.jsx        # Giriş sayfası
│   │   │   └── UserSelect.jsx   # Kullanıcı seçim sayfası
│   │   ├── App.jsx              # Ana uygulama bileşeni
│   │   ├── App.css              # Ana stil dosyası
│   │   ├── mqtt.jsx             # MQTT bağlantı yönetimi
│   │   ├── main.jsx             # Uygulama giriş noktası
│   │   └── index.css            # Genel stil dosyası
│   └── package.json             # Frontend bağımlılıkları
│
│
├── backend/                     # Backend sunucusu
│   ├── server.js                # MQTT sunucu kodu
│   ├── models/                  # MongoDB modelleri
│   │   ├── User.js              # Kullanıcı modeli
│   │   └── Message.js           # Mesaj modeli
│   ├── controllers/             # İş mantığı kontrolcüleri
│   │   ├── userController.js    # Kullanıcı işlemleri
│   │   └── messageController.js # Mesaj işlemleri
│   ├── config/                  # Yapılandırma dosyaları
│   │   └── db.js                # MongoDB bağlantı ayarları
│   └── package.json             # Backend bağımlılıkları
│
└── README.md                    # Proje dokümantasyonu
```

## 🚀 Özellikler

- Gerçek zamanlı mesajlaşma (MQTT protokolü)
- Kullanıcı seçimi ve eşleştirme
- Özel mesajlaşma kanalları
- Mesaj geçmişi (MongoDB ile saklama)
- Kullanıcı bilgilerinin veritabanında tutulması

## 🛠️ Teknolojiler

### Backend

- Node.js
- MQTT.js
- MongoDB
- Mongoose (MongoDB ODM)
- Express.js

### Frontend

- React
- React Router
- MQTT.js Client

## 📋 Gereksinimler

- Node.js
- MQTT Broker (örn. Mosquitto)
- MongoDB

## 🔧 Kurulum

1. Projeyi klonlayın:

```bash
git clone [proje-url]
```

2. MongoDB'yi kurun ve başlatın:

   - MongoDB'yi [resmi sitesinden](https://www.mongodb.com/try/download/community) indirin
   - MongoDB servisini başlatın

3. Backend kurulumu:

```bash
cd backend
npm install
```

4. Frontend kurulumu:

```bash
cd frontend
npm install
```

5. MQTT Broker'ı başlatın (varsayılan port: 1883)

6. Backend'i başlatın:

```bash
cd backend
node server.js
```

7. Frontend'i başlatın:

```bash
cd frontend
npm run dev
```

## 💻 Kullanım

### Başlangıç

1. MongoDB servisinin çalıştığından emin olun
2. Backend sunucusunu başlatın
3. Frontend uygulamasını başlatın
4. İki farklı tarayıcı sekmesi açın
5. Her sekmede `http://localhost:5173` adresine gidin
6. İlk sekmede bir kullanıcı seçin (örn: "Bilal")
7. İkinci sekmede farklı bir kullanıcı seçin (örn: "Ahmet")
8. Her iki sekmede de "Sohbete Başla" butonuna tıklayın
9. Artık iki kullanıcı arasında gerçek zamanlı mesajlaşma yapabilirsiniz

### Örnek Kullanım Senaryosu

#### Kullanıcı 1 (Bilal):

1. Tarayıcıda `http://localhost:5173` adresine git
2. Kullanıcı seçim ekranından "Bilal"i seç
3. Sohbet etmek istediğin kullanıcı olarak "Ahmet"i seç
4. "Sohbete Başla" butonuna tıkla
5. Mesaj yazma alanına mesajını yaz
6. "Gönder" butonuna tıkla

#### Kullanıcı 2 (Ahmet):

1. Farklı bir tarayıcı sekmesinde `http://localhost:5173` adresine git
2. Kullanıcı seçim ekranından "Ahmet"i seç
3. Sohbet etmek istediğin kullanıcı olarak "Bilal"i seç
4. "Sohbete Başla" butonuna tıkla
5. Gelen mesajları gör ve yanıtla

```

## 📧 İletişim

- 📧 E-posta: bilalgnc34@gmail.com
- 🔗 LinkedIn: [Bilal Genç](https://www.linkedin.com/in/bilalgnc/)
- 💻 GitHub: [genccbilal](https://github.com/genccbilal/)
```
