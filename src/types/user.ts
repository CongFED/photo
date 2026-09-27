export type UserRole = 'customer' | 'admin';

export type UserStatus = 'active' | 'blocked';

export type MembershipTier = 'standard' | 'silver' | 'gold' | 'diamond';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  membershipTier: MembershipTier;
  avatar?: string;
  idNumber?: string;
  birthDate?: string;
  address?: string;
  socialContact?: string;
  totalRentals: number;
  totalSpent: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
