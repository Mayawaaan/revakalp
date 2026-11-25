import React, { useCallback, useEffect, useState } from "react";
import { User, Trash2, Users, Loader2, Search } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import AdminPagination from "../../components/admin/AdminPagination";

const UserManagement = () => {
  const { showToast } = useStore();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter !== "All") params.role = roleFilter;

      const res = await axios.get("/api/admin/users", { params });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotal(res.data.length);
        setTotalPages(res.data.length > 0 ? 1 : 0);
      } else {
        setUsers(res.data?.users || []);
        setTotal(Number(res.data?.total) || 0);
        setPage(Number(res.data?.page) || 1);
        setTotalPages(Number(res.data?.totalPages) || 0);
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1 font-semibold">
            People
          </p>
          <h1 className="text-3xl font-serif text-[#38131E]">User Management</h1>
          <p className="text-[#1A1718]/70 text-sm mt-1">
            Manage users and admin access
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#38131E] text-[#F1D889] px-5 py-2.5 rounded-full text-sm border border-[#D4AF63]/40">
          <Users size={15} />
          {total} Users
        </div>
      </div>

      {/* SEARCH & ROLE FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6A6E]"
          />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users by name or email…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#38131E]/20 rounded-xl text-sm text-[#1A1718] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          aria-label="Filter users by role"
          className="border border-[#38131E]/20 rounded-xl px-3.5 py-2.5 text-sm bg-white text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
        >
          <option value="All">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white border border-[#38131E]/12 rounded-2xl overflow-hidden shadow-xs">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-[#38131E]/10">
            <thead className="bg-[#F7F1E5]/70">
              <tr>
                {["User", "Email", "Role", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[11px] uppercase tracking-wider text-[#38131E]/70 font-semibold ${
                      i === 3 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              key={`${page}-${limit}-${roleFilter}`}
              className="rk-admin-enter divide-y divide-[#38131E]/8"
            >
              {users.map((user) => (
                <tr key={user._id} className="rk-admin-row hover:bg-[#F7F1E5]/40">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#38131E]/10 flex items-center justify-center">
                      <User size={15} className="text-[#38131E]" />
                    </div>
                    <span className="font-medium text-[#38131E]">{user.fullName}</span>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#1A1718]/75">{user.email}</td>

                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-[#D4AF63] ${
                        user.role === "admin"
                          ? "border-[#38131E] text-[#38131E] bg-[#F7F1E5]"
                          : "border-[#38131E]/20 text-[#1A1718] bg-white"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user._id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!users.length && !loading && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-[#1A1718]/50">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[#38131E]/10">
          {users.map((user) => (
            <div key={user._id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#38131E]/10 flex items-center justify-center">
                    <User size={15} className="text-[#38131E]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#38131E]">{user.fullName}</p>
                    <p className="text-sm text-[#1A1718]/65">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="w-full text-sm rounded-xl px-3 py-2 border border-[#38131E]/20 bg-white text-[#38131E]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10 text-[#38131E] gap-2">
            <Loader2 size={18} className="animate-spin" /> Loading users…
          </div>
        )}

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          itemLabel="users"
        />
      </div>
    </div>
  );
};

export default UserManagement;
