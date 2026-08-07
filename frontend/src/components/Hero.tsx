function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-black px-6 md:px-12 text-center">

      <div className="max-w-4xl">

        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
          The Future of
          <span className="text-yellow-400"> Digital Wealth </span>
          Starts Here
        </h2>

        <p className="mt-6 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Amaan Capital is a modern digital asset platform designed
          to help users explore cryptocurrency solutions, portfolio
          strategies, and the future of financial technology.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">

          <button className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition">
            Start Investing
          </button>

          <button className="border border-gray-700 px-8 py-4 rounded-full hover:border-yellow-400 transition">
            Learn More
          </button>

        </div>


        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-yellow-400 text-2xl font-bold">
              150+
            </h3>
            <p className="text-gray-400">
              Countries Reached
            </p>
          </div>


          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-yellow-400 text-2xl font-bold">
              24/7
            </h3>
            <p className="text-gray-400">
              Platform Access
            </p>
          </div>


          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-yellow-400 text-2xl font-bold">
              Global
            </h3>
            <p className="text-gray-400">
              Digital Finance
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;
