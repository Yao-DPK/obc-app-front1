// CustomLoader.jsx
const CustomLoader = () => {
  return (
    <>
      {/* Styles CSS de l'animation */}
      <style>{`
        @keyframes loaderBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
        @keyframes loaderShadow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(0.5); opacity: 0.05; }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        @keyframes loaderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-loader-bounce {
          animation: loaderBounce 1s ease-in-out infinite;
        }
        .animate-loader-shadow {
          animation: loaderShadow 1s ease-in-out infinite;
        }
        .animate-loader-pulse {
          animation: loaderPulse 1.2s ease-in-out infinite;
        }
        .animate-loader-spin {
          animation: loaderSpin 2s linear infinite;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="relative flex flex-col items-center">
          {/* Ballon de basket qui rebondit */}
          <div className="relative flex items-center justify-center">
            <div className="animate-loader-bounce">
              <svg
                width="90"
                height="90"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Corps du ballon */}
                <circle cx="50" cy="50" r="45" fill="#F57C00" stroke="#1B1B1B" strokeWidth="3" />
                {/* Lignes verticales et horizontales */}
                <path d="M50 5 L50 95" stroke="#1B1B1B" strokeWidth="2.5" />
                <path d="M5 50 L95 50" stroke="#1B1B1B" strokeWidth="2.5" />
                {/* Arcs de cercle */}
                <path d="M50 5 C25 25 25 75 50 95" stroke="#1B1B1B" strokeWidth="2.5" fill="none" />
                <path d="M50 5 C75 25 75 75 50 95" stroke="#1B1B1B" strokeWidth="2.5" fill="none" />
              </svg>
            </div>
            {/* Ombre portée sous le ballon */}
            <div className="absolute -bottom-2 w-16 h-3 bg-gray-400 rounded-full animate-loader-shadow"></div>
          </div>

          {/* Marque OBC */}
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-6xl font-extrabold tracking-tight text-green-700">O</span>
              <span className="text-6xl font-extrabold tracking-tight text-yellow-500">B</span>
              <span className="text-6xl font-extrabold tracking-tight text-green-700">C</span>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-500 tracking-[0.2em] uppercase">
              Olympic Basket Center
            </p>

            {/* Points de chargement */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              <span className="w-3 h-3 bg-green-600 rounded-full animate-loader-pulse"></span>
              <span
                className="w-3 h-3 bg-yellow-500 rounded-full animate-loader-pulse"
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span
                className="w-3 h-3 bg-green-600 rounded-full animate-loader-pulse"
                style={{ animationDelay: '0.4s' }}
              ></span>
            </div>

            <p className="mt-4 text-xs font-light text-gray-400 tracking-[0.3em] uppercase">
              Chargement...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomLoader;