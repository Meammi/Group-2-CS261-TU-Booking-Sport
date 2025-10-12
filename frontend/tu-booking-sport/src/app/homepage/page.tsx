'use client'; 
import SportCard from "@/components/SportCard"; 
import Header from "@/components/Header";
import AnnouncementCard from "@/components/AnnouncementCard"; 
import CoverFlowCarousel from "@/components/Carousel"; // 1. Import Component ใหม่ของเรา

// สร้างข้อมูลจำลองสำหรับ Carousel
const announcementImages = [
  { id: 1, imageUrl: "/images/karaoke.jpg", alt: "Announcement 1" },
  { id: 2, imageUrl: "/images/announce1.jpg", alt: "Announcement 2" },
  { id: 3, imageUrl: "/images/announce2.jpg", alt: "Announcement 3" },
];

const sportsData = [
  { id: 1, title: "Badminton", subtitle: "Interzone", imageUrl: "/images/interzone.jpg" },
  { id: 2, title: "Badminton", subtitle: "Gym 4", imageUrl: "/images/gym4.jpg" },
  { id: 3, title: "Music", subtitle: "Karaoke", imageUrl: "/images/karaoke.jpg" },
  { id: 4, title: "Music", subtitle: "Music Room", imageUrl: "/images/musicroom.jpg" },
];

const userStudentId = "6709616376"

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen font-nunito">
      <Header studentId={userStudentId} />
      <main className="p-4">
        {/* Header ต้อนรับ */}
        <header className="text-center my-4 text-tu-navy">
          <h1 className="text-lg font-bold">Welcome to TU Booking Sports</h1>
          <p className="text-sm text-gray-500">Book your sport!!!</p>
        </header>

        {/* Search Bar (ชั่วคราว) */}
        <div className="my-4 bg-white p-2 border rounded-md text-center text-gray-400">Search Bar Placeholder</div>

        {/* === ANNOUNCE SECTION === */}
        <section className="my-8">
          
          <div className="mb-4 flex justify-center">
            <CoverFlowCarousel items={announcementImages} />
          </div>

          <div className="space-y-4">
            <AnnouncementCard type="success" title="ยินดีต้อนรับ #TU91">
              <p>นักศึกษารหัส 68 สามารถใช้งานระบบ โดยใช้ User: รหัสประจำตัวนักศึกษา 10 หลัก และ Password: เบอร์โทรศัพท์ 10 หลัก (เบอร์โทรศัพท์ที่นักศึกษาให้ข้อมูลไว้กับสำนักงานทะเบียนนักศึกษา)</p>
            </AnnouncementCard>

            <AnnouncementCard type="alert" title="ปิดใช้บริการสนาม">
              <p>สนามสควอช และสนามแบดมินตัน อินเตอร์โซน จะปิดให้บริการ ทุกวันเสาร์ ของเดือน</p>
            </AnnouncementCard>
          </div>
        </section>

        {/* === SPORTS SECTION === */}
        <section className="my-8">
          <h2 className="text-xl text-tu-navy font-bold text-center mb-4">Sports</h2>
          <div className="grid grid-cols-2 gap-4">
            {sportsData.map((sport) => (
              <SportCard 
                key={sport.id}
                title={sport.title}
                subtitle={sport.subtitle}
                imageUrl={sport.imageUrl}
              />
            ))}
          </div>
        </section>

        {/* === YOUR FAVORITE SECTION === */}
        <section className="my-8">
          <h2 className="text-xl text-tu-navy font-bold text-center mb-4">Your Favorite</h2>
          <div className="p-4 bg-white border rounded-md text-center text-gray-400">Favorite Card Placeholder</div>
        </section>
      </main>
    </div>
  );
}

