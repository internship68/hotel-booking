"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "@/modules/public/components/Navbar";
import { Footer } from "@/modules/public/components/Footer";
import { useAppDialog } from "@/components/providers/app-dialog-provider";
import { MotionButton } from "@/components/ui/motion-button";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PAGE_SECTION_IDS } from "@/lib/constants/page-sections";

const sectionScrollClass = "scroll-mt-24";
const featuredCollections = [
  {
    title: "Penthouses",
    description:
      "Elevated layouts with skyline views, premium privacy, and tailored services.",
    priceText: "5 Rooms • From $2,400",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEVYfduJyLBDL19UsRkYWCN88z1jVgjKpmMUZZrfKDS5QPvzdi7ZEA3pzrQf49EI5rVTm50Rv6z3zbHov_s-ub39tAmRe9JM_qa6in6jUuhNZQq-hV-jwp6Kuw5bMMx0JrOynlMTUPBZYASBa7pPITsBctASRIjIGYdbM07lJrgvQV9gAG1xHQLj0Rj9zYpVCeU6wnPixEwoRKh0-rOcwVPCjxg5j_oFZ91L0p-jzqYRDyipw14tOwVq-LxK3slVD-1J0AdXzuepa8",
    category: "PENTHOUSE",
    badge: "Available Now",
  },
  {
    title: "Suites",
    description:
      "Signature rooms that balance comfort, design, and value for every stay.",
    priceText: "5 Rooms • From $1,850",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDferO6PFhl1nulZeVCIEFy_KImUrl8TPQUjJLPDNT3O1HH-Hc0NeCNH7AYGgoxE2qcB-VCV9F-Ts1FGcz4iPcHMcRm31SM2inHgDT-0AX7uXyOagf7Nf0iZJSnEb4xSA6w3689N6UpchdvyeFrlKSI5lo9nEq8SoNiEDjCKMX9uFx5Vwn7saDGKdDnD7ru4Hzk4A3I4IVwWkUw1owTDOximEk9FxtxtPNRhDRdfA1AjQelzTF0LJYUtn_YgWN9emabaKIl2kAUsX2R",
    category: "SUITE",
  },
  {
    title: "Villas",
    description:
      "Spacious private options ideal for families, groups, and long stays.",
    priceText: "5 Rooms • From $1,200",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS_CqY2c984jOZqXEFk3GqAWKTKthJmV_T7G1lhY7BO0UMT-1tiEsYhPhgcPp2ok62n3EJ4XCDVsP_BmnqwuitMDWClMi5vbVEdFyXPdYB9zszeQWbqKm9-TDRGNws1TnvI4_dV6gvxTlzwvnbX2qUiLEXLxds1dCEhW7CBmZq8xVHSHW0MgIf27q6s5yCcDbZIN35iwmeQ0hnrb5msNVWPMeS3KvhsmQEuKvGaaoTdFJOpELt4OehTbqR00MynI0CYoXFYJBTbR1r",
    category: "VILLA",
  },
] as const;

export default function Home() {
  const { alert } = useAppDialog();
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guestSelection, setGuestSelection] = useState("2 Adults, 1 Room");

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    let rafId = 0;
    let lastTs = performance.now();
    const step = (ts: number) => {
      const delta = ts - lastTs;
      node.scrollLeft += delta * 0.045;
      const halfWidth = node.scrollWidth / 2;
      if (node.scrollLeft >= halfWidth) {
        node.scrollLeft -= halfWidth;
      }
      lastTs = ts;
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleJoin = () => {
    if (email) {
      alert(`Thank you for joining the Inner Circle, ${email}!`);
      setEmail("");
    } else {
      alert("Please enter your email address.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <header
          id={PAGE_SECTION_IDS.hero}
          className={`relative h-screen w-full flex flex-col justify-center overflow-hidden ${sectionScrollClass}`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=80"
              alt="Ultra-luxury penthouse suite at dusk"
              fill
              className="object-cover scale-105"
              priority
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 hero-gradient-overlay"></div>
          </div>

          <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full mt-20">
            <span className="font-label text-primary-fixed uppercase tracking-[0.3em] text-xs mb-6 block">
              Luxury Hospitality Reimagined
            </span>
            <h1 className="font-headline text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight max-w-4xl">
              Welcome to <br /> Sunshine Hotel
            </h1>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 z-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Card className="backdrop-blur-xl border-white/30 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
                <CardContent className="p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-outline">
                        Arrival
                      </label>
                      <Input
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-outline">
                        Departure
                      </label>
                      <Input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label text-[10px] uppercase tracking-widest text-outline">
                        Guests
                      </label>
                      <select
                        value={guestSelection}
                        onChange={(e) => setGuestSelection(e.target.value)}
                        className="h-11 rounded-md border border-outline-variant/50 bg-white px-3 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <option>2 Adults, 1 Room</option>
                        <option>1 Adult, 1 Room</option>
                        <option>4 Adults, 2 Rooms</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      if (!arrivalDate || !departureDate) {
                        void alert(
                          "Please select arrival and departure dates.",
                        );
                        return;
                      }
                      if (departureDate <= arrivalDate) {
                        void alert(
                          "Departure date must be after arrival date.",
                        );
                        return;
                      }
                      const params = new URLSearchParams({
                        category: "SUITE",
                        checkInDate: arrivalDate,
                        checkOutDate: departureDate,
                        guests: guestSelection,
                      });
                      router.push(`/rooms?${params.toString()}`);
                    }}
                    className="px-8 py-5 gap-2 shrink-0 w-full md:w-auto uppercase tracking-wide"
                  >
                    <Search className="w-5 h-5" />
                    Check Availability
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </header>

        <MotionReveal>
          <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-20 items-center">
            <div className="md:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="font-label text-primary font-bold uppercase tracking-widest text-xs">
                  Curated Experiences
                </span>
                <h2 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight">
                  Stay Bright, Stay Comfortable
                </h2>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed text-lg">
                Sunshine Hotel combines warm service, elegant rooms, and a
                smooth booking journey so guests can find the right room fast
                and enjoy a clear, stress-free experience from search to
                check-in.
              </p>
              <div className="pt-4">
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-3 text-primary font-bold uppercase text-xs tracking-[0.2em] group"
                >
                  View Amenities
                  <span className="h-[1px] w-12 bg-primary transition-all group-hover:w-20"></span>
                </Link>
              </div>
            </div>
            <div className="md:col-span-7 relative h-[400px] md:h-[600px]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt6NW4_vPQl_us_8XJ9SmFrs4VAfhcrxjHJR_EXjQZSO6-aBd_YuHTiUzbmT0rUj06RUEPQlnFdXdmNyVM_DckxVj2UuW4M7f7_qUx1w4Yg7XsY04dsCPtONxcqNfbmbOcg4quZ9BUubLU1XVuRjsCyoX0k5fYllkYNv4K5OOaniSrKcDF2xr_fiw4p0Z-PV0ZKhNKMrxVVfIIapSa_TCzSpzpBE-am9Pybw3z3FNF-2taIzaaU7hVOMlbuz8WcdnqNaq4t_k6QCr8"
                alt="Fine Dining"
                fill
                className="object-cover rounded-sm"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -left-10 bg-surface-container p-8 max-w-xs shadow-xl hidden lg:block z-10">
                <h4 className="font-headline text-xl mb-2">Gastronomy</h4>
                <p className="font-body text-sm text-on-surface-variant italic">
                  &quot;A symphony of flavors served in the quiet elegance of
                  our private dining room.&quot;
                </p>
              </div>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section
            id={PAGE_SECTION_IDS.collection}
            className={`bg-surface-container-low py-24 md:py-32 ${sectionScrollClass}`}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <span className="font-label text-primary font-bold uppercase tracking-widest text-xs">
                  The Collection
                </span>
                <h2 className="font-headline text-4xl md:text-5xl text-on-surface">
                  Selected Sanctuaries
                </h2>
              </div>
              <div className="flex gap-4">
                <MotionButton
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Previous"
                  className="w-12 h-12 rounded-full border-outline-variant hover:bg-primary hover:text-white hover:border-primary"
                >
                  <ArrowLeft className="w-5 h-5" />
                </MotionButton>
                <MotionButton
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={scrollRight}
                  aria-label="Next"
                  className="w-12 h-12 rounded-full border-outline-variant hover:bg-primary hover:text-white hover:border-primary"
                >
                  <ArrowRight className="w-5 h-5" />
                </MotionButton>
              </div>
            </div>

            <div className="max-w-7xl mx-auto">
              <div
                ref={carouselRef}
                className="px-6 md:px-12 flex gap-8 overflow-x-auto pb-12 snap-x no-scrollbar scroll-smooth"
              >
                {[...featuredCollections, ...featuredCollections].map(
                  (item, idx) => (
                    <div
                      key={`${item.category}-${idx}`}
                      className="min-w-[320px] md:min-w-[450px] snap-start group cursor-pointer"
                      onClick={() =>
                        router.push(`/rooms?category=${item.category}`)
                      }
                    >
                      <div className="h-[400px] md:h-[550px] overflow-hidden mb-6 relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        {item.badge ? (
                          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest">
                            {item.badge}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline text-2xl mb-2">
                            {item.title}
                          </h3>
                          <p className="font-body text-sm text-on-surface-variant mb-6">
                            {item.description}
                          </p>
                          <span className="font-label text-primary font-bold text-lg">
                            {item.priceText}{" "}
                            <small className="font-normal text-xs text-outline">
                              / NIGHT
                            </small>
                          </span>
                        </div>
                        <button className="mt-2 border-b border-primary text-primary font-bold uppercase text-xs tracking-widest py-1 hover:opacity-60 transition-opacity">
                          Explore
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section
            id={PAGE_SECTION_IDS.membership}
            className={`py-24 md:py-32 px-6 md:px-12 bg-deep-obsidian text-white relative overflow-hidden ${sectionScrollClass}`}
          >
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full fill-white" viewBox="0 0 100 100">
                <path
                  d="M0,50 Q25,0 50,50 T100,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.1"
                ></path>
              </svg>
            </div>
            <div className="max-w-3xl mx-auto text-center space-y-8 md:space-y-10 relative z-10">
              <span className="font-label text-primary-fixed uppercase tracking-[0.4em] text-xs">
                The Inner Circle
              </span>
              <h2 className="font-headline text-4xl md:text-5xl leading-tight">
                Join Our Exclusive Membership
              </h2>
              <p className="font-body text-surface-variant/70 text-base md:text-lg">
                Receive invitation-only access to new sanctuary openings,
                curated seasonal events, and private concierge benefits.
              </p>
              <form
                className="flex flex-col md:flex-row items-end gap-6 border-b border-outline-variant/30 pb-4 max-w-xl mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleJoin();
                }}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-white placeholder:text-surface-variant/40 font-body text-lg outline-none"
                />
                <MotionButton
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="!shadow-none text-primary-fixed-dim hover:text-white normal-case tracking-normal font-bold"
                >
                  Join Now
                </MotionButton>
              </form>
            </div>
          </section>
        </MotionReveal>
      </main>

      <Footer />
    </div>
  );
}
