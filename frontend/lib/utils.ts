
export function formatAddress(address: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getCredentialStatus(expiryDate: number): 'Active' | 'Expiring Soon' | 'Expired' {
  if (expiryDate === 0) {
    return 'Active';
  }

  const now = Math.floor(Date.now() / 1000);
  // 30 days in seconds
  const thirtyDays = 30 * 24 * 60 * 60;

  if (expiryDate < now) {
    return 'Expired';
  }

  if (expiryDate - now < thirtyDays) {
    return 'Expiring Soon';
  }

  return 'Active';
}
