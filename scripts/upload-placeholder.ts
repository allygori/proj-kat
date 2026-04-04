import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const filePath = path.join(process.cwd(), 'public/images/placeholder.jpg');
  const buffer = fs.readFileSync(filePath);
  
  const blob = await put('placeholder.jpg', buffer, { access: 'public' });
  console.log('Uploaded successfully to:', blob.url);
}

main().catch(console.error);
