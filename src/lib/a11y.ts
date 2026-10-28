export const A11Y_STORAGE_KEY = 'cdg-a11y';

export const TEXT_SCALES = [1, 1.125, 1.25, 1.5, 1.75] as const;

export const COLOR_MODES = [
  'none',
  'grayscale',
  'protanopia',
  'deuteranopia',
  'tritanopia',
] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

export type A11ySettings = {
  colorMode: ColorMode;
  largeCursor: boolean;
  hideImages: boolean;
  strongFocus: boolean;
  scaleIndex: number;
  highContrast: boolean;
  reduceMotion: boolean;
  readableText: boolean;
  underlineLinks: boolean;
};

export const defaultA11y: A11ySettings = {
  colorMode: 'none',
  largeCursor: false,
  hideImages: false,
  strongFocus: false,
  scaleIndex: 0,
  highContrast: false,
  reduceMotion: false,
  readableText: false,
  underlineLinks: false,
};

export function loadA11y(): A11ySettings {
  try {
    const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return defaultA11y;
    const parsed = { ...defaultA11y, ...JSON.parse(raw) } as A11ySettings;
    parsed.scaleIndex = Math.min(
      Math.max(Number(parsed.scaleIndex) || 0, 0),
      TEXT_SCALES.length - 1
    );
    if (!COLOR_MODES.includes(parsed.colorMode)) parsed.colorMode = 'none';
    return parsed;
  } catch {
    return defaultA11y;
  }
}

export function saveA11y(settings: A11ySettings) {
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be blocked; the settings then apply for this visit only.
  }
}

export function applyA11y(settings: A11ySettings) {
  const root = document.documentElement;
  root.style.setProperty('--a11y-scale', String(TEXT_SCALES[settings.scaleIndex]));
  const toggle = (name: string, on: boolean, value = '') =>
    on ? root.setAttribute(name, value) : root.removeAttribute(name);
  toggle('data-a11y-contrast', settings.highContrast, 'high');
  toggle('data-a11y-motion', settings.reduceMotion, 'reduced');
  toggle('data-a11y-readable', settings.readableText);
  toggle('data-a11y-links', settings.underlineLinks);
  toggle('data-a11y-color', settings.colorMode !== 'none', settings.colorMode);
  toggle('data-a11y-cursor', settings.largeCursor);
  toggle('data-a11y-images', settings.hideImages);
  toggle('data-a11y-focus', settings.strongFocus);
}

// Runs before first paint so saved settings never flash the default look.
export const a11yBootScript = `(function(){try{var s=JSON.parse(localStorage.getItem('${A11Y_STORAGE_KEY}')||'{}');var r=document.documentElement;var sc=[${TEXT_SCALES.join(',')}][s.scaleIndex|0]||1;r.style.setProperty('--a11y-scale',sc);if(s.highContrast)r.setAttribute('data-a11y-contrast','high');if(s.reduceMotion)r.setAttribute('data-a11y-motion','reduced');if(s.readableText)r.setAttribute('data-a11y-readable','');if(s.underlineLinks)r.setAttribute('data-a11y-links','');if(s.colorMode&&s.colorMode!=='none')r.setAttribute('data-a11y-color',s.colorMode);if(s.largeCursor)r.setAttribute('data-a11y-cursor','');if(s.hideImages)r.setAttribute('data-a11y-images','');if(s.strongFocus)r.setAttribute('data-a11y-focus','')}catch(e){}})();`;
