// Certifikat (brief 69). DUMMYDATA (Fas 0): namn och en rads förklaring av vad
// märkningen betyder, för visning på företagsprofilen. Ingen verifiering och
// inga länkar ut; vilka företag som har vilka certifikat är påhittat.
import type { Certification } from '../types/catalog';

export const CERTIFICATIONS = {
  gots: {
    id: 'gots',
    name: 'GOTS',
    issuer: 'Global Organic Textile Standard',
    description: 'Textilier av ekologiska fibrer, med krav på kemikalier och arbetsvillkor i hela kedjan.',
  },
  oekoTex: {
    id: 'oeko-tex',
    name: 'Oeko-Tex',
    issuer: 'OEKO-TEX',
    description: 'Textilier testade för skadliga ämnen.',
  },
  svanen: {
    id: 'svanen',
    name: 'Svanen',
    issuer: 'Miljömärkning Sverige',
    description: 'Nordisk miljömärkning med krav på miljö, klimat och hälsa under hela livscykeln.',
  },
  fairtrade: {
    id: 'fairtrade',
    name: 'Fairtrade',
    issuer: 'Fairtrade International',
    description: 'Odlare och anställda får bättre villkor och ett minimipris för råvaran.',
  },
} satisfies Record<string, Certification>;
