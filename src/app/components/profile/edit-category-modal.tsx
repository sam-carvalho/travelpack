"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function EditCategoryModal({
  isOpen,
  onClose,
  onSave,
  initialName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  initialName: string;
}) {
  const [newName, setNewName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setNewName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSave = () => {
    if (!newName.trim()) return;
    try {
      onSave(newName.trim());
      toast.success("Category updated");
      onClose();
    } catch {
      toast.error("Failed to update category");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded bg-white p-6 shadow-xl">
          <DialogTitle className="mb-4 text-lg font-semibold">
            Edit Category
          </DialogTitle>

          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="cursor-pointer rounded px-4 py-2 text-gray-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
