import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signInStart,
  signOutFailure,
  signOutSuccess,
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

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGEBB_API_KEY
        }`,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
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
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log("updated data", data);
      dispatch(updateUserSuccess(data));
      toast.success("User updated successfully!");
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
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
      toast.success("Signed out successfully!");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">
          <span className="block text-indigo-600">My</span>
          <span className="block text-gray-700">Profile</span>
        </h1>
        <form onSubmit={handleSubit} className="space-y-6">
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
              className="rounded-full h-32 w-32 object-cover cursor-pointer shadow-lg border-4 border-indigo-300 hover:scale-105 transition-transform"
            />
          </div>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-gray-700 font-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                defaultValue={currentUser.username}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="New Password"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg uppercase hover:bg-indigo-700 transition-colors disabled:opacity-70"
            disabled={loading || fileLoading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <Link
            className="w-full block text-center bg-gray-700 text-white py-3 rounded-lg uppercase font-bold hover:bg-green-700 transition-colors"
            to={"/create-listing"}
          >
            Create Listing
          </Link>
        </form>
        {FileError && (
          <div className="text-red-500 mt-4 text-center">
            Error: {FileError}
          </div>
        )}
        {error && <p className="text-red-600 mt-5 text-center">{error}</p>}
        <div className="flex justify-between mt-8 text-sm">
          <span
            onClick={handleDeleteUser}
            className="text-red-600 font-medium cursor-pointer hover:underline"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
