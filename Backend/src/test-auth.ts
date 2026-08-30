import { AuthService } from './services/auth.service.js';

const authService = new AuthService();

async function main() {
  const user = await authService.register('John Doe', 'john.doe@example.com', 'password123');
  console.log('Usuário criado:', user);
}

main();