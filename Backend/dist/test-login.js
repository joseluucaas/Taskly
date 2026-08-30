import { AuthService } from './services/auth.service.js';
const authService = new AuthService();
async function main() {
    const result = await authService.login('john.doe@example.com', 'password123');
    console.log('Login bem-sucedido:', result);
}
main();
//# sourceMappingURL=test-login.js.map