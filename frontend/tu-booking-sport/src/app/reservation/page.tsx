import Header from "@/components/Header";
import ReservationCard from "@/components/ReservationCard";
import ReservationHeader from "@/components/ReservationHeader";


const reservations = [
  { id: 1, title: "Badminton", location: "Interzone", total: 20 },
  { id: 2, title: "Badminton", location: "Gym 4", total: 13 },
  { id: 3, title: "Karaoke", location: "Melody Sphere", total: 5 },
  { id: 4, title: "Music Room", location: "Melody Sphere", total: 2 },
];

export default function ReservationPage() {
  return (

    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-md bg-white min-h-screen">
        
        <Header studentId="6709616376" />
        
        <main className="p-4">
          
          <ReservationHeader />
          
          <div className="space-y-4">
            {reservations.map((item) => (
              <ReservationCard 
                key={item.id}
                title={item.title}
                location={item.location}
                total={item.total}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}

