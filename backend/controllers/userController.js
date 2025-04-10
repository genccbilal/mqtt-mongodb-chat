const User = require("../models/User");

// Kullanıcı oluştur
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kullanıcı adı kontrolü
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      username,
      password,
    });

    await user.save();
    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu", user });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre hatalı" });
    }

    // Şifre kontrolü
    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre hatalı" });
    }

    // Kullanıcı bilgilerini gönder (şifre hariç)
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
    };

    res.json({ message: "Giriş başarılı", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Tüm kullanıcıları getir
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Tek kullanıcı getir
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Geçersiz kullanıcı ID'si" });
    }
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
};
