'use client';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import HelpCta from '../HelpCta';
import { CheckList, Container, H3, Section, Text } from '../ui/Primitives';

type Item = Dictionary['events']['items'][number];

const StyledCard = styled.article<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 32px;
  padding: ${({ $compact }) => ($compact ? '32px' : '40px')};
  border-radius: 28px;
  background: ${colors.white};
  border: 1px solid ${colors.line};

  ${mq.mobile} {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 24px;
    border-radius: 20px;
  }
`;

const DateBadge = styled.div`
  display: grid;
  place-content: center;
  text-align: center;
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: ${colors.cream};
  color: ${colors.brandDeep};

  strong {
    font-size: 48px;
    line-height: 1;
  }

  span {
    font-weight: 700;
    font-size: 15px;
    margin-top: 6px;
  }

  ${mq.mobile} {
    width: 88px;
    height: 88px;
    border-radius: 18px;

    strong {
      font-size: 36px;
    }
  }
`;

const Body = styled.div`
  display: grid;
  gap: 14px;
  align-content: start;

  h3 {
    font-size: 22px;
  }
`;

export function EventCard({ item, compact }: { item: Item; compact?: boolean }) {
  return (
    <StyledCard $compact={compact}>
      <DateBadge>
        <strong>{item.day}</strong>
        <span>{item.month}</span>
      </DateBadge>
      <Body>
        <H3>{item.title}</H3>
        <Text>{item.text}</Text>
        {!compact && (
          <CheckList>
            {item.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </CheckList>
        )}
      </Body>
    </StyledCard>
  );
}

const List = styled.div`
  display: grid;
  gap: 24px;
  max-width: 960px;
`;

export default function Events({
  dictionary,
  common,
  lang,
}: {
  dictionary: Dictionary['events'];
  common: Dictionary['common'];
  lang: string;
}) {
  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <List>
            {dictionary.items.map((item) => (
              <EventCard key={item.title} item={item} />
            ))}
            <Text>{dictionary.follow}</Text>
          </List>
        </Container>
      </Section>
      <HelpCta common={common} lang={lang} />
    </>
  );
}
