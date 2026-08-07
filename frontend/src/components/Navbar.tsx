function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-black border-b border-yellow-500/20">
      <h1 className="text-2xl font-extrabold text-yellow-400">
        Amaan Capital
      </h1>

      <div className="hidden md:flex gap-8 text-gray-300">
        <a href="#" className="hover:text-yellow-400">Home</a>
        <a href="#" className="hover:text-yellow-400">Markets</a>
        <a href="#" className="hover:text-yellow-400">Investments</a>
        <a href="#" className="hover:text-yellow-400">About</a>
        <a href="#" className="hover:text-yellow-400">Contact</a>
      </div>

      <div className="flex gap-3">
        <button className="border border-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">
          Login
        </button>

        <button className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
