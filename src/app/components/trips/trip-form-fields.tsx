type FormData = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
};

export function TripFormFields({
  form,
  updateField,
  handleSubmit,
  error,
  buttonLabel,
}: {
  form: FormData | Partial<FormData>;
  updateField: (field: keyof FormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  buttonLabel: string;
}) {
  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby="form-error"
      className="mx-12 mb-20 max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg md:mx-auto"
    >
      <div className="mb-4">
        <label
          htmlFor="tripName"
          className="block text-sm font-medium text-gray-700"
        >
          Trip Name
        </label>
        <input
          id="tripName"
          type="text"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-400 px-4 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-gray-700"
        >
          Destination
        </label>
        <input
          id="destination"
          type="text"
          required
          value={form.destination}
          onChange={(e) => updateField("destination", e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-400 px-4 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="w-full">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            required
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-400 px-4 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            required
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-400 px-4 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-400 px-4 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {error && (
        <p id="form-error" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-medium text-white shadow transition-all duration-300 hover:to-pink-800"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
