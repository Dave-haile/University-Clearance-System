export default function Hero() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simplifying University Clearance, One Step at a Time
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Say goodbye to manual paperwork! Our digital clearance system streamlines
            the process for students, staff, and administrators.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-colors shadow-lg">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
            alt="Students using digital system"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}