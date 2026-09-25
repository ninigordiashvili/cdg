'use client';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { colors, mq } from '@/theme';

export const Container = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;

  ${mq.mobile} {
    padding: 0 16px;
  }
`;

export const Section = styled.section<{ $tone?: 'plain' | 'cream' | 'sage' }>`
  padding: 96px 0;
  background: ${({ $tone }) =>
    $tone === 'cream' ? colors.cream : $tone === 'sage' ? colors.sageSoft : 'transparent'};

  ${mq.tablet} {
    padding: 64px 0;
  }
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.brandDark};
  margin-bottom: 12px;
`;

export const H1 = styled.h1`
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 700;
  color: ${colors.ink};
  font-feature-settings: 'case';
`;

export const H2 = styled.h2`
  font-size: clamp(26px, 3.4vw, 40px);
  font-weight: 700;
  color: ${colors.ink};
  font-feature-settings: 'case';
`;

export const H3 = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.ink};
`;

export const Lead = styled.p`
  font-size: 18px;
  color: ${colors.muted};
  max-width: 720px;

  ${mq.mobile} {
    font-size: 16px;
  }
`;

export const Text = styled.p`
  font-size: 17px;
  color: ${colors.muted};

  ${mq.mobile} {
    font-size: 16px;
  }
`;

const buttonStyles = css<{ $variant?: 'primary' | 'secondary' | 'light' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 12px 26px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background: ${colors.brandDark};
          color: ${colors.white};
          &:hover {
            background: ${colors.brandDeep};
          }
        `
      : $variant === 'light'
        ? css`
            background: ${colors.white};
            color: ${colors.brandDeep};
            &:hover {
              background: ${colors.creamSoft};
            }
          `
        : css`
            background: transparent;
            color: ${colors.brandDeep};
            border-color: ${colors.brandDark};
            &:hover {
              background: ${colors.brandDark};
              color: ${colors.white};
            }
          `}

  ${mq.mobile} {
    width: 100%;
  }
`;

export const ButtonLink = styled(Link)<{ $variant?: 'primary' | 'secondary' | 'light' }>`
  ${buttonStyles}
`;

export const ExternalButton = styled.a<{ $variant?: 'primary' | 'secondary' | 'light' }>`
  ${buttonStyles}
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'light' }>`
  ${buttonStyles}
`;

export const Card = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.line};
  border-radius: 24px;
  padding: 32px;

  ${mq.mobile} {
    padding: 24px;
    border-radius: 20px;
  }
`;

export const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: ${colors.brandDark};
  text-decoration: none;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

export const CheckList = styled.ul`
  display: grid;
  gap: 12px;

  li {
    position: relative;
    padding-left: 32px;
    color: ${colors.muted};
    font-size: 17px;

    ${mq.mobile} {
      font-size: 16px;
    }
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.sageSoft}
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M6 10.5l2.5 2.5L14 7.5' fill='none' stroke='%23067A38' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      center / 20px no-repeat;
  }
`;

export const localePath = (lang: string, path = '') => `/${lang}${path}`;
