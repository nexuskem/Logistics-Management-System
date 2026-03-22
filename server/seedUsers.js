const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Rex_8902', 10);
  
  const users = [
    {
      name: 'Super Admin',
      email: 'admin@logistics.com',
      password,
      role: 'SUPER_ADMIN',
      phone: '1234567890'
    },
    {
      name: 'Operations Manager',
      email: 'ops@logistics.com',
      password,
      role: 'OPERATIONS_MANAGER',
      phone: '0987654321'
    },
    {
      name: 'John Doe',
      email: 'john@client.com',
      password,
      role: 'CLIENT',
      phone: '1112223333'
    }
  ];

  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (!exists) {
      await prisma.user.create({ data: u });
      console.log(`Created user: ${u.email}`);
    } else {
      console.log(`User already exists: ${u.email}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
