import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="p-6 max-w-lg w-full bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Profile
          </h1>

          <form className="flex flex-col gap-5">
            {/* Profile Avatar */}
            <div className="flex justify-center">
              <img
                src={currentUser?.avatar || "/default-avatar.png"} // Fallback image
                alt="Profile"
                className="rounded-full h-32 w-32 object-cover cursor-pointer shadow-md hover:scale-105 transition-all border-2 border-gray-300"
              />
            </div>

            {/* Input Fields */}
            <div className="flex flex-col">
              <label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
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
              />
            </div>

            {/* Update Button */}
            <button className="bg-slate-700 text-white font-medium rounded-lg p-3 uppercase hover:bg-slate-800 transition-all disabled:opacity-80">
              Update Profile
            </button>
          </form>

          {/* Delete & Sign Out */}
          <div className="flex justify-between mt-6 text-sm">
            <span className="text-red-600 font-medium cursor-pointer hover:underline">
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
