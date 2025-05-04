export default function CodeExample({ code }: { code: string }) {
    return (
      <div className="my-4 rounded-lg bg-gray-100 border border-gray-300 p-4 text-sm overflow-auto whitespace-pre-wrap">
        <pre>{code}</pre>
      </div>
    );
  }