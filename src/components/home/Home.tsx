'use client';
import Image from 'next/image';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import {
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  H1,
  H2,
  H3,
  Lead,
  Section,
  Text,
  TextLink,
  localePath,
} from '../ui/Primitives';
import { ArrowRight, Heart } from '../ui/Icons';
import { DiseaseCard, DiseaseGrid } from '../pages/RareDiseases';
import { EventCard } from '../pages/Events';

/* ---------- Hero ---------- */

const HeroWrap = styled.section`
  position: relative;
  overflow: hidden;
  background: ${colors.cream};
  padding: 120px 0 132px;

  ${mq.tablet} {
    padding: 64px 0 88px;
  }
`;

const HeroBird = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  pointer-events: none;
  ${({ $side }) =>
    $side === 'left'
      ? 'left: -120px; top: -80px; width: 460px; transform: scaleX(-1) rotate(8deg);'
      : 'right: -90px; bottom: -120px; width: 520px;'}

  ${mq.tablet} {
    ${({ $side }) =>
      $side === 'left'
        ? 'width: 240px; left: -110px; top: -40px;'
        : 'width: 300px; right: -110px; bottom: -90px;'}
  }
`;

const HeroContent = styled.div`
  position: relative;
  display: grid;
  justify-items: center;
  gap: 24px;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;

  ${mq.mobile} {
    justify-items: start;
    text-align: left;
  }
`;

const Tagline = styled.p`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.muted};
`;

const HeroButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;

  ${mq.mobile} {
    width: 100%;
  }
`;

/* ---------- Stats ---------- */

const Stats = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: -56px;
  background: ${colors.white};
  border: 1px solid ${colors.line};
  border-radius: 24px;
  box-shadow: 0 24px 48px rgba(47, 52, 50, 0.08);

  ${mq.mobile} {
    grid-template-columns: 1fr;
    margin-top: -48px;
  }
`;

const Stat = styled.div`
  padding: 28px 32px;

  & + & {
    border-left: 1px solid ${colors.line};
  }

  strong {
    display: block;
    font-size: clamp(28px, 3vw, 38px);
    color: ${colors.brandDark};
    line-height: 1.1;
  }

  span {
    color: ${colors.muted};
    font-size: 15px;
  }

  ${mq.mobile} {
    padding: 20px 24px;

    & + & {
      border-left: 0;
      border-top: 1px solid ${colors.line};
    }
  }
`;

/* ---------- Condition features ---------- */

const Feature = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 64px;

  & + & {
    margin-top: 96px;
  }

  > :first-child {
    order: ${({ $reverse }) => ($reverse ? 2 : 1)};
  }

  ${mq.tablet} {
    grid-template-columns: 1fr;
    gap: 32px;

    & + & {
      margin-top: 64px;
    }

    > :first-child {
      order: 1;
    }
  }
`;

const FeatureVisual = styled.div<{ $tone: 'sage' | 'cream' }>`
  position: relative;
  aspect-ratio: 5 / 4;
  border-radius: 32px;
  overflow: hidden;
  background: ${({ $tone }) => ($tone === 'sage' ? colors.sageSoft : colors.cream)};
  display: grid;
  place-items: center;

  span {
    position: absolute;
    left: 32px;
    top: 24px;
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 700;
    color: ${colors.white};
    letter-spacing: -0.02em;
    line-height: 1;
  }

  img {
    width: 62%;
    height: auto;
  }

  ${mq.mobile} {
    border-radius: 24px;

    span {
      left: 20px;
      top: 16px;
    }
  }
`;

const FeatureBody = styled.div`
  display: grid;
  gap: 16px;
  justify-items: start;
`;

/* ---------- Section heads ---------- */

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 40px;

  ${mq.tablet} {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 28px;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  ${mq.tablet} {
    grid-template-columns: 1fr;
  }
`;

/* ---------- Help ---------- */

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  ${mq.tablet} {
    grid-template-columns: 1fr;
  }
`;

const HelpCard = styled(Card)<{ $accent?: boolean }>`
  display: grid;
  gap: 16px;
  align-content: start;
  justify-items: start;
  padding: 40px;
  background: ${({ $accent }) => ($accent ? colors.brandDark : colors.white)};
  border-color: ${({ $accent }) => ($accent ? colors.brandDark : colors.line)};

  h3 {
    font-size: 26px;
    color: ${({ $accent }) => ($accent ? colors.white : colors.ink)};
  }

  p {
    color: ${({ $accent }) => ($accent ? colors.sageSoft : colors.muted)};
  }

  a {
    margin-top: 8px;
  }

  ${mq.mobile} {
    padding: 28px 24px;
  }
`;

type HomeProps = {
  dictionary: Dictionary['home'];
  rare: Dictionary['rare'];
  events: Dictionary['events'];
  lang: string;
};

export default function Home({ dictionary, rare, events, lang }: HomeProps) {
  const href = (path: string) => localePath(lang, path);
  const { hero } = dictionary;

  return (
    <>
      <HeroWrap>
        <HeroBird $side="left" aria-hidden="true">
          <Image src="/assets/logo/bird-sage.svg" alt="" width={460} height={405} priority />
        </HeroBird>
        <HeroBird $side="right" aria-hidden="true">
          <Image src="/assets/logo/bird-sage.svg" alt="" width={520} height={458} priority />
        </HeroBird>
        <Container>
          <HeroContent>
            <Tagline>{hero.tagline}</Tagline>
            <H1>{hero.title}</H1>
            <Lead>{hero.text}</Lead>
            <HeroButtons>
              <ButtonLink href={href('/donate')}>
                <Heart size={18} />
                {hero.primary}
              </ButtonLink>
              <ButtonLink href={href('/beneficiary')} $variant="secondary">
                {hero.secondary}
              </ButtonLink>
            </HeroButtons>
          </HeroContent>
        </Container>
      </HeroWrap>

      <Container>
        <Stats>
          {dictionary.stats.map((s) => (
            <Stat key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </Stat>
          ))}
        </Stats>
      </Container>

      <Section>
        <Container>
          <Feature>
            <FeatureVisual $tone="sage">
              <span aria-hidden="true">CDG</span>
              <Image src="/assets/logo/bird-green.svg" alt="" width={400} height={353} />
            </FeatureVisual>
            <FeatureBody>
              <Eyebrow>{dictionary.cdg.eyebrow}</Eyebrow>
              <H2>{dictionary.cdg.title}</H2>
              <Text>{dictionary.cdg.text}</Text>
              <TextLink href={href('/cdg')}>
                {dictionary.cdg.link} <ArrowRight />
              </TextLink>
            </FeatureBody>
          </Feature>
          <Feature $reverse>
            <FeatureVisual $tone="cream">
              <span aria-hidden="true">ASD</span>
              <Image src="/assets/logo/bird-sage.svg" alt="" width={400} height={353} />
            </FeatureVisual>
            <FeatureBody>
              <Eyebrow>{dictionary.autism.eyebrow}</Eyebrow>
              <H2>{dictionary.autism.title}</H2>
              <Text>{dictionary.autism.text}</Text>
              <TextLink href={href('/autism')}>
                {dictionary.autism.link} <ArrowRight />
              </TextLink>
            </FeatureBody>
          </Feature>
        </Container>
      </Section>

      <Section $tone="cream">
        <Container>
          <SectionHead>
            <div>
              <Eyebrow>{dictionary.rare.eyebrow}</Eyebrow>
              <H2>{dictionary.rare.title}</H2>
              <Lead style={{ marginTop: 12 }}>{dictionary.rare.text}</Lead>
            </div>
            <TextLink href={href('/rare-diseases')}>
              {dictionary.rare.link} <ArrowRight />
            </TextLink>
          </SectionHead>
          <DiseaseGrid>
            {rare.items.slice(0, 3).map((item) => (
              <DiseaseCard key={item.name} item={item} />
            ))}
          </DiseaseGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead>
            <div>
              <Eyebrow>{dictionary.events.eyebrow}</Eyebrow>
              <H2>{dictionary.events.title}</H2>
            </div>
            <TextLink href={href('/events')}>
              {dictionary.events.link} <ArrowRight />
            </TextLink>
          </SectionHead>
          <EventsGrid>
            {events.items.map((item) => (
              <EventCard key={item.title} item={item} compact />
            ))}
          </EventsGrid>
        </Container>
      </Section>

      <Section $tone="sage">
        <Container>
          <SectionHead>
            <div>
              <Eyebrow>{dictionary.help.eyebrow}</Eyebrow>
              <H2>{dictionary.help.title}</H2>
            </div>
          </SectionHead>
          <HelpGrid>
            <HelpCard $accent>
              <H3>{dictionary.help.donate.title}</H3>
              <Text>{dictionary.help.donate.text}</Text>
              <ButtonLink href={href('/donate')} $variant="light">
                <Heart size={18} />
                {dictionary.help.donate.btn}
              </ButtonLink>
            </HelpCard>
            <HelpCard>
              <H3>{dictionary.help.beneficiary.title}</H3>
              <Text>{dictionary.help.beneficiary.text}</Text>
              <ButtonLink href={href('/beneficiary')} $variant="secondary">
                {dictionary.help.beneficiary.btn}
              </ButtonLink>
            </HelpCard>
          </HelpGrid>
        </Container>
      </Section>
    </>
  );
}
