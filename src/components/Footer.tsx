'use client';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import { site } from '@/config/site';
import { colors, mq } from '@/theme';
import { Container, localePath } from './ui/Primitives';
import { Facebook, Instagram, Mail, Phone } from './ui/Icons';

const StyledFooter = styled.footer`
  position: relative;
  overflow: hidden;
  background: ${colors.brandDeep};
  color: ${colors.sageSoft};
  padding: 72px 0 32px;

  ${mq.mobile} {
    padding: 56px 0 28px;
  }
`;

const Decoration = styled.div`
  position: absolute;
  right: -80px;
  bottom: -60px;
  width: 360px;
  opacity: 0.08;
  pointer-events: none;

  ${mq.mobile} {
    width: 240px;
  }
`;

const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 48px;

  ${mq.tablet} {
    grid-template-columns: 1fr 1fr;
    gap: 40px 24px;
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Brand = styled.div`
  display: grid;
  gap: 20px;
  max-width: 340px;

  img {
    width: 88px;
    height: auto;
  }

  p {
    font-size: 15px;
    color: ${colors.sage};
  }
`;

const ColumnTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.white};
  margin-bottom: 16px;
`;

const LinkList = styled.ul`
  display: grid;
  gap: 10px;

  a {
    color: ${colors.sageSoft};
    text-decoration: none;
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  a:hover {
    color: ${colors.white};
    text-decoration: underline;
  }
`;

const Bottom = styled.div`
  position: relative;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid rgba(220, 233, 207, 0.2);
  font-size: 14px;
  color: ${colors.sage};
`;

export default function Footer({
  dictionary,
  nav,
  lang,
}: {
  dictionary: Dictionary['footer'];
  nav: Dictionary['nav'];
  lang: Locale;
}) {
  const href = (path: string) => localePath(lang, path);
  const hasSocial = site.facebookUrl || site.instagramUrl || site.email || site.phone;

  return (
    <StyledFooter>
      <Decoration aria-hidden="true">
        <Image src="/assets/logo/bird-white.svg" alt="" width={360} height={318} />
      </Decoration>
      <Container>
        <Grid>
          <Brand>
            <Image src="/assets/logo/bird-white.svg" alt="" width={88} height={78} />
            <p>{dictionary.tagline}</p>
          </Brand>
          <div>
            <ColumnTitle>{dictionary.explore}</ColumnTitle>
            <LinkList>
              <li>
                <Link href={href('/cdg')}>{nav.cdg}</Link>
              </li>
              <li>
                <Link href={href('/autism')}>{nav.autism}</Link>
              </li>
              <li>
                <Link href={href('/rare-diseases')}>{nav.rareDiseases}</Link>
              </li>
              <li>
                <Link href={href('/about')}>{nav.about}</Link>
              </li>
              <li>
                <Link href={href('/events')}>{nav.events}</Link>
              </li>
            </LinkList>
          </div>
          <div>
            <ColumnTitle>{dictionary.help}</ColumnTitle>
            <LinkList>
              <li>
                <Link href={href('/donate')}>{nav.donate}</Link>
              </li>
              <li>
                <Link href={href('/beneficiary')}>{nav.beneficiary}</Link>
              </li>
              <li>
                <Link href={href('/contact')}>{nav.contact}</Link>
              </li>
            </LinkList>
          </div>
          {hasSocial && (
            <div>
              <ColumnTitle>{dictionary.follow}</ColumnTitle>
              <LinkList>
                {site.facebookUrl && (
                  <li>
                    <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">
                      <Facebook size={18} /> Facebook
                    </a>
                  </li>
                )}
                {site.instagramUrl && (
                  <li>
                    <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                      <Instagram size={18} /> Instagram
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`}>
                      <Mail size={18} /> {site.email}
                    </a>
                  </li>
                )}
                {site.phone && (
                  <li>
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`}>
                      <Phone size={18} /> {site.phone}
                    </a>
                  </li>
                )}
              </LinkList>
            </div>
          )}
        </Grid>
        <Bottom>
          © {new Date().getFullYear()} {dictionary.rights}
        </Bottom>
      </Container>
    </StyledFooter>
  );
}
