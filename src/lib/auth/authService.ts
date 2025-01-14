import type { AuthUser, LoginCredentials, RegisterData } from './types';

class AuthService {
  private static instance: AuthService;
  private mockUser: AuthUser | null = null;
  private mockProfiles: Record<string, any> = {};

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; hasProfile: boolean }> {
    try {
      // Mock authentication for demo purposes
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!credentials.email && !credentials.provider) {
            reject(new Error('Email or provider is required'));
            return;
          }

          // Demo validation
          if (credentials.password && credentials.password.length < 1) {
            reject(new Error('Invalid password'));
            return;
          }

          resolve();
        }, 1000);
      });

      // Create mock user
      this.mockUser = {
        id: '1',
        email: credentials.email || 'demo@example.com',
        name: 'Demo User',
        country: 'Nepal',
        verified: true,
        createdAt: new Date(),
        provider: credentials.provider
      };

      const hasProfile = Boolean(this.mockProfiles[this.mockUser.id]);

      return {
        user: this.mockUser,
        hasProfile
      };
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthUser> {
    try {
      // Mock registration for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        country: data.country,
        verified: false,
        createdAt: new Date(),
        provider: data.provider
      };

      return this.mockUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.mockUser = null;
  }
}

export const authService = AuthService.getInstance();
