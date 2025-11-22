
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // If PINATA_JWT is not set, we return a specific error or fallback for demo purposes
    if (!process.env.PINATA_JWT) {
      console.warn("Missing PINATA_JWT. Simulating IPFS hash for demo.");
      const mockHash = "Qm" + Math.random().toString(36).substring(2, 15) + "MockHashForDemo";
      return NextResponse.json({ 
        cid: `ipfs://${mockHash}`,
        status: "simulated",
        message: "Set PINATA_JWT in .env.local to use real IPFS"
      });
    }

    // Real Pinata Integration
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PINATA_JWT}`
      },
      body: JSON.stringify({
        pinataContent: body,
        pinataMetadata: {
          name: `${body.courseName || 'Credential'} - ${body.studentAddress}`
        }
      })
    });

    if (!pinataResponse.ok) {
      throw new Error(`Pinata Error: ${pinataResponse.statusText}`);
    }

    const pinataData = await pinataResponse.json();
    
    return NextResponse.json({ 
      cid: `ipfs://${pinataData.IpfsHash}`,
      status: "success",
      timestamp: pinataData.Timestamp
    });

  } catch (error: any) {
    console.error("IPFS Upload failed:", error);
    return NextResponse.json({ error: error.message || 'Failed to upload to IPFS' }, { status: 500 });
  }
}
