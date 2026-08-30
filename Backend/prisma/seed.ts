import bcrypt from 'bcrypt';
import { prisma } from '../src/config/prisma.js';

/*
  Seed inicial do banco de dados.

  Este arquivo cria dados fictícios para facilitar o desenvolvimento,
  testes manuais da API e demonstração do projeto.

  Usuários criados aqui possuem uma senha padrão:
  123456

  A senha nunca é salva em texto puro.
  Ela é transformada em hash utilizando bcrypt.
*/

async function main() {
  // Gera o hash da senha antes de salvar no banco.
  // O número 10 representa o custo do salt utilizado pelo bcrypt.
  const passwordHash = await bcrypt.hash('123456', 10);

  /*
    O upsert evita duplicação caso o seed seja executado
    mais de uma vez.

    Se o usuário já existir pelo email:
    - mantém o registro existente.

    Caso não exista:
    - cria um novo usuário.
  */
  const user1 = await prisma.user.upsert({
    where: {
      email: 'jose@exemplo.com',
    },
    update: {},
    create: {
      name: 'Usuario Teste',
      email: 'jose@exemplo.com',
      passwordHash,

      // Criação das tarefas relacionadas ao usuário.
      tasks: {
        create: [
          {
            title: 'Estudar Zod',
            description: 'Terminar validação das rotas',
          },
          {
            title: 'Configurar error handler',
            completed: true,
          },
          {
            title: 'Criar front-end com React',
            dueDate: new Date('2026-09-01'),
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: {
      email: 'maria@teste.com',
    },
    update: {},
    create: {
      name: 'Maria Teste',
      email: 'maria@teste.com',
      passwordHash,

      tasks: {
        create: [
          {
            title: 'Revisar PR do time',
            completed: true,
          },
          {
            title: 'Preparar apresentação',
          },
        ],
      },
    },
  });

  console.log('Seed concluído com sucesso:', {
    user1: user1.email,
    user2: user2.email,
  });
}

/*
  Executa o seed.

  Caso ocorra algum erro:
  - mostra o erro no terminal;
  - encerra o processo.

  Após finalizar:
  - fecha a conexão com o banco através do Prisma.
*/
main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });