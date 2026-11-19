// src/types/auth.ts
// Standard Auth & Customer Types for Kshithija Headless Store

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  roles?: string[];
  isAffiliate?: boolean;
  affiliateId?: string | null;
}

export interface CustomerAddress {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface CustomerProfile extends AuthUser {
  billing: CustomerAddress;
  shipping: CustomerAddress;
}
