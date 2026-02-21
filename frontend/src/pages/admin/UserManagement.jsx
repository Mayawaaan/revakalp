import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Shield,
  Trash2,
  Users
} from "lucide-react";
import useStore from "../../store/store";

const UserManagement = () => {
  const { showToast } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to fetch users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role });
      showToast("User role updated", "success");
      fetchUsers();
    } catch (error) {
      showToast("Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("This action is irreversible. Delete user?")) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      showToast("User deleted", "success");
      fetchUsers();
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage users and admin access
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm">
          <Users size={16} />
          {users.length} Users
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="hidden md:block">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">

                  {/* Name */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="font-medium text-gray-900">
                      {user.fullName}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className={`text-sm rounded-md px-3 py-1 border ${
                        user.role === "admin"
                          ? "border-red-300 text-red-700 bg-red-50"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!users.length && !loading && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {users.map((user) => (
            <div key={user._id} className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteUser(user._id)} className="text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={`w-full text-sm rounded-md px-3 py-2 border ${
                    user.role === "admin"
                      ? "border-red-300 text-red-700 bg-red-50"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-6 text-gray-500">
            Loading users…
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;