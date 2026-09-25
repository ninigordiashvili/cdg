'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import { colors } from '@/theme';
import { ButtonLink, Container, localePath } from './ui/Primitives';
import { Heart } from './ui/Icons';

const NAV_BREAKPOINT = '1180px';

const StyledHeader = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ $scrolled }) => ($scrolled ? 'rgba(253, 252, 247, 0.94)' : colors.bg)};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ $scrolled }) => ($scrolled ? colors.line : 'transparent')};
  transition: border-color 0.2s ease;
`;

const Bar = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 84px;

  @media (max-width: ${NAV_BREAKPOINT}) {
    height: 68px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  flex-shrink: 0;

  img {
    height: 52px;
    width: auto;
  }

  @media (max-width: ${NAV_BREAKPOINT}) {
    img {
      height: 42px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: ${NAV_BREAKPOINT}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
  color: ${({ $active }) => ($active ? colors.brandDark : colors.ink)};
  background: ${({ $active }) => ($active ? colors.sageSoft : 'transparent')};

  &:hover {
    color: ${colors.brandDark};
  }
`;

const Dropdown = styled.div`
  position: relative;

  &:hover > div,
  &:focus-within > div {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
`;

const DropdownTrigger = styled.button<{ $active?: boolean }>`
  display: flex;
  white-space: nowrap;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border: 0;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => ($active ? colors.brandDark : colors.ink)};
  background: ${({ $active }) => ($active ? colors.sageSoft : 'transparent')};

  &:hover {
    color: ${colors.brandDark};
  }
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 8px);
  min-width: 240px;
  padding: 8px;
  margin-top: 4px;
  background: ${colors.white};
  border: 1px solid ${colors.line};
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(47, 52, 50, 0.12);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  a {
    display: block;
    padding: 12px 14px;
    border-radius: 10px;
    font-weight: 700;
    text-decoration: none;
    color: ${colors.ink};
  }

  a:hover {
    background: ${colors.creamSoft};
    color: ${colors.brandDark};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LangSwitch = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${colors.line};
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  color: ${colors.ink};

  &:hover {
    border-color: ${colors.brandDark};
    color: ${colors.brandDark};
  }
`;

const DonateButton = styled(ButtonLink)`
  min-height: 44px;
  padding: 10px 20px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const Burger = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: ${colors.sageSoft};
  cursor: pointer;
  position: relative;

  @media (max-width: ${NAV_BREAKPOINT}) {
    display: block;
  }

  span {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: ${colors.ink};
    transition: transform 0.25s ease;
  }

  span:nth-child(1) {
    top: 17px;
  }
  span:nth-child(2) {
    top: 25px;
  }

  &[aria-expanded='true'] span:nth-child(1) {
    transform: translateY(4px) rotate(45deg);
  }
  &[aria-expanded='true'] span:nth-child(2) {
    transform: translateY(-4px) rotate(-45deg);
  }
`;

const Drawer = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: ${NAV_BREAKPOINT}) {
    display: block;
    position: fixed;
    inset: 68px 0 0 0;
    background: ${colors.bg};
    overflow-y: auto;
    padding: 16px 16px 40px;
    transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition:
      transform 0.3s ease,
      visibility 0.3s;
  }
`;

const DrawerGroupTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.muted};
  padding: 20px 8px 8px;
`;

const DrawerSpacer = styled.div`
  height: 16px;
`;

const DrawerLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 14px 8px;
  border-bottom: 1px solid ${colors.line};
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  color: ${({ $active }) => ($active ? colors.brandDark : colors.ink)};
`;

const DrawerDonate = styled(ButtonLink)`
  margin-top: 28px;
  width: 100%;
`;

export default function Header({
  dictionary,
  lang,
}: {
  dictionary: Dictionary['nav'];
  lang: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const pathWithoutLocale = pathname.replace(`/${lang}`, '') || '';
  const alternate: Locale = lang === 'en' ? 'ge' : 'en';

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const href = (path: string) => localePath(lang, path);
  const isActive = (path: string) => pathWithoutLocale === path;

  const learnLinks = [
    { path: '/cdg', title: dictionary.cdg },
    { path: '/autism', title: dictionary.autism },
    { path: '/rare-diseases', title: dictionary.rareDiseases },
  ];
  const mainLinks = [
    { path: '/about', title: dictionary.about },
    { path: '/events', title: dictionary.events },
    { path: '/beneficiary', title: dictionary.beneficiary },
    { path: '/contact', title: dictionary.contact },
  ];

  return (
    <StyledHeader $scrolled={scrolled}>
      <Bar>
        <Logo href={href('')} aria-label={dictionary.home}>
          <Image
            src="/assets/logo/logo-horizontal-green.svg"
            alt="Foundation for CDG Syndrome and Autism"
            width={170}
            height={52}
            priority
          />
        </Logo>

        <Nav aria-label="Main">
          <NavLink href={href('')} $active={isActive('')}>
            {dictionary.home}
          </NavLink>
          <Dropdown>
            <DropdownTrigger
              type="button"
              aria-haspopup="true"
              $active={learnLinks.some((l) => isActive(l.path))}
            >
              {dictionary.learn}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </DropdownTrigger>
            <DropdownPanel>
              {learnLinks.map((l) => (
                <Link key={l.path} href={href(l.path)}>
                  {l.title}
                </Link>
              ))}
            </DropdownPanel>
          </Dropdown>
          {mainLinks.map((l) => (
            <NavLink key={l.path} href={href(l.path)} $active={isActive(l.path)}>
              {l.title}
            </NavLink>
          ))}
        </Nav>

        <Actions>
          <LangSwitch
            href={`/${alternate}${pathWithoutLocale}`}
            aria-label={dictionary.switchLang}
            lang={alternate === 'ge' ? 'ka' : 'en'}
          >
            {dictionary.switchLangShort}
          </LangSwitch>
          <DonateButton href={href('/donate')}>
            <Heart size={18} />
            {dictionary.donate}
          </DonateButton>
          <Burger
            type="button"
            aria-label={open ? dictionary.close : dictionary.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </Burger>
        </Actions>
      </Bar>

      <Drawer id="mobile-menu" $open={open} aria-hidden={!open}>
        <DrawerLink href={href('')} $active={isActive('')}>
          {dictionary.home}
        </DrawerLink>
        <DrawerGroupTitle>{dictionary.learn}</DrawerGroupTitle>
        {learnLinks.map((l) => (
          <DrawerLink key={l.path} href={href(l.path)} $active={isActive(l.path)}>
            {l.title}
          </DrawerLink>
        ))}
        <DrawerSpacer />
        {mainLinks.map((l) => (
          <DrawerLink key={l.path} href={href(l.path)} $active={isActive(l.path)}>
            {l.title}
          </DrawerLink>
        ))}
        <DrawerDonate href={href('/donate')}>
          <Heart size={18} />
          {dictionary.donate}
        </DrawerDonate>
      </Drawer>
    </StyledHeader>
  );
}
