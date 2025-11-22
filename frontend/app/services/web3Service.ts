import { Credential, Issuer } from '../types';

// Mock Data to simulate Blockchain state for the UI demo
const MOCK_CREDENTIALS: Credential[] = [
  {
    id: '1',
    studentAddress: '0x123...abc',
    courseName: 'Advanced Python',
    issuerName: 'MIT OpenCourseWare',
    issueDate: 1672531200, // Jan 1 2023
    expirationDate: 0, // No expiry
    revoked: false,
  },
  {
    id: '2',
    studentAddress: '0x123...abc',
    courseName: 'Solidity Fundamentals',
    issuerName: 'ConsenSys Academy',
    issueDate: 1685577600, // June 1 2023
    expirationDate: 1717200000, // June 1 2024 (Expired)
    revoked: false,
  },
  {
    id: '3',
    studentAddress: '0x123...abc',
    courseName: 'React Architecture',
    issuerName: 'Frontend Masters',
    issueDate: 1704067200, // Jan 1 2024
    expirationDate: 0,
    revoked: true, // Revoked
  },
];

const MOCK_ISSUER_PROFILE: Issuer = {
  address: '0x7099...79C8',
  name: 'MIT OpenCourseWare',
  authorized: true
};

// --- Student Services ---

export const connectStudentWallet = async (): Promise<string> => {
  // Simulate wallet connection delay for a student
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("0x123...abc");
    }, 800);
  });
};

export const fetchStudentCredentials = async (address: string): Promise<Credential[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CREDENTIALS);
    }, 1000);
  });
};

// --- Issuer Services ---

export const connectIssuerWallet = async (): Promise<Issuer> => {
  // Simulate checking if the connected wallet is an authorized issuer
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ISSUER_PROFILE);
    }, 1000);
  });
};

export const mintCredential = async (
  studentAddress: string,
  courseName: string,
  issueDate: number,
  expirationDate: number
): Promise<Credential> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCredential: Credential = {
        id: Math.random().toString(36).substr(2, 9),
        studentAddress,
        courseName,
        issuerName: MOCK_ISSUER_PROFILE.name,
        issueDate: issueDate,
        expirationDate,
        revoked: false
      };
      
      // Update the mock state so it shows up in the Student Passport
      MOCK_CREDENTIALS.push(newCredential);
      
      resolve(newCredential);
    }, 2000);
  });
};

// --- Verifier Services ---

export const verifyStudentSkill = async (studentAddress: string, skillName: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const now = Math.floor(Date.now() / 1000);
            const isValid = MOCK_CREDENTIALS.some(c => 
                c.courseName.toLowerCase().includes(skillName.toLowerCase()) &&
                !c.revoked &&
                (c.expirationDate === 0 || c.expirationDate > now)
            );
            resolve(isValid);
        }, 1500);
    });
};