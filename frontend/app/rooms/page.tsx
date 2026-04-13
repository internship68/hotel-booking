"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/modules/public/components/Navbar";
import { Footer } from "@/modules/public/components/Footer";
import { MotionButton } from "@/components/ui/motion-button";
import { MotionModal } from "@/components/ui/motion-modal";
import { Ruler, X } from "lucide-react";
import { fetchAvailableSuites, fetchSuites } from "@/lib/api/suites";
import { createBooking } from "@/lib/api/bookings";
import type { SuiteDto } from "@/lib/types/suite";
import { getSuiteImageFallbackUrl } from "@/lib/env/public-env";
import { getSuiteCategoryLabel } from "@/lib/domain/suite-category";
import {
  getSuiteStatusLabel,
  isMaintenanceStatus,
  isSuiteStatus,
} from "@/lib/domain/suite-status";

const GUEST_EMAIL_KEY = "booking_guest_email";
const ROOM_CATEGORIES = ["SUITE", "PENTHOUSE", "VILLA"] as const;
type RoomCategory = (typeof ROOM_CATEGORIES)[number];

function suiteStatusLabel(status: string): string {
  return isSuiteStatus(status) ? getSuiteStatusLabel(status) : status;
}

function suiteMatchesCategory(
  suite: SuiteDto,
  category: RoomCategory,
): boolean {
  return (suite.category ?? "SUITE").toUpperCase() === category;
}

function categoryFromQuery(category: string | null): RoomCategory {
  const c = category?.toUpperCase();
  if (c === "PENTHOUSE") return "PENTHOUSE";
  if (c === "VILLA") return "VILLA";
  return "SUITE";
}

function categoryTitle(category: RoomCategory): string {
  if (category === "PENTHOUSE") return "Penthouses";
  if (category === "VILLA") return "Villas";
  return "Suites";
}

export default function RoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageFallback = useMemo(() => getSuiteImageFallbackUrl(), []);
  const checkInDateQuery = searchParams.get("checkInDate");
  const checkOutDateQuery = searchParams.get("checkOutDate");
  const hasDateSearch = Boolean(checkInDateQuery && checkOutDateQuery);
  const [suites, setSuites] = useState<SuiteDto[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedSuite, setSelectedSuite] = useState<SuiteDto | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSuites = useCallback(async () => {
    setListLoading(true);
    try {
      const data = hasDateSearch
        ? await fetchAvailableSuites({
            checkInDate: checkInDateQuery as string,
            checkOutDate: checkOutDateQuery as string,
          })
        : await fetchSuites();
      setSuites(data);
    } catch {
      setSuites([]);
    } finally {
      setListLoading(false);
    }
  }, [checkInDateQuery, checkOutDateQuery, hasDateSearch]);

  useEffect(() => {
    loadSuites();
  }, [loadSuites]);

  useEffect(() => {
    const requestedSuiteId = searchParams.get("suite");
    if (!requestedSuiteId || suites.length === 0 || selectedSuite) return;
    const match = suites.find((suite) => suite.id === requestedSuiteId);
    if (match && match.status === "AVAILABLE") {
      openBooking(match);
    }
  }, [searchParams, suites, selectedSuite]);

  useEffect(() => {
    const saved = localStorage.getItem(GUEST_EMAIL_KEY);
    if (saved) setEmail(saved);
  }, []);

  const openBooking = (suite: SuiteDto) => {
    setSelectedSuite(suite);
    setFormError(null);
    setCheckIn("");
    setCheckOut("");
    const saved = localStorage.getItem(GUEST_EMAIL_KEY);
    if (saved) setEmail(saved);
  };

  const closeBooking = () => {
    setSelectedSuite(null);
    setFormError(null);
    setSubmitting(false);
  };

  const activeCategory = categoryFromQuery(searchParams.get("category"));
  const activeTitle = categoryTitle(activeCategory);
  const filtered = suites.filter((s) =>
    suiteMatchesCategory(s, activeCategory),
  );

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuite) return;
    setFormError(null);
    setSubmitting(true);
    try {
      const booking = await createBooking({
        suiteId: selectedSuite.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guest: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
        },
      });
      localStorage.setItem(GUEST_EMAIL_KEY, email.trim());
      closeBooking();
      router.push(`/payment/${booking.id}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Booking could not be completed.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <span className="font-label text-xs font-bold tracking-[0.2rem] uppercase text-primary mb-6 block">
            The Catalog
          </span>
          <h1 className="font-headline text-5xl lg:text-7xl font-bold text-on-background leading-tight mb-6">
            {`${activeTitle} Collection`}
          </h1>
          <p className="font-headline italic text-xl text-on-surface-variant leading-relaxed max-w-2xl">
            {hasDateSearch
              ? `Showing ${filtered.length} available rooms in ${activeTitle} for ${checkInDateQuery} to ${checkOutDateQuery}.`
              : `Showing ${filtered.length} rooms in ${activeTitle}. Pick any room card to see full details and booking options.`}
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          {listLoading ? (
            <p className="font-body text-on-surface-variant">Loading suites…</p>
          ) : filtered.length === 0 ? (
            <p className="font-body text-on-surface-variant">
              {`No rooms found for ${activeTitle} yet.`}
            </p>
          ) : (
            filtered.map((suite) => (
              <article
                key={suite.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-500"
              >
                <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-surface-container rounded-sm">
                  <Image
                    src={suite.imageUrl || imageFallback}
                    alt={suite.name}
                    fill
                    className={`object-cover ${
                      isMaintenanceStatus(suite.status) ? "grayscale" : ""
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <span className="font-label text-xs font-bold tracking-widest uppercase text-primary">
                      {suite.roomNumber}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                      {getSuiteCategoryLabel(suite.category ?? "SUITE")}
                    </span>
                    <div className="h-[1px] flex-1 bg-outline-variant" />
                    <span
                      className={`font-label text-[10px] font-bold uppercase tracking-widest ${
                        isMaintenanceStatus(suite.status)
                          ? "text-error"
                          : suite.status === "AVAILABLE"
                            ? "text-green-700"
                            : "text-amber-800"
                      }`}
                    >
                      {suiteStatusLabel(suite.status)}
                    </span>
                  </div>
                  <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-4">
                    {suite.name}
                  </h2>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-8">
                    {suite.description}
                  </p>
                  <div className="flex items-center gap-2 mb-8">
                    <Ruler className="text-primary w-4 h-4" />
                    <span className="font-label text-[10px] uppercase font-bold tracking-tighter">
                      From ${suite.pricePerNight} / night
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <MotionButton
                      type="button"
                      variant="primary"
                      size="xl"
                      disabled={
                        isMaintenanceStatus(suite.status) ||
                        suite.status !== "AVAILABLE"
                      }
                      onClick={() => openBooking(suite)}
                      className="w-full md:w-auto px-10 bloom-effect"
                    >
                      {suite.status === "AVAILABLE"
                        ? "Book experience"
                        : "Unavailable"}
                    </MotionButton>
                    <Link
                      href={`/rooms/${suite.id}`}
                      className="font-label text-xs uppercase tracking-widest text-primary underline underline-offset-4"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <MotionModal
        open={selectedSuite != null}
        onBackdropClick={closeBooking}
        panelClassName="bg-surface w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
      >
        {selectedSuite ? (
          <>
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low sticky top-0 z-10">
              <h3 className="font-headline text-xl font-semibold text-on-surface">
                Reservation request
              </h3>
              <button
                type="button"
                onClick={closeBooking}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
              <div>
                <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                  Suite
                </span>
                <p className="font-headline text-lg text-primary">
                  {selectedSuite.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Arrival
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Departure
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  First name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 font-body text-sm outline-none focus:border-primary"
                />
              </div>
              {formError && (
                <p className="text-error font-body text-sm">{formError}</p>
              )}
              <MotionButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full py-3 bloom-effect"
              >
                {submitting ? "Submitting…" : "Submit request"}
              </MotionButton>
            </form>
          </>
        ) : null}
      </MotionModal>

      <Footer />
    </div>
  );
}
