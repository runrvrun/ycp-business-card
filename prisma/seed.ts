import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
})

async function main() {
  // Seed templates
  const templates = [
    {
      name: "Classic",
      description: "Clean white design with red YCP accent bar",
      svgFile: "template-classic.svg",
      thumbnail: "template-classic-thumb.svg",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Modern Dark",
      description: "Bold dark navy design with gold accents",
      svgFile: "template-modern.svg",
      thumbnail: "template-modern-thumb.svg",
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Minimal",
      description: "Simple minimal design with subtle gray accents",
      svgFile: "template-minimal.svg",
      thumbnail: "template-minimal-thumb.svg",
      isActive: true,
      sortOrder: 3,
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name } as never,
      update: template,
      create: template,
    })
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
