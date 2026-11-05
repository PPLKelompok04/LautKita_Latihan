// Membuat akun admin pertama. Jalankan: npx prisma db seed
// Email & password bisa diatur lewat ADMIN_EMAIL dan ADMIN_PASSWORD di .env

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@seaclean.id").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  const role = await prisma.role.findUniqueOrThrow({ where: { kode: "ADMIN" } });
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      nama: "Admin LautKita",
      email,
      passwordHash: await bcrypt.hash(password, 10),
      roleId: role.id,
    },
  });
  console.log(`Admin siap: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
