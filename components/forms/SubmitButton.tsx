export default function SubmitButton({ label }: { label: string }) {
    return (
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        {label}
      </button>
    );
  }