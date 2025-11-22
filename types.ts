export interface Credential {
  id: string;
  studentAddress: string;
  courseName: string;
  issuerName: string;
  issueDate: number; // Unix timestamp
  expirationDate: number; // Unix timestamp (0 if no expiry)
  revoked: boolean;
}

export interface Issuer {
  address: string;
  name: string;
  authorized: boolean;
}

export interface Student {
  address: string;
  // In a real app, this might include profile metadata linked to the address
}

export interface MockUser {
  address: string;
  role: 'student' | 'issuer' | 'verifier';
}