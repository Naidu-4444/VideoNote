import { Link } from "lucide-react";

interface UrlFormProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  isLoading: boolean;
  handleGenerate: () => void;
}

export function UrlForm({
  videoUrl,
  setVideoUrl,
  isLoading,
  handleGenerate,
}: UrlFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleGenerate();
      }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-grow">
        <Link
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste a YouTube video URL"
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !videoUrl}
        className="px-6 py-3 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
      >
        Generate
      </button>
    </form>
  );
}
