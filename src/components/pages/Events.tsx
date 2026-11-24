'use client';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import HelpCta from '../HelpCta';
import { CheckList, Container, H3, Section, Text } from '../ui/Primitives';
import { Facebook, Instagram } from '../ui/Icons';
import { site } from '@/config/site';

type Item = Dictionary['events']['items'][number];

export type PostedEvent = {
  id: number;
  day: string;
  month: string;
  year: string;
  location: string;
  title: string;
  text: string;
};

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
    font-size: 3rem;
    line-height: 1;
  }

  span {
    font-weight: 700;
    font-size: 0.9375rem;
    margin-top: 6px;
  }

  ${mq.mobile} {
    width: 88px;
    height: 88px;
    border-radius: 18px;

    strong {
      font-size: 2.25rem;
    }
  }
`;

const FollowCard = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 32px 40px;
  border-radius: 28px;
  background: ${colors.white};
  border: 1px solid ${colors.line};

  p {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 600;
    color: ${colors.ink};
  }

  ${mq.tablet} {
    grid-template-columns: 1fr;
    padding: 24px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 999px;
    border: 2px solid ${colors.brandDark};
    color: ${colors.brandDark};
    font-weight: 700;
    text-decoration: none;
  }

  a:hover,
  a:focus-visible {
    background: ${colors.brandDark};
    color: ${colors.white};
  }
`;

const Body = styled.div`
  display: grid;
  gap: 14px;
  align-content: start;

  h2,
  h3 {
    font-size: 1.375rem;
  }
`;

export function EventCard({
  item,
  compact,
  year,
  location,
}: {
  item: Item;
  compact?: boolean;
  year?: string;
  location?: string;
}) {
  return (
    <StyledCard $compact={compact}>
      <DateBadge>
        <strong>{item.day}</strong>
        <span>{item.month}</span>
        {year && <span>{year}</span>}
      </DateBadge>
      <Body>
        <H3 as="h2">{item.title}</H3>
        {location && <Place>{location}</Place>}
        <Text>{item.text}</Text>
        {!compact && item.points.length > 0 && (
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

const Place = styled.p`
  font-weight: 700;
  color: ${colors.brandDark};
`;

const GroupTitle = styled.h2`
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  color: ${colors.ink};
`;

const List = styled.div`
  display: grid;
  gap: 24px;
  max-width: 960px;
`;

export default function Events({
  dictionary,
  common,
  lang,
  events = [],
}: {
  dictionary: Dictionary['events'];
  common: Dictionary['common'];
  lang: string;
  events?: PostedEvent[];
}) {
  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <List>
            {events.length > 0 && (
              <>
                <GroupTitle>{dictionary.listTitle}</GroupTitle>
                {events.map((e) => (
                  <EventCard
                    key={e.id}
                    year={e.year}
                    location={e.location}
                    item={{ day: e.day, month: e.month, title: e.title, text: e.text, points: [] }}
                  />
                ))}
                <GroupTitle>{dictionary.campaignsTitle}</GroupTitle>
              </>
            )}
            {dictionary.items.map((item) => (
              <EventCard key={item.title} item={item} />
            ))}
            <FollowCard>
              <p>{dictionary.follow}</p>
              <SocialLinks>
                {site.facebookUrl && (
                  <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">
                    <Facebook size={18} /> Facebook
                  </a>
                )}
                {site.instagramUrl && (
                  <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Instagram size={18} /> Instagram
                  </a>
                )}
              </SocialLinks>
            </FollowCard>
          </List>
        </Container>
      </Section>
      <HelpCta common={common} lang={lang} />
    </>
  );
}
