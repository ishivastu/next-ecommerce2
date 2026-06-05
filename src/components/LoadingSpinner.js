export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="relative">
        {/* Ring 1 */}
        <div className="w-28 h-28 rounded-full border-4 border-transparent border-t-emerald-500 border-r-green-400 animate-spin"></div>

        {/* Ring 2 */}
        <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-emerald-400 border-l-green-300 animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>

        {/* Ring 3 */}
        <div className="absolute inset-6 rounded-full border-4 border-transparent border-t-green-300 animate-spin [animation-duration:2s]"></div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.9)]"></div>
        </div>
      </div>

      <p className="mt-8 text-emerald-400 font-medium tracking-widest animate-pulse">
        LOADING...
      </p>
    </div>
  );
}
