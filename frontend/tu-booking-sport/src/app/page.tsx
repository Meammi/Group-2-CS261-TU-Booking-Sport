export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative border-2 border-black rounded-[10px] px-[20px] pt-[40px] pb-[20px] w-[300px] bg-gray-50">
        <h2 className="absolute -top-[15px] left-[100px] -translate-x-1/2 px-[10px] font-bold text-2xl bg-gray-50">
        LOG-IN
        </h2>

        <form className="space-y-5">
        <div className="relative">
          <label htmlFor="email" 
            className="absolute -top-2 left-3 text-sm font-medium text-gray-700 bg-gray-50 px-1 z-10">
            E-mail / ID*</label>
            <div className="relative">
              <input type="email" id="email" placeholder="your@dome.tu.ac.th"
                className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none" />
              <span className="absolute right-3 top-2.5 text-gray-400">📧</span>
            </div>
        </div>

        <div className="relative">
          <label htmlFor="password"
            className="absolute -top-2 left-3 text-sm font-medium text-gray-700 bg-gray-50 px-1 z-10">
            Password*</label>
            <div className="relative">
              <input type="password" id="password" placeholder="Your Password"
              className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none"/>
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