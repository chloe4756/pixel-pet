'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-pink-50 border-4 border-pink-400 rounded-xl p-6 max-w-md text-center">
        <h2 className="text-rose-600 font-bold text-lg mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold"
        >
          Try again
        </button>
      </div>
    </div>
  )
}