
export const GoogleLoader = () => {
    return (
        // <div className="p-6 bg-white rounded-2xl shadow-lg w-64 h-64 flex items-center justify-center">
        <div className="relative w-8 h-8">
          <svg
            className="animate-rotate absolute inset-0 m-auto w-full h-full"
            viewBox="25 25 50 50"
          >
            <circle
              className="stroke-black animate-dash"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
    //   </div>
    );
  };