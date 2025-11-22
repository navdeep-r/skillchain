
import { NextResponse } from 'next/server';
import { getCredentials } from '../../src/lib/db';

// USP: "Blind Verification" / Trusted Oracle
// The Verifier (Client) asks: "Does Address X know Python?"
// This server checks the DB and returns "Yes/No" + a cryptographic signature (mocked here).
// The client NEVER sees the grades or the actual certificate file.

export async function POST(request: Request) {
  try {
    const { studentAddress, skillName } = await request.json();

    if (!studentAddress || !skillName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Query the "Indexer" (Database)
    const credentials = await getCredentials(studentAddress);

    // 2. Logic Check
    const now = Math.floor(Date.now() / 1000);
    
    const validCredential = credentials.find(c => {
      const matchesSkill = c.courseName.toLowerCase().includes(skillName.toLowerCase());
      const isNotExpired = c.expirationDate === 0 || c.expirationDate > now;
      const isNotRevoked = !c.revoked;
      return matchesSkill && isNotExpired && isNotRevoked;
    });

    if (validCredential) {
      // 3. Generate "Proof" (In real ZK, this is a Snark Proof. Here, it's a server signature).
      const proofSignature = "0xSignedByOracle_" + Math.random().toString(36).substring(7);

      return NextResponse.json({ 
        verified: true, 
        method: "Off-Chain Oracle Verification",
        proof: proofSignature,
        timestamp: Date.now()
      });
    } else {
      return NextResponse.json({ 
        verified: false, 
        error: "No valid credential found for this skill." 
      }, { status: 200 }); // Return 200 so frontend handles the "false" gracefully
    }

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: 'Verification server error' }, { status: 500 });
  }
}
