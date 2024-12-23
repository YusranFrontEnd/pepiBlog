import React, { useState, useEffect } from "react";
import axios from "axios";

function PostList({ isAdmin, setIsAdmin }) {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching posts!",
          error.response ? error.response.data : error.message
        );
      });
  }, []);

  const handleAddPost = () => {
    if (!newPostTitle || !newPostContent) {
      alert("Title and content are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newPostTitle);
    formData.append("content", newPostContent);
    if (newPostImage) {
      formData.append("image", newPostImage);
    }

    axios
      .post("http://localhost:5000/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setPosts((prevPosts) => [...prevPosts, response.data]);
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostImage(null);
      })
      .catch((error) => {
        console.error(
          "Error adding post!",
          error.response ? error.response.data : error.message
        );
      });
  };

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:5000/api/posts/${postId}`)
      .then(() => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      })
      .catch((error) => {
        console.error(
          "Error deleting post!",
          error.response ? error.response.data : error.message
        );
      });
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const togglePostContent = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="flex container text-sm mx-auto p-4 space-x-4">
      <div className="w-1/4 overflow-y-auto h-screen">
        {" "}
        {/* Sidebar yang dapat discroll */}
        <img className="h-64 w-96 object-cover" src="/pep.jpg" alt="jpg" />
        <h1 className="text-lg font-semibold text-gray-800 font-poppins text-center mb-6">
          Srideviyanti Blog
        </h1>
        <a
          href="http://www.instagram.com/sri_deviyantii"
          target="_blank"
          rel="noopener noreferrer"
        >
          @instagram
        </a>
        <p> @Membaca Sampai Ujung halaman</p>
        <p>@BlueLover</p>
        {isAdmin && (
          <div className="mb-4">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Judul Post"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Konten Post"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
              type="file"
              onChange={(e) => setNewPostImage(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <button
              onClick={handleAddPost}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Tambah Post
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-2"
            >
              Logout
            </button>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-center mb-6 mt-4">Posts</h2>
        <div className="space-y-4  text-sm">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white  p-2 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
              onClick={() => togglePostContent(post.id)}
            >
              <h3 className=" text-sm font-semibold text-blue-500">
                {post.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="w-3/4 overflow-y-auto h-screen">
        {" "}
        {/* Layout kanan yang dapat discroll */}
        {expandedPostId ? (
          <div className="bg-white p-6 border rounded-lg shadow-md text-center ">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">
              {posts.find((post) => post.id === expandedPostId)?.title}
            </h3>
            <div className="flex flex-col items-center justify-center">
              {posts.find((post) => post.id === expandedPostId)?.image && (
                <img
                  src={`http://localhost:5000${
                    posts.find((post) => post.id === expandedPostId)?.image
                  }`}
                  alt="Post"
                  className="w-1/2 h-auto object-cover mb-4"
                />
              )}
              <p className="text-lg text-left prose max-w-none flex-grow">
                {posts.find((post) => post.id === expandedPostId)?.content}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDeletePost(expandedPostId)}
                className="mt-4 bg-red-500 text-white py-1 px-4 rounded"
              >
                Hapus
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Pilih post untuk membaca</p>
        )}
      </div>
    </div>
  );
}

export default PostList;
