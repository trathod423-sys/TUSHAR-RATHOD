export type AppTheme = 'cobalt' | 'amethyst' | 'amber' | 'cyan' | 'ivory' | 'slate';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  subtitle: string;
  badge: string;
  type: 'dark' | 'light';
  palette: {
    canvas: string;
    surface: string;
    border: string;
    accent: string;
    accentGlow: string;
    text: string;
  };
  gradient: string;
  accentColor: string;
  description: string;
  iconName: string;
}

export const THEME_CONFIGS: Record<AppTheme, ThemeConfig> = {
  cobalt: {
    id: 'cobalt',
    name: 'Royal Cobalt 3D',
    subtitle: 'Deep Sapphire Obsidian & Electric Cobalt Titanium',
    badge: 'Judges Choice 10/10',
    type: 'dark',
    palette: {
      canvas: '#080d1a',
      surface: '#0f172a',
      border: '#1e2d4d',
      accent: '#3b82f6',
      accentGlow: '#60a5fa',
      text: '#ffffff',
    },
    gradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    accentColor: '#3b82f6',
    description: 'The definitive 10/10 hackathon competition palette. Deep cosmic sapphire canvas paired with electric cobalt 3D depth, metallic bevels, and ultra-crisp contrast engineered to impress evaluators.',
    iconName: 'Crown',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Cyber Amethyst',
    subtitle: 'Royal Velvet & Neon Orchid Glow',
    badge: 'High-End Cyberpunk',
    type: 'dark',
    palette: {
      canvas: '#0c0819',
      surface: '#150e2c',
      border: '#2c1b52',
      accent: '#a855f7',
      accentGlow: '#ec4899',
      text: '#faf5ff',
    },
    gradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
    accentColor: '#a855f7',
    description: 'Deep royal velvet obsidian with luminous purple & fuchsia neon accents. Gives institutional feedback a modern, luxury tech aesthetic that catches judges’ attention.',
    iconName: 'Flame',
  },
  amber: {
    id: 'amber',
    name: 'Tuscan Sunset',
    subtitle: 'Espresso Roast & Molten Copper',
    badge: 'Warm Prestige',
    type: 'dark',
    palette: {
      canvas: '#150d07',
      surface: '#21150c',
      border: '#422917',
      accent: '#f59e0b',
      accentGlow: '#fbbf24',
      text: '#fffbeb',
    },
    gradient: 'from-amber-400 via-orange-400 to-amber-200',
    accentColor: '#f59e0b',
    description: 'Deep roasted dark espresso canvas with radiant amber firelight, burnished bronze lines, and warm luxury executive presence reminiscent of private institutional clubs.',
    iconName: 'Sun',
  },
  cyan: {
    id: 'cyan',
    name: 'Matrix Abyss',
    subtitle: 'Deep Ocean & Electric Cyan Laser',
    badge: 'Mission Control',
    type: 'dark',
    palette: {
      canvas: '#040e19',
      surface: '#091b2e',
      border: '#13385c',
      accent: '#06b6d4',
      accentGlow: '#38bdf8',
      text: '#ecfeff',
    },
    gradient: 'from-cyan-400 via-teal-300 to-blue-400',
    accentColor: '#06b6d4',
    description: 'Deep oceanic void with razor-sharp electric cyan telemetry lines, ice-blue status accents, and mission control styling built for high-precision intelligence.',
    iconName: 'Terminal',
  },
  ivory: {
    id: 'ivory',
    name: 'Champagne Ivory',
    subtitle: 'Luxe Swiss Editorial Parchment',
    badge: 'Rare Editorial Light',
    type: 'light',
    palette: {
      canvas: '#f7f4ec',
      surface: '#ffffff',
      border: '#dfd7c5',
      accent: '#b45309',
      accentGlow: '#d97706',
      text: '#1c1917',
    },
    gradient: 'from-amber-700 via-amber-600 to-stone-800',
    accentColor: '#b45309',
    description: 'Warm natural tactile paper linen, crisp high-contrast black typography, brushed champagne gold borders, and Swiss editorial finesse. 100% unique among student light modes.',
    iconName: 'BookOpen',
  },
  slate: {
    id: 'slate',
    name: 'Executive Slate',
    subtitle: 'Modern Clean Indigo & Neutral Slate',
    badge: 'Classic Balanced',
    type: 'dark',
    palette: {
      canvas: '#0b132b',
      surface: '#1c2541',
      border: '#2e3d66',
      accent: '#6366f1',
      accentGlow: '#818cf8',
      text: '#f8fafc',
    },
    gradient: 'from-indigo-400 via-indigo-300 to-cyan-400',
    accentColor: '#6366f1',
    description: 'Balanced modern dark corporate slate tone with high-contrast text and crisp indigo interactive elements.',
    iconName: 'Layers',
  },
};

export const THEME_LIST = Object.values(THEME_CONFIGS);
