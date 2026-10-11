/**
 * Aryan Electronics - Product Images & Fallback Asset Provider
 * High-definition vector graphics and verified image endpoints matching screenshot
 */

export const getDealOrProductImage = (title) => {
  const t = (title || '').toLowerCase();

  if (t.includes('logitech g502')) {
    return '/images/products/logitech_g502.jpg';
  }

  if (t.includes('benq') || t.includes('gw2485')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
        <rect width="100%" height="100%" fill="#ffffff" />
        <rect x="30" y="25" width="240" height="150" rx="6" fill="#1e293b" stroke="#334155" stroke-width="3" />
        <rect x="36" y="31" width="228" height="138" rx="3" fill="#0284c7" />
        <path d="M36 120 L90 80 L140 115 L190 75 L264 125 L264 169 L36 169 Z" fill="#0369a1" />
        <path d="M80 169 L130 110 L180 150 L230 95 L264 120 L264 169 Z" fill="#0ea5e9" opacity="0.6" />
        <rect x="138" y="175" width="24" height="35" fill="#334155" />
        <rect x="110" y="210" width="80" height="8" rx="4" fill="#1e293b" />
        <text x="150" y="160" font-family="system-ui, sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle" font-weight="bold">BenQ</text>
      </svg>
    `)}`;
  }

  if (t.includes('epson') || t.includes('ecotank') || t.includes('l3250')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
        <rect width="100%" height="100%" fill="#ffffff" />
        <rect x="40" y="65" width="220" height="115" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2" />
        <rect x="60" y="45" width="180" height="22" rx="4" fill="#0f172a" />
        <rect x="55" y="80" width="120" height="40" rx="3" fill="#0f172a" />
        <rect x="195" y="80" width="50" height="30" rx="3" fill="#0284c7" />
        <circle cx="210" cy="95" r="4" fill="#38bdf8" />
        <circle cx="230" cy="95" r="4" fill="#38bdf8" />
        <rect x="55" y="135" width="190" height="30" rx="4" fill="#334155" />
        <text x="75" y="153" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8" font-weight="bold">EPSON EcoTank</text>
      </svg>
    `)}`;
  }

  if (t.includes('samsung 27') || t.includes('smart monitor')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
        <rect width="100%" height="100%" fill="#ffffff" />
        <rect x="25" y="20" width="250" height="155" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="3" />
        <rect x="30" y="25" width="240" height="145" rx="2" fill="#1e3a8a" />
        <path d="M30 110 L90 60 L160 115 L210 70 L270 120 L270 170 L30 170 Z" fill="#2563eb" />
        <circle cx="230" cy="55" r="16" fill="#fbbf24" opacity="0.8" />
        <rect x="140" y="175" width="20" height="32" fill="#475569" />
        <rect x="110" y="207" width="80" height="6" rx="3" fill="#334155" />
        <text x="150" y="162" font-family="system-ui, sans-serif" font-size="8" fill="#cbd5e1" text-anchor="middle" font-weight="bold">SAMSUNG</text>
      </svg>
    `)}`;
  }

  if (t.includes('laserjet') || t.includes('m126nw')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
        <rect width="100%" height="100%" fill="#ffffff" />
        <rect x="45" y="55" width="210" height="130" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2" />
        <rect x="65" y="38" width="170" height="20" rx="4" fill="#0f172a" />
        <rect x="60" y="70" width="180" height="40" rx="3" fill="#0f172a" />
        <rect x="65" y="125" width="170" height="45" rx="4" fill="#334155" />
        <circle cx="215" cy="90" r="12" fill="#0096d6" />
        <text x="215" y="94" font-family="system-ui, sans-serif" font-size="9" fill="#ffffff" text-anchor="middle" font-weight="bold" font-style="italic">hp</text>
        <text x="80" y="93" font-family="system-ui, sans-serif" font-size="9" fill="#94a3b8" font-weight="bold">LaserJet Pro</text>
      </svg>
    `)}`;
  }

  if (t.includes('airdopes') || t.includes('boat')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
        <rect width="100%" height="100%" fill="#ffffff" />
        <rect x="80" y="80" width="140" height="95" rx="28" fill="#1e293b" stroke="#334155" stroke-width="2" />
        <rect x="85" y="85" width="130" height="25" rx="10" fill="#0f172a" />
        <circle cx="120" cy="125" r="16" fill="#334155" />
        <circle cx="180" cy="125" r="16" fill="#334155" />
        <rect x="116" y="125" width="8" height="28" rx="4" fill="#475569" />
        <rect x="176" y="125" width="8" height="28" rx="4" fill="#475569" />
        <circle cx="150" cy="155" r="3" fill="#ef4444" />
        <text x="150" y="102" font-family="system-ui, sans-serif" font-size="9" fill="#e2e8f0" text-anchor="middle" font-weight="bold">boAt</text>
      </svg>
    `)}`;
  }

  return null;
};
