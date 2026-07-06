export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-300"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 animate-spin"></div>
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
          <div
            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="text-slate-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
