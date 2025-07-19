"use client";

export function ToggleAddRowButton({
  showForm,
  onToggle,
}: {
  showForm: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="text-md cursor-pointer rounded-lg px-4 py-2 font-semibold text-gray-700 hover:text-blue-600"
    >
      {showForm ? "Cancel" : "+ Add Item"}
    </button>
  );
}
