import { PrismaClient, UserType } from "@/src/app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create consultants
  const consultant1 = await prisma.user.create({
    data: {
      name: "Maria Silva",
      email: "maria.silva@consultant.com",
      phone: "+55 11 98765-4321",
      age: 35,
      cpf: "123.456.789-01",
      cep: "01310-100",
      address: "Av. Paulista, 1578",
      complement: "Conjunto 405",
      type: UserType.CONSULTANT,
    },
  });

  const consultant2 = await prisma.user.create({
    data: {
      name: "João Santos",
      email: "joao.santos@consultant.com",
      phone: "+55 11 97654-3210",
      age: 42,
      cpf: "987.654.321-09",
      cep: "04543-907",
      address: "Av. Brigadeiro Faria Lima, 2232",
      complement: "Sala 1201",
      type: UserType.CONSULTANT,
    },
  });

  console.log("✅ Created consultants:", {
    consultant1: consultant1.name,
    consultant2: consultant2.name,
  });

  // Create clients for consultant 1
  const client1 = await prisma.user.create({
    data: {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "+55 11 91234-5678",
      age: 28,
      cpf: "111.222.333-44",
      cep: "05402-000",
      address: "Rua dos Pinheiros, 498",
      type: UserType.CLIENT,
      consultantId: consultant1.id,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      phone: "+55 11 93456-7890",
      age: 45,
      cpf: "222.333.444-55",
      cep: "01452-000",
      address: "Rua Augusta, 2690",
      complement: "Apto 302",
      type: UserType.CLIENT,
      consultantId: consultant1.id,
    },
  });

  // Create clients for consultant 2
  const client3 = await prisma.user.create({
    data: {
      name: "Patricia Ferreira",
      email: "patricia.ferreira@email.com",
      phone: "+55 11 94567-8901",
      cpf: "333.444.555-66",
      cep: "04551-060",
      address: "Av. Juscelino Kubitschek, 1830",
      type: UserType.CLIENT,
      consultantId: consultant2.id,
    },
  });

  const client4 = await prisma.user.create({
    data: {
      name: "Roberto Almeida",
      email: "roberto.almeida@email.com",
      phone: "+55 11 95678-9012",
      age: 38,
      cpf: "444.555.666-77",
      cep: "01419-001",
      address: "Rua Haddock Lobo, 595",
      complement: "Conjunto 81",
      type: UserType.CLIENT,
      consultantId: consultant2.id,
    },
  });

  console.log("✅ Created clients:", {
    consultant1Clients: [client1.name, client2.name],
    consultant2Clients: [client3.name, client4.name],
  });

  // Create a standalone client (no consultant assigned)
  const standaloneClient = await prisma.user.create({
    data: {
      name: "Fernanda Lima",
      email: "fernanda.lima@email.com",
      phone: "+55 11 96789-0123",
      age: 31,
      cpf: "555.666.777-88",
      cep: "05426-200",
      address: "Rua Teodoro Sampaio, 2767",
      type: UserType.CLIENT,
    },
  });

  console.log("✅ Created standalone client:", standaloneClient.name);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
