import React from "react";

function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  data,
  setters,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">
          Update Product
        </h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {/* Input Fields */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">
              Nama :
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setters.setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                Harga :
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => setters.setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                Stok :
              </label>
              <input
                type="number"
                value={data.stock}
                onChange={(e) => setters.setStock(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">
              Kategori :
            </label>
            <select
              value={data.category}
              onChange={(e) => setters.setCategory(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductModal;
