import bcrypt from 'bcrypt';
import { prisma } from '../src/config/prisma.js';

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Jose Lucas',
      email: 'jose@exemplo22.com',
      passwordHash,
      tasks: {
        create: [
          { title: 'Estudar Zod', description: 'Terminar validação das rotas' },
          { title: 'Configurar error handler', completed: true },
          { title: 'Criar front-end com React', dueDate: new Date('2026-09-01') },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Maria Silva',
      email: 'maria@teste.com',
      passwordHash,
      tasks: {
        create: [
          { title: 'Revisar PR do time', completed: true },
          { title: 'Preparar apresentação' },
        ],
      },
    },
  });

  console.log('Seed concluído:', { user1: user1.email, user2: user2.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });