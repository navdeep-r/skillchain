
import { Credential, Issuer } from '../types';
import { ethers } from 'ethers';

// Minimal ABI for the SkillsRegistry Contract
const CONTRACT_ABI = [
  "function addIssuer(address _issuer) external",
  "function issueCredential(address _student, string memory _courseName, uint256 _issueDate, uint256 _expirationDate) external",
  "function revokeCredential(uint256 _id) external",
  "event CredentialIssued(uint256 indexed id, address indexed issuer, address indexed student)"
];

// Helper to get Ethereum Object
const getEthereum = () => (window as any).ethereum;

// --- Student Services ---

export const connectStudentWallet = async (): Promise<string> => {
  console.log("connectStudentWallet: Starting...");
  const eth = getEthereum();
  if (!eth) {
    console.error("connectStudentWallet: No Crypto Wallet found");
    throw new Error("No Crypto Wallet found. Please install MetaMask.");
  }

  console.log("connectStudentWallet: Requesting accounts...");
  const accounts = await eth.request({ method: 'eth_requestAccounts' });
  console.log("connectStudentWallet: Accounts received", accounts);
  return accounts[0];
};

export const fetchStudentCredentials = async (address: string): Promise<Credential[]> => {
  console.log(`fetchStudentCredentials: Fetching for ${address}...`);

  // 1. Try Local Storage first (Demo Mode)
  const existingData = localStorage.getItem('skillchain_credentials');
  if (existingData) {
    const allCredentials = JSON.parse(existingData);
    const studentCredentials = allCredentials.filter((c: any) =>
      c.studentAddress.toLowerCase() === address.toLowerCase()
    );
    console.log("fetchStudentCredentials: Found in Local Storage", studentCredentials);
    if (studentCredentials.length > 0) {
      return studentCredentials;
    }
  }

  // 2. Fallback to API/Indexer
  try {
    const response = await fetch(`/api/student/${address}`);
    console.log("fetchStudentCredentials: Response status", response.status);
    if (!response.ok) {
      console.error("fetchStudentCredentials: Response not OK", await response.text());
      throw new Error("Failed to fetch credentials from Indexer");
    }
    const data = await response.json();
    console.log("fetchStudentCredentials: Data received", data);
    return data.credentials;
  } catch (error) {
    console.error("fetchStudentCredentials: Error", error);
    return []; // Return empty instead of throwing to avoid UI crash in demo
  }
};

// --- Issuer Services ---

export const connectIssuerWallet = async (): Promise<Issuer> => {
  const eth = getEthereum();
  if (!eth) throw new Error("No Wallet found");

  const accounts = await eth.request({ method: 'eth_requestAccounts' });
  const address = accounts[0];

  // In a real app, we would check the Smart Contract `authorizedIssuers(address)` mapping here.
  // For now, we allow any wallet to act as issuer to demonstrate the UI flow, 
  // but the transaction will fail on-chain if not authorized by the deployer.

  return {
    address,
    name: "University Issuer (Web3)",
    authorized: true
  };
};

export const mintCredential = async (
  studentAddress: string,
  courseName: string,
  issueDate: number,
  expirationDate: number,
  file: File | null
): Promise<Credential> => {
  console.log("mintCredential: Starting...", { studentAddress, courseName, file });

  // 1. Handle File (Convert to Base64 for Local Storage Demo)
  let fileUrl = "";
  if (file) {
    fileUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  // 2. Create Credential Object
  const newCredential: Credential = {
    id: "cred_" + Math.random().toString(36).substr(2, 9),
    studentAddress,
    courseName,
    issuerName: "University Issuer",
    issueDate,
    expirationDate,
    revoked: false,
    // @ts-ignore - Adding fileUrl dynamically for demo
    fileUrl: fileUrl
  };

  // 3. Save to Local Storage (Demo Mode Persistence)
  const existingData = localStorage.getItem('skillchain_credentials');
  const credentials = existingData ? JSON.parse(existingData) : [];
  credentials.push(newCredential);
  localStorage.setItem('skillchain_credentials', JSON.stringify(credentials));

  console.log("mintCredential: Saved to Local Storage", newCredential);

  // 4. Also try to call Blockchain (Optional/Best Effort)
  try {
    if (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (window as any).ethereum) {
      const provider = new ethers.BrowserProvider(getEthereum());
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.issueCredential(studentAddress, courseName, issueDate, expirationDate);
      console.log("mintCredential: Blockchain TX sent", tx.hash);
      // We don't wait for it to confirm to keep UI fast for demo
    }
  } catch (e) {
    console.warn("mintCredential: Blockchain interaction failed, but saved locally.", e);
  }

  return newCredential;
};

// --- Verifier Services ---

export const verifyStudentSkill = async (studentAddress: string, skillName: string): Promise<boolean> => {
  // Call the "ZK / Oracle" API
  const response = await fetch('/api/verify-zk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentAddress, skillName })
  });

  const data = await response.json();
  return data.verified;
};
