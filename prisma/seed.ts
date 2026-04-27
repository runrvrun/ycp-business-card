import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
})

async function main() {
  const offices = [
    {
      name: "PT YCP Indonesia",
      address: "Satrio Tower, 22/F – Unit C2, Jl. Prof. Dr. Satrio Kav C4, Kuningan Timur, South Jakarta, Indonesia",
      phone: "+62 21 2598 2120",
      website: "ycp.com",
    },
  ]

  for (const o of offices) {
    const existing = await prisma.office.findFirst({ where: { name: o.name } })
    if (!existing) await prisma.office.create({ data: o })
  }

  console.log("Seed complete: offices inserted")

  const templates = [
    {
      name: "PRO-IDN Front",
      description: "Indonesia front — white with YCP logo and personal details",
      svgFile: "PRO-IDN-01.svg",
      type: "FRONT" as const,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "PRO-IDN Back",
      description: "Indonesia back — navy with YCP logo",
      svgFile: "PRO-IDN-02.svg",
      type: "BACK" as const,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "PRO-INT Front (2 Emails)",
      description: "International front — office phone, mobile, two email addresses, website",
      svgFile: "PRO-INT-2EMAIL.svg",
      type: "FRONT" as const,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "PRO-INT Front (WA/Line)",
      description: "International front — mobile, WhatsApp/Line, email, website",
      svgFile: "PRO-INT-WALINE.svg",
      type: "FRONT" as const,
      isActive: true,
      sortOrder: 3,
    },
  ]

  for (const t of templates) {
    const existing = await prisma.template.findFirst({ where: { svgFile: t.svgFile } })
    if (existing) {
      await prisma.template.update({ where: { id: existing.id }, data: t })
    } else {
      await prisma.template.create({ data: t })
    }
  }

  console.log("Seed complete: templates inserted")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
