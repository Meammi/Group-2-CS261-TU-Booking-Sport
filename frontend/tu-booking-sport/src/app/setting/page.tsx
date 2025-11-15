import BackgroundLayout from "@/components/BGlayout";
import {
  UserCircleIcon,
  SwatchIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SettingPage() {
  return (
    <BackgroundLayout>
      <div className="relative min-h-screen font-sans">
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#000_0d_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative flex flex-col items-center pt-10 px-6">
          <Link
            href="/homepage"
            className="absolute left-4 top-8 rounded-full bg-white/80 border border-gray-300 shadow p-2 hover:bg-white hover:border-gray-400 hover:shadow-md transition"
            aria-label="Back to homepage"
          >
            <ArrowLeftIcon className="h-5 w-5 text-tu-navy" />
          </Link>
          <h1 className="text-3xl font-extrabold text-tu-navy drop-shadow-sm">
            Setting
          </h1>

          <div className="mt-8 w-full max-w-xs rounded-2xl bg-white/70 border border-gray-300/70 shadow-xl backdrop-blur p-4 space-y-3">
            <div className="group cursor-pointer w-full rounded-xl bg-white/90 border-2 border-gray-300 shadow-sm backdrop-blur px-4 py-3 text-gray-900 font-semibold flex items-center justify-between hover:shadow-lg hover:border-gray-400 hover:bg-white hover:ring-1 hover:ring-gray-300 transition-all duration-200">
              <span className="flex items-center gap-3">
                <span className="bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  <UserCircleIcon className="h-5 w-5" />
                </span>
                Account
              </span>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 transition-all duration-200 group-hover:text-gray-600 group-hover:translate-x-0.5" />
            </div>
            <div className="group cursor-pointer w-full rounded-xl bg-white/90 border-2 border-gray-300 shadow-sm backdrop-blur px-4 py-3 text-gray-900 font-semibold flex items-center justify-between hover:shadow-lg hover:border-gray-400 hover:bg-white hover:ring-1 hover:ring-gray-300 transition-all duration-200">
              <span className="flex items-center gap-3">
                <span className="bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
                  <SwatchIcon className="h-5 w-5" />
                </span>
                Theme
              </span>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 transition-all duration-200 group-hover:text-gray-600 group-hover:translate-x-0.5" />
            </div>
            <div className="group cursor-pointer w-full rounded-xl bg-white/90 border-2 border-gray-300 shadow-sm backdrop-blur px-4 py-3 text-gray-900 font-semibold flex items-center justify-between hover:shadow-lg hover:border-gray-400 hover:bg-white hover:ring-1 hover:ring-gray-300 transition-all duration-200">
              <span className="flex items-center gap-3">
                <span className="bg-gradient-to-br from-emerald-500 via-lime-500 to-amber-400 bg-clip-text text-transparent">
                  <ShieldCheckIcon className="h-5 w-5" />
                </span>
                Privacy
              </span>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 transition-all duration-200 group-hover:text-gray-600 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

      </div>
    </BackgroundLayout>
  );
}
