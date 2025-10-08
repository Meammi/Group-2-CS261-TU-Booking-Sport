export default function Home() {
  return (
    <div className="bg-white-100 flex items-center justify-center min-h-screen">
      <div className="relative border-2 border-black rounded-[10px] px-[20px] pt-[40px] pb-[20px] w-[300px] bg-white">
        <h2 style={{ fontFamily: "'Spectral', serif" }}
        className="absolute -top-[15px] left-[100px] -translate-x-1/2 bg-gray-50 px-[10px] font-bold text-2xl">
        LOG-IN
        </h2>

        <form className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail / ID*</label>
            <div className="relative">
              <input type="email" id="email" placeholder="your@dome.tu.ac.th"
                className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              <span className="absolute right-3 top-2.5 text-gray-400">📧</span>
            </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <div className="relative">
              <input type="password" id="password" placeholder="••••••••"
              className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              <span className="absolute right-3 top-2.5 text-gray-400">🔑</span>
            </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox text-black" />
          <span>Remember me</span>
          </label>
          <a href="#" className="text-black hover:underline">Forgot Password?</a>
        </div>

        <button type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200">
          Log-in
        </button>
    </form>
  </div>
</div>
  );
}