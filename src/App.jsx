import React, { useState } from "react";
import PostList from "./PostList";
import Login from "./Login";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      {/* PostList adalah halaman default yang selalu tampil */}
      <PostList isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      {/* Menampilkan Login jika belum login */}
      {!isAdmin && <Login setIsAdmin={setIsAdmin} />}
    </div>
  );
}

export default App;
