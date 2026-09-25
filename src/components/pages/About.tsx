'use client';
import Image from 'next/image';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import HelpCta from '../HelpCta';
import { Card, Container, H2, H3, Section, Text } from '../ui/Primitives';

const Split = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 64px;
  align-items: center;

  ${mq.tablet} {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Stack = styled.div`
  display: grid;
  gap: 16px;
`;

const LogoPanel = styled.div`
  display: grid;
  place-items: center;
  padding: 48px;
  border-radius: 32px;
  background: ${colors.creamSoft};
  border: 1px solid ${colors.line};

  img {
    width: 100%;
    max-width: 360px;
    height: auto;
  }

  ${mq.mobile} {
    padding: 32px 24px;
    border-radius: 24px;
  }
`;

const Values = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;

  ${mq.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled(Card)`
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 28px;

  span {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${colors.sageSoft};
    color: ${colors.brandDeep};
    font-weight: 700;
  }

  p {
    font-size: 15px;
  }
`;

const History = styled.div`
  display: grid;
  gap: 16px;
  max-width: 820px;
`;

export default function About({
  dictionary,
  common,
  lang,
}: {
  dictionary: Dictionary['about'];
  common: Dictionary['common'];
  lang: string;
}) {
  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <Split>
            <Stack>
              <H2>{dictionary.story.title}</H2>
              {dictionary.story.paragraphs.map((p) => (
                <Text key={p}>{p}</Text>
              ))}
            </Stack>
            <LogoPanel>
              <Image
                src="/assets/logo/logo-stacked-green.svg"
                alt="Foundation for CDG Syndrome and Autism"
                width={360}
                height={231}
              />
            </LogoPanel>
          </Split>
          <Values>
            {dictionary.values.map((v, i) => (
              <ValueCard key={v.title}>
                <span aria-hidden="true">{i + 1}</span>
                <H3>{v.title}</H3>
                <Text>{v.text}</Text>
              </ValueCard>
            ))}
          </Values>
        </Container>
      </Section>
      <Section $tone="cream">
        <Container>
          <History>
            <H2>{dictionary.history.title}</H2>
            {dictionary.history.paragraphs.map((p) => (
              <Text key={p}>{p}</Text>
            ))}
          </History>
        </Container>
      </Section>
      <div style={{ height: 96 }} />
      <HelpCta common={common} lang={lang} />
    </>
  );
}
