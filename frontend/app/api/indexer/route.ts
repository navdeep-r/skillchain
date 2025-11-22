
import { NextResponse } from 'next/server';
import { addCredential } from '../../src/lib/db';

export async function POST(request: Request) {
  try {
    const credential = await request.json();
    
    // Validate basic fields
    if (!credential.id || !credential.studentAddress) {
      return NextResponse.json({ error: 'Invalid credential data' }, { status: 400 });
    }

    // Save to local JSON DB
    await addCredential(credential);

    return NextResponse.json({ success: true, message: 'Indexed successfully' });
  } catch (error) {
    console.error("Indexing failed:", error);
    return NextResponse.json({ error: 'Failed to index credential' }, { status: 500 });
  }
}
