import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSelect.css";

const UserSelect = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      fetchUsers(user._id);
    } catch (err) {
      console.error("Kullanıcı verisi işlenirken hata:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchUsers = async (currentUserId) => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error("Kullanıcılar getirilemedi");
      }

      const data = await response.json();
      console.log("Gelen kullanıcılar:", data);
      setUsers(data.filter((user) => user._id !== currentUserId));
    } catch (err) {
      console.error("Kullanıcılar yüklenirken hata:", err);
      setError("Kullanıcı listesi yüklenemedi");
    }
  };

  const handleStartChat = () => {
    if (!selectedUser) {
      setError("Lütfen bir kullanıcı seçin");
      return;
    }

    try {
      localStorage.setItem("chatPartnerId", selectedUser);
      navigate("/chat");
    } catch (err) {
      console.error("Sohbet başlatılırken hata:", err);
      setError("Sohbet başlatılamadı");
    }
  };

  if (!currentUser) {
    return <div className="select-container">Yükleniyor...</div>;
  }

  return (
    <div className="user-page">
      <div className="select-container">
        <h1>Sohbet Başlat</h1>
        <p>Hoş geldin {currentUser.username}</p>

        {error && <div className="error-message">{error}</div>}

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="user-dropdown"
        >
          <option value="">Kullanıcı seçin</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        <button
          onClick={handleStartChat}
          className="start-button"
          disabled={!selectedUser}
        >
          Sohbete Başla
        </button>

        <button onClick={handleLogout} className="logout-button-bottom">
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default UserSelect;
