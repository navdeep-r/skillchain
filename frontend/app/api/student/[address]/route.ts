
import { NextResponse } from 'next/server';
import { getCredentials } from '../../../src/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    // Fetch from our local JSON "Database"
    const credentials = await getCredentials(address);

    return NextResponse.json({
      address: address,
      count: credentials.length,
      credentials: credentials,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Indexer failed' }, { status: 500 });
  }
}
