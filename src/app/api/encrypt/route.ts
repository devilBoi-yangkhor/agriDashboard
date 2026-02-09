import { NextResponse } from 'next/server';
import { createCipheriv, randomBytes, scryptSync, createDecipheriv } from 'crypto';

// Type definitions
interface RequestBody {
  text: string;
  password: string;
  action: 'encrypt' | 'decrypt';
}

// Encryption function
function encrypt(text: string, password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

// Decryption function
function decrypt(encryptedText: string, password: string): string {
  const [salt, iv, authTag, content] = encryptedText.split(':');
  const key = scryptSync(password, Buffer.from(salt, 'hex'), 32);
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function POST(request: Request) {
  try {
    const { text, password, action }: RequestBody = await request.json();
    
    if (!text || !password || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'encrypt') {
      const encrypted = encrypt(text, password);
      // console.log(encrypted)
      return NextResponse.json({ result: encrypted });
    } 
    else if (action === 'decrypt') {
      // console.log("action:", action, "decrypted-text:",text, "password:",password)
      const decrypted = decrypt(text, password);
      return NextResponse.json({ result: decrypted });
    }
    else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption/decryption failed' },
      { status: 500 }
    );
  }
}

// Optionally add other HTTP methods if needed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}