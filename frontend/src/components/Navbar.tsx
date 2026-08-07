function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-black">
      <h1 className="text-3xl font-bold text-yellow-400">
        Amaan Capital
      </h1>

      <div className="hidden md:flex items-center gap-8 text-white">
        <a href="#">Home</a>
        <a href="#">Markets</a>
        <a href="#">Investments</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <div className="flex gap-3">
        <button className="px-5 py-2 border border-gray-700 rounded-lg text-white hover:border-yellow-400">
          Login
        </button>

        <button className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300">
          Create Account
        </button>
      </div>
    </nav>
  )
}

export default Navbar
