'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import {
  applyA11y,
  COLOR_MODES,
  defaultA11y,
  loadA11y,
  saveA11y,
  TEXT_SCALES,
  type ColorMode,
  type A11ySettings,
} from '@/lib/a11y';
import { colors } from '@/theme';

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  min-width: 48px;
  padding: 0;
  border: 2px solid ${colors.brandDark};
  border-radius: 50%;
  background: ${colors.brandDark};
  color: ${colors.white};
  cursor: pointer;

  svg {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${colors.brandDeep};
    border-color: ${colors.brandDeep};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(14, 59, 36, 0.55);
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 201;
  width: min(440px, 100%);
  overflow-y: auto;
  padding: 28px 24px 40px;
  background: ${colors.white};
  color: ${colors.ink};
  border-left: 1px solid ${colors.line};
  box-shadow: -18px 0 40px rgba(47, 52, 50, 0.18);
`;

const PanelHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h2 {
    font-size: 1.5rem;
  }
`;

const Note = styled.p`
  margin-top: 8px;
  color: ${colors.muted};
  font-size: 0.9375rem;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 1px solid ${colors.line};
  border-radius: 10px;
  background: ${colors.creamSoft};
  color: ${colors.ink};
  cursor: pointer;
`;

const GroupTitle = styled.h3`
  margin: 28px 0 12px;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.muted};
`;

const SizeRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  gap: 12px;
  text-align: center;
  font-weight: 700;
`;

const SizeButton = styled.button`
  height: 52px;
  border: 1px solid ${colors.line};
  border-radius: 10px;
  background: ${colors.creamSoft};
  color: ${colors.ink};
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
`;

const ColorButton = styled.button`
  min-height: 48px;
  padding: 8px 12px;
  border: 2px solid ${colors.line};
  border-radius: 12px;
  background: ${colors.creamSoft};
  color: ${colors.ink};
  font-weight: 700;
  cursor: pointer;

  &[aria-pressed='true'] {
    border-color: ${colors.brandDark};
    background: ${colors.brandDark};
    color: ${colors.white};
  }
`;

const OptionList = styled.ul`
  display: grid;
  gap: 12px;
`;

const Option = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${colors.line};
  border-radius: 12px;
  background: ${colors.creamSoft};

  strong {
    display: block;
  }

  span {
    display: block;
    margin-top: 4px;
    color: ${colors.muted};
    font-size: 0.9375rem;
  }
`;

const Switch = styled.button`
  flex-shrink: 0;
  min-width: 112px;
  min-height: 44px;
  padding: 8px 16px;
  border: 2px solid ${colors.brandDark};
  border-radius: 999px;
  background: ${colors.white};
  color: ${colors.brandDeep};
  font-weight: 700;
  cursor: pointer;

  &[aria-pressed='true'] {
    background: ${colors.brandDark};
    color: ${colors.white};
  }
`;

const ResetButton = styled.button`
  margin-top: 24px;
  width: 100%;
  min-height: 48px;
  border: 2px solid ${colors.line};
  border-radius: 999px;
  background: transparent;
  color: ${colors.ink};
  font-weight: 700;
  cursor: pointer;
`;

type Toggle =
  | 'highContrast'
  | 'reduceMotion'
  | 'readableText'
  | 'underlineLinks'
  | 'largeCursor'
  | 'hideImages'
  | 'strongFocus';

export default function AccessibilityMenu({ dictionary }: { dictionary: Dictionary['a11y'] }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaultA11y);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const colorId = useId();

  useEffect(() => setSettings(loadA11y()), []);

  const update = useCallback((next: A11ySettings) => {
    setSettings(next);
    applyA11y(next);
    saveA11y(next);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('button')?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab' || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>('button:not(:disabled)');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const options: { key: Toggle; title: string; hint: string }[] = [
    { key: 'highContrast', title: dictionary.contrast, hint: dictionary.contrastHint },
    { key: 'reduceMotion', title: dictionary.motion, hint: dictionary.motionHint },
    { key: 'readableText', title: dictionary.readable, hint: dictionary.readableHint },
    { key: 'underlineLinks', title: dictionary.links, hint: dictionary.linksHint },
    { key: 'strongFocus', title: dictionary.focus, hint: dictionary.focusHint },
    { key: 'largeCursor', title: dictionary.cursor, hint: dictionary.cursorHint },
    { key: 'hideImages', title: dictionary.images, hint: dictionary.imagesHint },
  ];

  const percent = Math.round(TEXT_SCALES[settings.scaleIndex] * 100);

  return (
    <>
      <Trigger
        ref={triggerRef}
        type="button"
        aria-label={dictionary.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path
            d="M4.5 8.5l7.5 1.2 7.5-1.2M12 9.7V15m0 0l-3.5 5.5M12 15l3.5 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Trigger>

      {open &&
        createPortal(
          <>
            <Backdrop onClick={close} />
            <Panel ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
              <PanelHead>
                <div>
                  <h2 id={titleId}>{dictionary.title}</h2>
                  <Note>{dictionary.saved}</Note>
                </div>
                <CloseButton type="button" aria-label={dictionary.close} onClick={close}>
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </CloseButton>
              </PanelHead>

              <GroupTitle>{dictionary.textSize}</GroupTitle>
              <SizeRow>
                <SizeButton
                  type="button"
                  aria-label={dictionary.smaller}
                  disabled={settings.scaleIndex === 0}
                  onClick={() => update({ ...settings, scaleIndex: settings.scaleIndex - 1 })}
                >
                  A−
                </SizeButton>
                <span aria-live="polite">
                  {percent === 100 ? dictionary.normal : `${percent}%`}
                </span>
                <SizeButton
                  type="button"
                  aria-label={dictionary.larger}
                  disabled={settings.scaleIndex === TEXT_SCALES.length - 1}
                  onClick={() => update({ ...settings, scaleIndex: settings.scaleIndex + 1 })}
                >
                  A+
                </SizeButton>
              </SizeRow>

              <GroupTitle id={colorId}>{dictionary.colors}</GroupTitle>
              <ColorGrid role="group" aria-labelledby={colorId}>
                {COLOR_MODES.map((mode: ColorMode) => (
                  <ColorButton
                    key={mode}
                    type="button"
                    aria-pressed={settings.colorMode === mode}
                    onClick={() => update({ ...settings, colorMode: mode })}
                  >
                    {dictionary.colorModes[mode]}
                  </ColorButton>
                ))}
              </ColorGrid>

              <GroupTitle>{dictionary.modes}</GroupTitle>
              <OptionList>
                {options.map((o) => (
                  <Option key={o.key}>
                    <div>
                      <strong>{o.title}</strong>
                      <span>{o.hint}</span>
                    </div>
                    <Switch
                      type="button"
                      aria-pressed={settings[o.key]}
                      aria-label={o.title}
                      onClick={() => update({ ...settings, [o.key]: !settings[o.key] })}
                    >
                      {settings[o.key] ? dictionary.on : dictionary.off}
                    </Switch>
                  </Option>
                ))}
              </OptionList>

              <ResetButton type="button" onClick={() => update(defaultA11y)}>
                {dictionary.reset}
              </ResetButton>
            </Panel>
          </>,
          document.body
        )}
    </>
  );
}
