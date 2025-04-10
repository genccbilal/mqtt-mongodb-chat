import { useState, useEffect } from "react";
import { userService } from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
        setError("");
      } catch (error) {
        setError(error.message || "Kullanıcılar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="users-container">
      <h2>Kullanıcılar</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="users-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-item">
              <span className="username">{user.username}</span>
            </div>
          ))
        ) : (
          <div>Henüz kullanıcı bulunmuyor</div>
        )}
      </div>
    </div>
  );
};

export default Users;
