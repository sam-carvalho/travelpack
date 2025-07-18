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
      className="px-4 py-2 text-md font-semibold rounded-lg text-gray-700 hover:text-blue-600"
    >
      {showForm ? "Cancel" : "+ Add Item"}
    </button>
  );
}
