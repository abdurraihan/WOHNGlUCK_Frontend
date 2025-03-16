import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileLoading, setLoading] = useState(false);
  const [FileError, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    avatar: currentUser.avatar,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null); // Clear previous errors

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGEBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to get error details from API
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Image URL:", data.data.url);

        setFormData({ ...formData, avatar: data.data.url });
      } else {
        throw new Error(data.error.message);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log("updatet data", data);
      dispatch(updateUserSuccess(data));
      toast.success("user update successfully !");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("user delete successfully !");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="p-6 max-w-lg w-full bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Profile
          </h1>

          <form onSubmit={handleSubit} className="flex flex-col gap-5">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <div className="flex justify-center">
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt="Profile"
                className="rounded-full h-32 w-32 object-cover cursor-pointer shadow-md hover:scale-105 transition-all border-2 border-gray-300"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                defaultValue={currentUser.username}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="New Password"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                onChange={handleChange}
              />
            </div>

            <button
              className="bg-slate-700 text-white font-medium rounded-lg p-3 uppercase hover:bg-slate-800 transition-all disabled:opacity-80"
              disabled={loading || fileLoading}
            >
              {loading ? "Uploading..." : "Update Profile"}
            </button>
          </form>

          {FileError && (
            <div className="text-red-500 mt-4">Error: {FileError}</div>
          )}

          <p className="text-red-700 mt-5">{error ? error : ""}</p>

          <div className="flex justify-between mt-6 text-sm">
            <span
              onClick={handleDeleteUser}
              className="text-red-600 font-medium cursor-pointer hover:underline"
            >
              Delete Account
            </span>
            <span className="text-red-600 font-medium cursor-pointer hover:underline">
              Sign Out
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
