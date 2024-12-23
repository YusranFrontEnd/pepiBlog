import React, { useState } from "react";

function Login({ setIsAdmin }) {
  const [username, setUsername] = useState(""); // Menyimpan username
  const [password, setPassword] = useState(""); // Menyimpan password
  const [showLogin, setShowLogin] = useState(false); // Menyimpan apakah form login harus ditampilkan

  // Fungsi login
  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsAdmin(true); // Ubah status admin menjadi true jika kredensial benar
    } else {
      alert("Login gagal, periksa kredensial Anda!");
    }
  };

  return (
    <div className="max-w-64 mx-auto mb-8 p-4 border rounded-lg shadow-lg ml-9">
      {/* Button untuk menampilkan login form */}
      {!showLogin && (
        <button
          onClick={() => setShowLogin(true)}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mb-4"
        >
          Admin Only
        </button>
      )}

      {/* Form login hanya muncul jika showLogin true */}
      {showLogin && (
        <>
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mb-4"
          >
            Login
          </button>
          {/* Tombol tutup untuk menyembunyikan form login */}
          <button
            onClick={() => setShowLogin(false)}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}

export default Login;
