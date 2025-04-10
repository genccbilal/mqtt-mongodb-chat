const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getUsers,
  getUser,
} = require("../controllers/userController");

// Kullanıcı oluştur
router.post("/users", createUser);

// Kullanıcı girişi
router.post("/users/login", login);

// Tüm kullanıcıları getir
router.get("/users", getUsers);

// Tek kullanıcı getir
router.get("/users/:id", getUser);

module.exports = router;
