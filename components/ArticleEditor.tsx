export default function ArticleEditor() {
  // All custom UI imports have been removed and replaced with standard HTML
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Article Editor</h2>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Article Editor</h3>
      </div>
      <div className="p-4">
        <input placeholder="Article Title" className="w-full p-2 border rounded" />
        <textarea placeholder="Article Content" rows={10} className="w-full mt-4 p-2 border rounded" />
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save Article
        </button>
      </div>
    </div>
  );
}
