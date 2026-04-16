import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../database/prisma.service";

type DemoSuiteSeed = {
  name: string;
  roomNumber: string;
  description: string;
  pricePerNight: number;
  category: "SUITE" | "PENTHOUSE" | "VILLA";
  status: "AVAILABLE";
  imageUrl: string;
};

const DEMO_SUITES: DemoSuiteSeed[] = [
  {
    name: "Royal Penthouse",
    roomNumber: "#PH-01",
    description:
      "Panoramic skyline views with private lounge and butler support.",
    pricePerNight: 2400,
    status: "AVAILABLE",
    category: "PENTHOUSE",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEVYfduJyLBDL19UsRkYWCN88z1jVgjKpmMUZZrfKDS5QPvzdi7ZEA3pzrQf49EI5rVTm50Rv6z3zbHov_s-ub39tAmRe9JM_qa6in6jUuhNZQq-hV-jwp6Kuw5bMMx0JrOynlMTUPBZYASBa7pPITsBctASRIjIGYdbM07lJrgvQV9gAG1xHQLj0Rj9zYpVCeU6wnPixEwoRKh0-rOcwVPCjxg5j_oFZ91L0p-jzqYRDyipw14tOwVq-LxK3slVD-1J0AdXzuepa8",
  },
  {
    name: "Crown Penthouse",
    roomNumber: "#PH-02",
    description:
      "Top-floor residence with executive work area and evening turndown.",
    pricePerNight: 2250,
    status: "AVAILABLE",
    category: "PENTHOUSE",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDferO6PFhl1nulZeVCIEFy_KImUrl8TPQUjJLPDNT3O1HH-Hc0NeCNH7AYGgoxE2qcB-VCV9F-Ts1FGcz4iPcHMcRm31SM2inHgDT-0AX7uXyOagf7Nf0iZJSnEb4xSA6w3689N6UpchdvyeFrlKSI5lo9nEq8SoNiEDjCKMX9uFx5Vwn7saDGKdDnD7ru4Hzk4A3I4IVwWkUw1owTDOximEk9FxtxtPNRhDRdfA1AjQelzTF0LJYUtn_YgWN9emabaKIl2kAUsX2R",
  },
  {
    name: "Heritage Suite",
    roomNumber: "#SU-201",
    description: "Classical architecture meets modern indulgence.",
    pricePerNight: 1850,
    status: "AVAILABLE",
    category: "SUITE",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDferO6PFhl1nulZeVCIEFy_KImUrl8TPQUjJLPDNT3O1HH-Hc0NeCNH7AYGgoxE2qcB-VCV9F-Ts1FGcz4iPcHMcRm31SM2inHgDT-0AX7uXyOagf7Nf0iZJSnEb4xSA6w3689N6UpchdvyeFrlKSI5lo9nEq8SoNiEDjCKMX9uFx5Vwn7saDGKdDnD7ru4Hzk4A3I4IVwWkUw1owTDOximEk9FxtxtPNRhDRdfA1AjQelzTF0LJYUtn_YgWN9emabaKIl2kAUsX2R",
  },
  {
    name: "Sunrise Suite",
    roomNumber: "#SU-202",
    description: "Warm natural light and calming tones for relaxed stays.",
    pricePerNight: 1700,
    status: "AVAILABLE",
    category: "SUITE",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCt6NW4_vPQl_us_8XJ9SmFrs4VAfhcrxjHJR_EXjQZSO6-aBd_YuHTiUzbmT0rUj06RUEPQlnFdXdmNyVM_DckxVj2UuW4M7f7_qUx1w4Yg7XsY04dsCPtONxcqNfbmbOcg4quZ9BUubLU1XVuRjsCyoX0k5fYllkYNv4K5OOaniSrKcDF2xr_fiw4p0Z-PV0ZKhNKMrxVVfIIapSa_TCzSpzpBE-am9Pybw3z3FNF-2taIzaaU7hVOMlbuz8WcdnqNaq4t_k6QCr8",
  },
  {
    name: "Executive Suite",
    roomNumber: "#SU-203",
    description:
      "Balanced layout with workspace and refined hospitality touches.",
    pricePerNight: 1900,
    status: "AVAILABLE",
    category: "SUITE",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6yFO4cKW6GizrLAmc6ES_DUR5KgHYab1qFIkODnN-aVRUHWKC7Q5WaHruItSZ-Ex2QtLRrT7oRBd34vZglUzgD3KGrK8TQVBNMuk-HvUEFXVRQ4v4iQCeRSqE4lSEEeIptWyl3WTdTR0TFvffNeJmu6K6LUYMxMdNObf3o_i2n3VQ3PXVG9nA76pSO264k0s0BaeIfnDAK1WpI4U4G6CCNtc52hFYrD0rKfFrBlzBK9PDGLMuylkqiNBZjSJHcbyyKBwGexQ-n1yK",
  },
  {
    name: "Garden Villa",
    roomNumber: "#VL-301",
    description: "Villa layout with private seating area and indoor greenery.",
    pricePerNight: 1300,
    status: "AVAILABLE",
    category: "VILLA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS_CqY2c984jOZqXEFk3GqAWKTKthJmV_T7G1lhY7BO0UMT-1tiEsYhPhgcPp2ok62n3EJ4XCDVsP_BmnqwuitMDWClMi5vbVEdFyXPdYB9zszeQWbqKm9-TDRGNws1TnvI4_dV6gvxTlzwvnbX2qUiLEXLxds1dCEhW7CBmZq8xVHSHW0MgIf27q6s5yCcDbZIN35iwmeQ0hnrb5msNVWPMeS3KvhsmQEuKvGaaoTdFJOpELt4OehTbqR00MynI0CYoXFYJBTbR1r",
  },
  {
    name: "Lagoon Villa",
    roomNumber: "#VL-302",
    description:
      "Open-concept villa with calm tones for leisure-focused visits.",
    pricePerNight: 1420,
    status: "AVAILABLE",
    category: "VILLA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDferO6PFhl1nulZeVCIEFy_KImUrl8TPQUjJLPDNT3O1HH-Hc0NeCNH7AYGgoxE2qcB-VCV9F-Ts1FGcz4iPcHMcRm31SM2inHgDT-0AX7uXyOagf7Nf0iZJSnEb4xSA6w3689N6UpchdvyeFrlKSI5lo9nEq8SoNiEDjCKMX9uFx5Vwn7saDGKdDnD7ru4Hzk4A3I4IVwWkUw1owTDOximEk9FxtxtPNRhDRdfA1AjQelzTF0LJYUtn_YgWN9emabaKIl2kAUsX2R",
  },
];

@Injectable()
export class DemoBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DemoBootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const autoSeed = this.parseBoolean(
      this.config.get<string>("demo.autoSeed"),
      true,
    );
    if (!autoSeed) return;

    const suiteCount = await this.prisma.suite.count();
    if (suiteCount > 0) return;

    await this.seedDemoData();
    this.logger.log("Demo data seeded automatically (database was empty).");
  }

  private parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (value == null) return fallback;
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no") {
      return false;
    }
    return fallback;
  }

  private async seedDemoData(): Promise<void> {
    await this.prisma.suite.createMany({ data: DEMO_SUITES });

    await this.prisma.user.createMany({
      data: [
        {
          name: "Demo Admin",
          email: "demo@sunshine.local",
          role: "ADMIN",
          status: "ACTIVE",
        },
        {
          name: "Demo Manager",
          email: "manager@sunshine.local",
          role: "MANAGER",
          status: "ACTIVE",
        },
      ],
      skipDuplicates: true,
    });

    const guest = await this.prisma.guest.upsert({
      where: { email: "guest.demo@example.com" },
      update: {},
      create: {
        firstName: "Guest",
        lastName: "Demo",
        email: "guest.demo@example.com",
        phone: "+1-202-555-0109",
      },
    });

    const suite = await this.prisma.suite.findFirst({
      where: { roomNumber: "#SU-201" },
      select: { id: true, pricePerNight: true },
    });
    if (!suite) return;

    const checkInDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const checkOutDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const nights = 2;
    const totalAmount = Number(suite.pricePerNight) * nights;

    const booking = await this.prisma.booking.create({
      data: {
        guestId: guest.id,
        suiteId: suite.id,
        checkInDate,
        checkOutDate,
        totalAmount,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "CARD",
      },
    });

    await this.prisma.transaction.create({
      data: {
        bookingId: booking.id,
        amount: totalAmount,
        description: "Demo seeded payment",
        status: "COMPLETED",
      },
    });
  }
}
