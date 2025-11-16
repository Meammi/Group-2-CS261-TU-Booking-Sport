"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPinIcon, ArrowRightIcon, TagIcon } from "@heroicons/react/24/solid";
import { renderToString } from "react-dom/server";

import { API_BASE } from "@/lib/config";

const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const heroIcon = L.divIcon({
  html: renderToString(<MapPinIcon className="h-10 w-10 text-red-600" />),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const userIcon = L.divIcon({
  html: renderToString(<TagIcon className="h-8 w-8 text-blue-600" />),
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isCurrent: boolean;
  locationName: string;
}

type ModalState = "closed" | "confirm" | "success" | "error";

export default function BookingActions({
  bookingId,
  status,
  isCurrent,
  locationName,
}: BookingActionsProps) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>("closed");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userPos, setUserPos] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!isMapOpen) return;

    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:8081/location/${locationName}`
        );
        if (!res.ok) throw new Error("Unable to load location data");

        const data = await res.json();
        setCoords({ latitude: data.latitude, longitude: data.longitude });
      } catch (err: any) {
        console.error(err);
        setErrorMessage("Failed to fetch court coordinates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [isMapOpen, locationName]);

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setErrorMessage("");
    try {
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });
      if (!meRes.ok) {
        throw new Error(`Failed to fetch user info (${meRes.status})`);
      }
      const me: { id: string } = await meRes.json();

      const bookingsRes = await fetch(`${API_BASE}/MyBookings/${me.id}`, {
        credentials: "include",
      });
      if (!bookingsRes.ok) {
        throw new Error(`Failed to fetch bookings (${bookingsRes.status})`);
      }
      const data: {
        current: Array<{ reservationId: string }>;
        history: Array<{ reservationId: string }>;
      } = await bookingsRes.json();
      const target = isCurrent ? data.current[bookingId] : undefined;
      if (!target?.reservationId) {
        throw new Error("Could not resolve reservation for this card.");
      }

      const response = await fetch(
        `${API_BASE}/MyBookings/cancel/${target.reservationId}`,
        {
          method: "PATCH",

          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Server responded with status ${response.status}`
        );
      }

      setModalState("success");
      setTimeout(() => {
        router.push("/mybooking");
        router.refresh();
      }, 500);
    } catch (err: any) {
      console.error("Cancellation API call failed:", err);
      if (err?.message?.includes("Failed to fetch")) {
        setErrorMessage(
          "Unable to reach the server. Please verify the backend service and CORS configuration."
        );
      } else {
        setErrorMessage(err?.message || "Unable to cancel this reservation.");
      }
      setModalState("error");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("This browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        alert("Unable to access your location. Please allow the permission.");
      }
    );
  };

  const handleNavigate = () => {
    if (!userPos || !coords) {
      alert('Please click "Get Location" first.');
      return;
    }
    setRoute([
      [userPos.latitude, userPos.longitude],
      [coords.latitude, coords.longitude],
    ]);
  };

  const closeModal = () => {
    setModalState("closed");
    setErrorMessage("");
  };

  const canCancel = isCurrent && status.toUpperCase() !== "CANCELLED";

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => setModalState("confirm")}
          className="rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
          disabled={!canCancel}
        >
          Cancel
        </button>

        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <MapPinIcon className="h-4 w-4" />
          <span>MAP</span>
        </button>
      </div>

      {modalState !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            {modalState === "confirm" && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">
                  Cancel this reservation?
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center gap-3 ">
                  <button
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    Keep booking
                  </button>
                  <button
                    className="rounded-md bg-tu-navy px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Yes, cancel"}
                  </button>
                </div>
              </>
            )}

            {modalState === "success" && (
              <>
                <h2 className="text-lg font-semibold text-green-700">
                  Reservation cancelled
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Redirecting you back to My Bookings...
                </p>
              </>
            )}

            {modalState === "error" && (
              <>
                <h2 className="text-lg font-semibold text-red-600">
                  Cancellation failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {errorMessage || "Something went wrong."}
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="relative w-[95%] max-w-lg h-[85vh] bg-white rounded-2xl overflow-hidden shadow-lg">
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-3 right-3 z-[1000] bg-gray-800 text-white rounded-full px-3 py-1 text-sm hover:bg-gray-700 transition"
            >
              Close
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-600">
                Loading map...
              </div>
            ) : coords ? (
              <div className="relative h-full w-full">
                <MapContainer
                  center={[coords.latitude, coords.longitude]}
                  zoom={16}
                  className="h-full w-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={[coords.latitude, coords.longitude]}
                    icon={heroIcon}
                  >
                    <Popup>{locationName}</Popup>
                  </Marker>

                  {userPos && (
                    <Marker
                      position={[userPos.latitude, userPos.longitude]}
                      icon={userIcon}
                    >
                      <Popup>You are here</Popup>
                    </Marker>
                  )}

                  {route.length > 0 && (
                    <Polyline positions={route} color="blue" />
                  )}
                </MapContainer>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-[999]">
                  <button
                    onClick={handleGetLocation}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    <TagIcon className="w-4 h-4" />
                    Get Location
                  </button>

                  <button
                    onClick={handleNavigate}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                    Navigate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-red-600">
                {errorMessage || "Unable to load map"}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
