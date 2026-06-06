import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { User, Trash2, Users, Loader2 } from "lucide-react";
import useStore from "../../store/store";

const UserManagement = () => {
  const { showToast } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role });
      showToast("User role updated", "success");
      fetchUsers();
    } catch {
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
          <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">People</p>
          <h1 className="text-3xl font-serif text-pink-900">User Management</h1>
          <p className="text-pink-600 text-sm mt-1">Manage users and admin access</p>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-[#c9487c] to-[#9d2a52] text-white px-5 py-2.5 rounded-full text-sm shadow-lg shadow-pink-200">
          <Users size={15} />
          {users.length} Users
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-pink-50">
            <thead className="bg-pink-50/80">
              <tr>
                {["User", "Email", "Role", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-xs uppercase tracking-wider text-pink-500 font-semibold ${i === 3 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-pink-50/40 transition-colors">

                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center">
                      <User size={15} className="text-[#c9487c]" />
                    </div>
                    <span className="font-medium text-pink-900">{user.fullName}</span>
                  </td>

                  <td className="px-6 py-4 text-sm text-pink-600">{user.email}</td>

                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                        user.role === "admin"
                          ? "border-[#c9487c] text-[#c9487c] bg-pink-50"
                          : "border-pink-200 text-pink-700 bg-white"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-600 text-sm transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!users.length && !loading && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-pink-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {users.map((user) => (
            <div key={user._id} className="border-t border-pink-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center">
                    <User size={15} className="text-[#c9487c]" />
                  </div>
                  <div>
                    <p className="font-medium text-pink-900">{user.fullName}</p>
                    <p className="text-sm text-pink-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={`w-full text-sm rounded-xl px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                    user.role === "admin"
                      ? "border-[#c9487c] text-[#c9487c] bg-pink-50"
                      : "border-pink-200 text-pink-700"
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
          <div className="flex items-center justify-center py-10 text-pink-400 gap-2">
            <Loader2 size={18} className="animate-spin" /> Loading users…
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;