// Simple token verification for Edge runtime
// In production, use a proper Edge-compatible JWT library

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

export function verifyTokenEdge(token: string): TokenPayload | null {
  try {
    // For development, we'll do a simple base64 decode
    // The JWT format is header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (middle part)
    const payload = parts[1];
    if (!payload) {
      return null;
    }
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(decodedPayload) as TokenPayload;
    
    // Check expiration
    if (parsed.exp && parsed.exp < Date.now() / 1000) {
      console.log('Token expired');
      return null;
    }
    
    // In development, accept any properly formatted token
    // In production, you'd verify the signature
    return parsed;
  } catch (error) {
    console.error('Edge token verification error:', error);
    return null;
  }
}