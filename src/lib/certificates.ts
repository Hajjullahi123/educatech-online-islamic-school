import crypto from 'crypto';

export interface CertificateData {
  studentName: string;
  teacherName: string;
  riwayah: string;
  completionDate: string;
}

export function generateCertificateHash(data: CertificateData): string {
  const salt = process.env.CERT_SALT;
  if (!salt) {
    throw new Error('CERT_SALT environment variable is required');
  }
  const content = `${data.studentName}|${data.teacherName}|${data.riwayah}|${data.completionDate}|${salt}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function verifyCertificate(hashToVerify: string, data: CertificateData): boolean {
  const expectedHash = generateCertificateHash(data);
  // Use timing-safe comparison to prevent timing attacks
  const a = Buffer.from(hashToVerify, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
