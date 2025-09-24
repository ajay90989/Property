// Legacy Auth Service - Re-exported from new service structure
// This file is kept for backward compatibility
import { authService } from '../services/authService';

export { authService as default } from '../services/authService';

// Re-export the main functions for backward compatibility
export const UserLoginApi = authService.login;
export const UserRegisterApi = authService.register;