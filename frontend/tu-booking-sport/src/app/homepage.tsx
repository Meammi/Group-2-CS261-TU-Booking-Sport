import SportCard from "@/components/SportCard"; 

export default function HomePage() {
  return (

    <div className="max-w-md mx-auto bg-white min-h-screen p-4 font-nunito">

      {/* Header (ชั่วคราว) */}
      <header className="text-center my-4">
        <h1 className="text-lg font-bold">Welcome to TU Booking Sports</h1>
        <p className="text-sm text-gray-500">Book your sport!!!</p>
      </header>

      {/* Search Bar (ชั่วคราว) */}
      <div className="my-4 p-2 border rounded-md text-center text-gray-400">Search Bar Placeholder</div>

      {/* Announce Section (ชั่วคราว) */}
      <section className="my-8">
        <h2 className="text-xl font-bold text-center mb-4">Announce</h2>
        <div className="h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          Announce Image Placeholder
        </div>
      </section>

      {/**/}
      <section className="my-8">
        <h2 className="text-xl font-bold text-center mb-4">Sports</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* */}
          <SportCard title="Badminton" subtitle="Interzone" imageUrl="" />
          <SportCard title="Badminton" subtitle="Gym 4" imageUrl="" />
          <SportCard title="Music" subtitle="Karaoke" imageUrl="" />
          <SportCard title="Music" subtitle="Music Room" imageUrl="" />
        </div>
      </section>

      {/* Your Favorite Section (ชั่วคราว) */}
      <section className="my-8">
        <h2 className="text-xl font-bold text-center mb-4">Your Favorite</h2>
        <div className="p-4 border rounded-md text-center text-gray-400">Favorite Card Placeholder</div>
      </section>

    </div>
  );
}
