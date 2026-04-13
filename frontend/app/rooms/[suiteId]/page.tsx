"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Navbar } from "@/modules/public/components/Navbar";
import { Footer } from "@/modules/public/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchSuiteById } from "@/lib/api/suites";
import type { SuiteDto } from "@/lib/types/suite";
import { getSuiteImageFallbackUrl } from "@/lib/env/public-env";
import { getSuiteCategoryLabel } from "@/lib/domain/suite-category";
import { getSuiteStatusLabel, isSuiteStatus } from "@/lib/domain/suite-status";

const HIGHLIGHTS_BY_CATEGORY: Record<string, string[]> = {
  SUITE: [
    "Spacious lounge and premium bedding",
    "Smart room controls and high-speed Wi-Fi",
    "Signature bathroom amenities",
  ],
  PENTHOUSE: [
    "Panoramic top-floor city and skyline view",
    "Private living area for work and dining",
    "Priority concierge and in-room check-in",
  ],
  VILLA: [
    "Large family-friendly layout with privacy",
    "Garden-facing ambiance and natural light",
    "Personalized housekeeping schedule",
  ],
};

function suiteStatusLabel(status: string): string {
  return isSuiteStatus(status) ? getSuiteStatusLabel(status) : status;
}

export default function RoomDetailPage() {
  const params = useParams<{ suiteId: string }>();
  const router = useRouter();
  const [suite, setSuite] = useState<SuiteDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageFallback = useMemo(() => getSuiteImageFallbackUrl(), []);

  useEffect(() => {
    const suiteId = params?.suiteId;
    if (!suiteId) return;
    fetchSuiteById(suiteId)
      .then((data) => {
        setSuite(data);
        setError(null);
        setLoading(false);
      })
      .catch((e) => {
        setSuite(null);
        setError(
          e instanceof Error ? e.message : "Unable to load room details",
        );
        setLoading(false);
      });
  }, [params?.suiteId]);

  const highlights =
    HIGHLIGHTS_BY_CATEGORY[(suite?.category ?? "SUITE").toUpperCase()] ??
    HIGHLIGHTS_BY_CATEGORY.SUITE;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/rooms")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to rooms
          </Button>

          {loading ? (
            <p className="text-on-surface-variant">Loading room details...</p>
          ) : error || !suite ? (
            <div className="rounded-xl border border-outline-variant/40 p-8 bg-surface-container-low">
              <p className="text-error mb-4">{error ?? "Room not found."}</p>
              <Link href="/rooms" className="text-primary underline">
                Go back to room listing
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
                  <Image
                    src={suite.imageUrl || imageFallback}
                    alt={suite.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                      {suite.roomNumber}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                      {getSuiteCategoryLabel(suite.category ?? "SUITE")}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                      {suiteStatusLabel(suite.status)}
                    </span>
                  </div>
                  <h1 className="font-headline text-4xl md:text-5xl text-on-surface">
                    {suite.name}
                  </h1>
                  <p className="text-on-surface-variant leading-relaxed">
                    {suite.description}
                  </p>
                  <div className="rounded-xl bg-surface-container-low border border-outline-variant/30 p-5">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                      Starting rate
                    </p>
                    <p className="font-headline text-3xl text-primary">
                      ${suite.pricePerNight}
                      <span className="text-sm text-on-surface-variant font-body">
                        {" "}
                        / night
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => router.push(`/rooms?suite=${suite.id}`)}
                    >
                      Reserve this room
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => router.push("/bookings")}
                    >
                      View my bookings
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h2 className="font-headline text-2xl">Room highlights</h2>
                  </div>
                  <ul className="space-y-3 text-on-surface-variant">
                    {highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-1 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
                  <h2 className="font-headline text-2xl mb-4">
                    Booking details
                  </h2>
                  <div className="space-y-3 text-on-surface-variant">
                    <p>Check-in: 2:00 PM</p>
                    <p>Check-out: 12:00 PM</p>
                    <p>Flexible cancellation available for selected rates.</p>
                    <p>
                      Need help? Our team is available 24/7 via front desk
                      support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
