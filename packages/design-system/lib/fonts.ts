import { cn } from '@packages/design-system/lib/utils';
import { DM_Mono, DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
    display: "swap",
    subsets: ["latin"],
    variable: "--font-dm-sans"
})
const dmMono = DM_Mono({
    display: 'swap',
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    variable: '--font-dm-mono'
})

export const fonts = cn(
  dmSans.variable,
  dmMono.variable,
  'touch-manipulation font-sans antialiased'
);
