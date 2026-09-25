'use client';
import { useState } from 'react';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { site } from '@/config/site';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import {
  Card,
  CheckList,
  Container,
  ExternalButton,
  H2,
  H3,
  Section,
  Text,
} from '../ui/Primitives';
import { Apple, Bank, Card as CardIcon, Heart } from '../ui/Icons';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  ${mq.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Option = styled(Card)<{ $featured?: boolean }>`
  display: grid;
  gap: 16px;
  align-content: start;
  justify-items: start;
  background: ${({ $featured }) => ($featured ? colors.brandDark : colors.white)};
  border-color: ${({ $featured }) => ($featured ? colors.brandDark : colors.line)};

  h3 {
    color: ${({ $featured }) => ($featured ? colors.white : colors.ink)};
    font-size: 22px;
  }

  p {
    color: ${({ $featured }) => ($featured ? colors.sageSoft : colors.muted)};
    font-size: 16px;
  }
`;

const IconBadge = styled.span<{ $light?: boolean }>`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: ${({ $light }) => ($light ? 'rgba(255,255,255,0.14)' : colors.sageSoft)};
  color: ${({ $light }) => ($light ? colors.white : colors.brandDeep)};
`;

const Soon = styled.span<{ $light?: boolean }>`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  background: ${({ $light }) => ($light ? 'rgba(255,255,255,0.14)' : colors.cream)};
  color: ${({ $light }) => ($light ? colors.white : colors.brandDeep)};
`;

const Account = styled.div`
  width: 100%;
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${colors.creamSoft};
  border: 1px solid ${colors.line};
  font-size: 14px;

  code {
    font-family: inherit;
    font-weight: 700;
    font-size: 15px;
    word-break: break-all;
    color: ${colors.ink};
  }

  button {
    justify-self: start;
    border: 0;
    background: none;
    padding: 0;
    color: ${colors.brandDark};
    font-weight: 700;
    cursor: pointer;
  }
`;

const Impact = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 48px;
  align-items: start;

  ${mq.tablet} {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

function CopyRow({
  bank,
  iban,
  labels,
}: {
  bank: string;
  iban: string;
  labels: Dictionary['donate']['bank'];
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the IBAN stays selectable
    }
  };
  return (
    <Account>
      <span>{bank}</span>
      <code>{iban}</code>
      <button type="button" onClick={copy}>
        {copied ? labels.copied : labels.copy}
      </button>
    </Account>
  );
}

export default function Donate({
  dictionary,
  common,
}: {
  dictionary: Dictionary['donate'];
  common: Dictionary['common'];
}) {
  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <Grid>
            <Option $featured>
              <IconBadge $light>
                <CardIcon size={26} />
              </IconBadge>
              <H3>{dictionary.online.title}</H3>
              <Text>{dictionary.online.text}</Text>
              {site.donationPaymentUrl ? (
                <ExternalButton
                  href={site.donationPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  $variant="light"
                >
                  <Heart size={18} />
                  {dictionary.online.btn}
                </ExternalButton>
              ) : (
                <Soon $light>{common.comingSoon}</Soon>
              )}
            </Option>

            <Option>
              <IconBadge>
                <Apple size={26} />
              </IconBadge>
              <H3>{dictionary.applePay.title}</H3>
              <Text>{dictionary.applePay.text}</Text>
              {site.donationPaymentUrl ? (
                <ExternalButton
                  href={site.donationPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  $variant="secondary"
                >
                  <Apple size={18} />
                  Pay
                </ExternalButton>
              ) : (
                <Soon>{common.comingSoon}</Soon>
              )}
            </Option>

            <Option>
              <IconBadge>
                <Bank size={26} />
              </IconBadge>
              <H3>{dictionary.bank.title}</H3>
              <Text>{dictionary.bank.text}</Text>
              {site.bankAccounts.length > 0 ? (
                <>
                  {site.bankRecipient && (
                    <Text>
                      {dictionary.bank.recipient}: <strong>{site.bankRecipient}</strong>
                    </Text>
                  )}
                  {site.bankAccounts.map((a) => (
                    <CopyRow key={a.iban} bank={a.bank} iban={a.iban} labels={dictionary.bank} />
                  ))}
                  <Text>{dictionary.bank.purpose}</Text>
                </>
              ) : (
                <Soon>{common.comingSoon}</Soon>
              )}
            </Option>
          </Grid>
        </Container>
      </Section>
      <Section $tone="cream">
        <Container>
          <Impact>
            <H2>{dictionary.impact.title}</H2>
            <CheckList>
              {dictionary.impact.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </CheckList>
          </Impact>
        </Container>
      </Section>
    </>
  );
}
