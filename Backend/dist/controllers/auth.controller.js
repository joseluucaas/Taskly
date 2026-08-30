import { AuthService } from '../services/auth.service.js';
const authService = new AuthService();
export class AuthController {
    async register(req, res) {
        const { name, email, password } = req.body;
        const user = await authService.register(name, email, password);
        return res.status(201).json(user);
    }
    async login(req, res) {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return res.status(200).json(result);
    }
}
//# sourceMappingURL=auth.controller.js.map