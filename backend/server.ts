import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// In-memory storage for MVP
const credentialsStore: any[] = [];

// 1. Get Student Credentials
app.get('/api/student/:address', (req, res) => {
    const { address } = req.params;
    console.log(`[API] Fetching credentials for ${address}`);
    const studentCredentials = credentialsStore.filter(c => c.studentAddress.toLowerCase() === address.toLowerCase());
    console.log(`[API] Found ${studentCredentials.length} credentials`);
    res.json({ credentials: studentCredentials });
});

// 2. Mock IPFS Upload
app.post('/api/files', (req, res) => {
    // In a real app, upload to Pinata/IPFS
    const cid = "QmHash" + Math.random().toString(36).substring(7);
    res.json({ cid });
});

// 3. Indexer (Store Credential)
app.post('/api/indexer', (req, res) => {
    const credential = req.body;
    credentialsStore.push(credential);
    console.log("Indexed credential:", credential.id);
    res.json({ success: true });
});

// 4. ZK Verification Mock
app.post('/api/verify-zk', (req, res) => {
    // Mock verification logic
    res.json({ verified: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
