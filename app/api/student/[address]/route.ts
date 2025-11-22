
import { NextResponse } from 'next/server';

// Mock Database simulating indexed Blockchain events
const INDEXER_DB: Record<string, any[]> = {
  "0x123...abc": [
    { 
      id: "1", 
      courseName: "Advanced Python", 
      issuerName: "MIT OpenCourseWare", 
      issueDate: 1672531200, 
      expirationDate: 0,
      revoked: false 
    },
    { 
      id: "2", 
      courseName: "Solidity Fundamentals", 
      issuerName: "ConsenSys Academy", 
      issueDate: 1685577600, 
      expirationDate: 1717200000,
      revoked: false 
    },
    { 
      id: "3", 
      courseName: "React Architecture", 
      issuerName: "Frontend Masters", 
      issueDate: 1704067200, 
      expirationDate: 0, 
      revoked: true 
    }
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const address = params.address;
  
  // Simulate Database Query Latency
  // This is much faster than querying the blockchain 50 times
  await new Promise(resolve => setTimeout(resolve, 200));

  const credentials = INDEXER_DB[address] || [];

  return NextResponse.json({
    address: address,
    count: credentials.length,
    credentials: credentials,
    syncedAt: new Date().toISOString()
  });
}
