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
    {
      name: "YCP Singapore",
      address: "21 Collyer Quay, Level 11-108, 049320, Singapore",
      phone: "+65 6910 2604",
      website: "ycp.com",
    },
    {
      name: "YCP Thailand",
      address: "63 Athenee Tower, 5/F, Unit 501 Wireless Road, Lumphini, Pathumwan, Bangkok, Thailand",
      phone: "+66 2233 3816",
      website: "ycp.com",
    },
    {
      name: "YCP Indonesia - Jakarta",
      address: "Treasury Tower 7th Floor - Unit 7N Kawasan District 8 LOT 28 Jl. Tulodong Atas 2, Senayan - Kebayoran Baru, Jakarta Selatan",
      phone: "+62 21 2598 2120",
      website: "ycp.com",
    },
    {
      name: "YCP Indonesia - Surabaya",
      address: "YCP Digital Studio, Revio Space, 1/F Jl. Kaliwaron No.58, Gubeng, Surabaya 60285, Indonesia",
      phone: "+62 811 9886 929",
      website: "ycp.com",
    },
    {
      name: "YCP Malaysia",
      address: "M3, Level 13a, Wisma Mont Kiara, 1, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur, Malaysia",
      phone: "+60 176899249",
      website: "ycp.com",
    },
    {
      name: "YCP Philippines",
      address: "28/F, Tower 2, The Enterprise Center, 6766 Ayala Avenue corner Paseo de Roxas, Makati City, Metro Manila 1200",
      phone: "+63 9171 5089 46",
      website: "ycp.com",
    },
    {
      name: "YCP Vietnam",
      address: "06, 9th Floor, TNR Tower, 180-192 Nguyen Cong Tru, Nguyen Thai Binh Ward, District 1, Ho Chi Minh City, Vietnam",
      phone: "+84 907 019931",
      website: "ycp.com",
    },
    {
      name: "YCP Shanghai",
      address: "Room 2312, Hong Kong New World Tower No. 300 Middle Huaihai Road, Huangpu District, Shanghai, China",
      phone: "+86 21 6390 6936",
      website: "ycp.com",
    },
    {
      name: "YCP Hong Kong",
      address: "46-133, 46/F, 33 Hysan Avenue, Lee Garden One, Causeway Bay, Hong Kong",
      phone: "+852 3643 1100",
      website: "ycp.com",
    },
    {
      name: "YCP Taiwan",
      address: "10F-1, No.209, Sec. 1, Civic Boulevard Datong District, Taipei City, Taiwan",
      phone: "+886 2 2181 1662",
      website: "ycp.com",
    },
    {
      name: "YCP Japan",
      address: "Akasaka Green Cross 24F, 2-4-6 Akasaka, Minato-ku, Tokyo 107-0052",
      phone: "+813 5772 2785",
      website: "ycp.com",
    },
    {
      name: "YCP India - Bengaluru",
      address: "Tablespace Suites, Vittal Mallya Road, 10th Floor, Bangalore, Karnataka 560001",
      phone: "+91 6380704623",
      website: "ycp.com",
    },
    {
      name: "YCP India - Mumbai",
      address: "WeWork, Enam Sambhav, BKC C-20, G Block, Bandra-Kurla Complex, Mumbai 400051",
      phone: "+91 6380704623",
      website: "ycp.com",
    },
    {
      name: "YCP India - Gurugram",
      address: "Floor 12B, HQ27, The Headquarters, B[1]660 Sushant Lok-1, Sector 27, Gurugram, Haryana 122009",
      phone: "+91 6380704623",
      website: "ycp.com",
    },
    {
      name: "YCP India - Gurgaon",
      address: "Innov8 by OYO, 3rd Floor, Orchid Center, Sector 53, Gurgaon 122002",
      phone: "+91 6380704623",
      website: "ycp.com",
    },
    {
      name: "YCP Netherlands",
      address: "Keizersgracht 482, 1017 EG Amsterdam, Netherlands",
      phone: "+31 6 4892 3247",
      website: "ycp.com",
    },
    {
      name: "YCP France",
      address: "Society Opera, 2 Rue Des Italiens, 75009 Paris, France",
      phone: "+33 1 5676 7602",
      website: "ycp.com",
    },
    {
      name: "YCP United Kingdom",
      address: "Robert Robinson Ave, Littlemore, Oxford OX4 4GP, UK",
      phone: "+44 2080506888",
      website: "ycp.com",
    },
    {
      name: "YCP Switzerland",
      address: "Rue du Commerce 4, 1204 Genève, Switzerland",
      phone: "+41 228199417",
      website: "ycp.com",
    },
    {
      name: "YCP USA - New York City",
      address: "7/F, 250 Park Avenue New York, NY 10177",
      phone: "+1 302 351 2412",
      website: "ycp.com",
    },
    {
      name: "YCP USA - Florida",
      address: "1395 Brickell Ave Suite #800, Miami, FL 33131, United States",
      phone: "+1 3052008732",
      website: "ycp.com",
    },
    {
      name: "YCP UAE - Dubai",
      address: "Dubai South Business Center, Building A3-406, Dubai Logistics City, P.O Box 116158, Dubai, U.A.E",
      phone: "+971 554305944",
      website: "ycp.com",
    },
    {
      name: "YCP UAE - Abu Dhabi",
      address: "Al Ghaith Tower, 8th Floor, Office No. 827, Hamdan Street, PO Box 30859, Abu Dhabi, UAE",
      phone: "+97 125089000",
      website: "ycp.com",
    },
    {
      name: "YCP Brazil",
      address: "R. Quinze de Novembro, 184 - Centro Histórico de São Paulo, São Paulo - SP, 01012-010, Brazil",
      phone: "+55 1134436464",
      website: "ycp.com",
    },
    {
      name: "YCP Mauritius",
      address: "Ground Floor, Rogers Capital House, MU, John kennedy Street, Port Louis 11302, Mauritius",
      phone: "+230 2128033",
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
      name: "YCP Front",
      description: "YCP standard front face — white with YCP logo and personal details",
      svgFile: "PRO-IDN-01.svg",
      type: "FRONT" as const,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "YCP Back",
      description: "YCP standard back face — navy with YCP logo",
      svgFile: "PRO-IDN-02.svg",
      type: "BACK" as const,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "YCP Front (2 Emails)",
      description: "Front face with two email addresses",
      svgFile: "PRO-INT-2EMAIL.svg",
      type: "FRONT" as const,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "YCP Front (WA/Line)",
      description: "Front face with WhatsApp/Line",
      svgFile: "PRO-INT-WALINE.svg",
      type: "FRONT" as const,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "YCP Back (Logo+Text)",
      description: "Back face — navy with YCP circle logo and YCP letter marks",
      svgFile: "PRO-LOGOTEXT-BACK.svg",
      type: "BACK" as const,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "YCP Renoir Back",
      description: "Back face — navy with YCP Renoir logo and text",
      svgFile: "PRO-RENOIR-BACK.svg",
      type: "BACK" as const,
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
