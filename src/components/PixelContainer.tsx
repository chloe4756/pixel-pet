export default function PixelContainer({ children, showFeedingAnimation, foodType, showPet = true, isDarkMode = false, showPettingAnimation = false, showHeartAnimation = false }: { children: React.ReactNode; showFeedingAnimation: boolean; foodType: 'fishy' | 'milk'; showPet?: boolean; isDarkMode?: boolean; showPettingAnimation?: boolean; showHeartAnimation?: boolean }) {
  return (
    <div className="w-full max-w-md mx-auto scale-125 -mt-24">
      <div className="bg-gradient-to-b from-pink-200 to-rose-300 p-4 rounded-3xl border-4 border-pink-400 shadow-lg">
        <div className="bg-gradient-to-b from-pink-50 to-rose-100 rounded-2xl border-2 border-rose-400 overflow-hidden relative">
          {children}
          {showPet && (
            <div className="absolute inset-0 flex items-end justify-center pb-28 pointer-events-none z-10">
              <div className="group cursor-pointer pointer-events-auto relative">
                <img 
                  src="/kitty.png" 
                  alt="Pet" 
                  className={`w-32 h-32 object-contain transition-opacity duration-200 ${showPettingAnimation ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                  style={{ imageRendering: "pixelated" }}
                />
                <img 
                  src="/sleepy.png" 
                  alt="Sleepy Pet" 
                  className={`w-32 h-32 object-contain absolute top-0 left-0 transition-opacity duration-200 ${showPettingAnimation ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          )}
          {showFeedingAnimation && (
            <div className="absolute bottom-36 right-24 transform -translate-y-1/2 animate-bounce">
              <img 
                src={foodType === 'fishy' ? '/fishy.png' : '/milk.png'} 
                alt={foodType === 'fishy' ? 'Fish food' : 'Milk'} 
                className="w-12 h-12 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          )}
          {showHeartAnimation && (
            <div className="absolute bottom-36 right-20 transform -translate-y-1/2 animate-bounce">
              <img 
                src="/heart.png" 
                alt="Heart" 
                className="w-12 h-12 object-contain animate-pulse"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}