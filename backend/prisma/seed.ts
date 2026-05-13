import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed categories and sub-categories
  const categories = [
    {
      name: 'Programming',
      subs: ['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'],
    },
    {
      name: 'Mathematics',
      subs: ['Algebra', 'Calculus', 'Statistics', 'Linear Algebra'],
    },
    {
      name: 'Science',
      subs: ['Physics', 'Chemistry', 'Biology', 'Astronomy'],
    },
    {
      name: 'Languages',
      subs: ['English', 'Spanish', 'French', 'Hebrew', 'Arabic'],
    },
    {
      name: 'History',
      subs: ['Ancient History', 'Modern History', 'World War II', 'Middle Ages'],
    },
  ];

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        subCategories: {
          create: cat.subs.map((s) => ({ name: s })),
        },
      },
    });
    console.log(`Seeded category: ${category.name}`);
  }

  // Seed admin user
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { phone: '0000000000' },
    update: {},
    create: { name: 'Admin', phone: '0000000000', password: hashed, role: 'ADMIN' },
  });

  console.log('Seed complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
