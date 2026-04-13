import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import axios from "../../utils/axiosInstance"; 
import useStore from "../../store/store";

const ManageTypes = () => {
  const { showToast } = useStore();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeType, setActiveType] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/types");
      setTypes(res.data);
    } catch {
      showToast("Failed to load types", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(false);
    setActiveType(null);
    setForm({ name: "", slug: "", category: "" });
    setImage(null);
    setExistingImage("");
    setModalOpen(true);
  };

  const openEdit = (type) => {
    setEditing(true);
    setActiveType(type);
    setForm({
      name: type.name,
      slug: type.slug,
      category: type.category,
    });
    setExistingImage(type.image || "");
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveType(null);
    setImage(null);
    setExistingImage("");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("slug", form.slug);
    data.append("category", form.category);

    if (image) data.append("image", image);
    if (!image && existingImage) data.append("existingImage", existingImage);

    try {
      if (editing) {
        await axios.put(`/api/admin/types/${activeType._id}`, data);
        showToast("Type updated", "success");
      } else {
        await axios.post("/api/admin/types", data);
        showToast("Type created", "success");
      }
      closeModal();
      fetchTypes();
    } catch {
      showToast("Failed to save type", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeType = async (_id) => {
    if (!window.confirm("Delete this type permanently?")) return;
    try {
      await axios.delete(`/api/admin/types/${_id}`);
      showToast("Type deleted", "success");
      fetchTypes();
    } catch {
      showToast("Failed to delete type", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Product Types</h1>
        <button
          onClick={openCreate}
          className="bg-gray-900 text-white px-6 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={16} />Add Type
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t._id} className="border-b">
                  <td className="px-6 py-4">{t.name}</td>
                  <td className="px-6 py-4 capitalize">{t.category}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{t.slug}</td>
                  <td className="px-6 py-4">
                    {t.image ? (
                      <img src={t.image} className="h-10 w-10 rounded-md" />
                    ) : (
                      <ImageIcon size={16} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(t)}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => removeType(t._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {types.map((t) => (
            <div key={t._id} className="border-b p-4">
              <div className="flex items-center gap-4">
                {t.image ? (
                  <img
                    src={t.image}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm capitalize text-gray-600">
                    {t.category}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t.slug}</p>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => openEdit(t)} className="text-gray-700">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => removeType(t._id)} className="text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={submitForm}
            className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4"
          >
            <input
              required
              placeholder="Type name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border px-3 py-2 w-full"
            />

            <input
              required
              placeholder="Slug (e.g. banarasi-saree)"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
              className="border px-3 py-2 w-full"
            />

            <input
              required
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="border px-3 py-2 w-full"
            />

            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

            {(image || existingImage) && (
              <img
                src={image ? URL.createObjectURL(image) : existingImage}
                className="h-20 w-20 rounded-md"
              />
            )}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="bg-gray-900 text-white px-4 py-2">
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageTypes;
