import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { getCredentials } from '../../../../src/lib/db';

// Global In-Memory Store for Access Logs (MVP only)
// In production, use Redis or a database table to persist this.
// Maps nonce -> currentViewCount
const accessLogs = new Map<string, number>(); 

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
    }

    // 1. Decode Token (Base64 -> JSON)
    let decodedData;
    try {
      const jsonString = atob(token);
      decodedData = JSON.parse(jsonString);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    const { payload, signature } = decodedData;
    const { action, credentialId, nonce, maxViews } = payload;

    if (action !== 'share_access' || !credentialId || !nonce || !signature) {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    // 2. Recover Signer Address from Signature
    const message = JSON.stringify(payload);
    const signerAddress = ethers.verifyMessage(message, signature);

    // 3. Check Access Limits (The "Gateway" Logic)
    const currentViews = accessLogs.get(nonce) || 0;

    if (currentViews >= maxViews) {
      return NextResponse.json({ error: 'Access Link Expired: Max views reached.' }, { status: 403 });
    }

    // 4. Increment View Count
    accessLogs.set(nonce, currentViews + 1);

    // 5. Fetch and Verify Credential Ownership
    // We must ensure the signer actually owns the credential they are sharing.
    const userCredentials = await getCredentials(signerAddress);
    const credential = userCredentials.find(c => c.id === credentialId);

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found or does not belong to signer.' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      credential,
      viewsLeft: maxViews - (currentViews + 1),
      ownerAddress: signerAddress
    });

  } catch (error) {
    console.error("Access Token Validation Error:", error);
    return NextResponse.json({ error: 'Internal Server Validation Error' }, { status: 500 });
  }
}