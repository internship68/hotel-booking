import { PrismaClient } from "../src/generated/prisma-client";
import { suiteSeedRecords } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.suite.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.user.deleteMany();

  await prisma.suite.createMany({
    data: [...suiteSeedRecords],
  });

  await prisma.user.createMany({
    data: [
      {
        name: "A. Director",
        email: "director@majesticreserve.com",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        name: "S. Laurent",
        email: "slaurent@majesticreserve.com",
        role: "MANAGER",
        status: "ACTIVE",
      },
      {
        name: "M. Sterling",
        email: "msterling@majesticreserve.com",
        role: "STAFF",
        status: "ACTIVE",
      },
      {
        name: "E. Rostova",
        email: "erostova@majesticreserve.com",
        role: "STAFF",
        status: "INACTIVE",
      },
    ],
    skipDuplicates: true,
  });

  const suites = await prisma.suite.findMany({
    select: {
      id: true,
      roomNumber: true,
      pricePerNight: true,
    },
  });
  const suiteByRoom = new Map(suites.map((s) => [s.roomNumber, s]));

  const demoGuests = [
    {
      firstName: "Liam",
      lastName: "Carter",
      email: "liam.carter@example.com",
      phone: "+1-202-555-0101",
    },
    {
      firstName: "Sophia",
      lastName: "Nguyen",
      email: "sophia.nguyen@example.com",
      phone: "+1-202-555-0102",
    },
    {
      firstName: "Noah",
      lastName: "Patel",
      email: "noah.patel@example.com",
      phone: "+1-202-555-0103",
    },
    {
      firstName: "Emma",
      lastName: "Rossi",
      email: "emma.rossi@example.com",
      phone: "+1-202-555-0104",
    },
    {
      firstName: "James",
      lastName: "Kim",
      email: "james.kim@example.com",
      phone: "+1-202-555-0105",
    },
    {
      firstName: "Olivia",
      lastName: "Davis",
      email: "olivia.davis@example.com",
      phone: "+1-202-555-0106",
    },
  ] as const;

  await prisma.guest.createMany({
    data: demoGuests,
    skipDuplicates: true,
  });
  const guests = await prisma.guest.findMany({
    select: { id: true, email: true, firstName: true, lastName: true },
  });
  const guestByEmail = new Map(guests.map((g) => [g.email.toLowerCase(), g]));

  const now = new Date();
  const addDays = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const daysBetween = (checkIn: Date, checkOut: Date) =>
    Math.max(
      1,
      Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000),
      ),
    );

  const bookingBlueprints = [
    {
      guestEmail: "liam.carter@example.com",
      roomNumber: "#PH-01",
      checkIn: addDays(-5),
      checkOut: addDays(2),
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      checkedInAt: addDays(-5),
    },
    {
      guestEmail: "sophia.nguyen@example.com",
      roomNumber: "#SU-201",
      checkIn: addDays(0),
      checkOut: addDays(3),
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      checkedInAt: null,
    },
    {
      guestEmail: "noah.patel@example.com",
      roomNumber: "#VL-303",
      checkIn: addDays(1),
      checkOut: addDays(4),
      status: "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod: null,
      checkedInAt: null,
    },
    {
      guestEmail: "emma.rossi@example.com",
      roomNumber: "#SU-204",
      checkIn: addDays(2),
      checkOut: addDays(5),
      status: "PENDING",
      paymentStatus: "UNPAID",
      paymentMethod: null,
      checkedInAt: null,
    },
    {
      guestEmail: "james.kim@example.com",
      roomNumber: "#PH-03",
      checkIn: addDays(-12),
      checkOut: addDays(-7),
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "TRANSFER",
      checkedInAt: addDays(-12),
    },
    {
      guestEmail: "olivia.davis@example.com",
      roomNumber: "#VL-301",
      checkIn: addDays(-1),
      checkOut: addDays(1),
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      checkedInAt: null,
    },
  ] as const;

  for (const blueprint of bookingBlueprints) {
    const guest = guestByEmail.get(blueprint.guestEmail.toLowerCase());
    const suite = suiteByRoom.get(blueprint.roomNumber);
    if (!guest || !suite) continue;

    const nights = daysBetween(blueprint.checkIn, blueprint.checkOut);
    const totalAmount = Number(suite.pricePerNight) * nights;

    const booking = await prisma.booking.create({
      data: {
        guestId: guest.id,
        suiteId: suite.id,
        checkInDate: blueprint.checkIn,
        checkOutDate: blueprint.checkOut,
        totalAmount,
        status: blueprint.status,
        paymentStatus: blueprint.paymentStatus,
        paymentMethod: blueprint.paymentMethod,
        checkedInAt: blueprint.checkedInAt,
      },
    });

    if (blueprint.paymentStatus === "PAID") {
      await prisma.transaction.create({
        data: {
          bookingId: booking.id,
          amount: totalAmount,
          transactionDate: blueprint.checkIn,
          description: `Demo payment for ${suite.roomNumber}`,
          status: "COMPLETED",
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
