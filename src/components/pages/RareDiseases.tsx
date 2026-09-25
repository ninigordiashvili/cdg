'use client';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import HelpCta from '../HelpCta';
import { Card, Container, H3, Section, Text } from '../ui/Primitives';

type Item = Dictionary['rare']['items'][number];

export const DiseaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  ${mq.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled(Card)`
  display: grid;
  gap: 14px;
  align-content: start;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(47, 52, 50, 0.08);
  }

  p {
    font-size: 16px;
  }
`;

const Tag = styled.span`
  justify-self: start;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${colors.sageSoft};
  color: ${colors.brandDeep};
  font-size: 13px;
  font-weight: 700;
`;

export function DiseaseCard({ item }: { item: Item }) {
  return (
    <StyledCard as="article">
      <Tag>{item.tag}</Tag>
      <H3>{item.name}</H3>
      <Text>{item.text}</Text>
    </StyledCard>
  );
}

export default function RareDiseases({
  dictionary,
  common,
  lang,
}: {
  dictionary: Dictionary['rare'];
  common: Dictionary['common'];
  lang: string;
}) {
  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <DiseaseGrid>
            {dictionary.items.map((item) => (
              <DiseaseCard key={item.name} item={item} />
            ))}
          </DiseaseGrid>
          <Text style={{ marginTop: 40, fontSize: 15 }}>{common.medicalNote}</Text>
        </Container>
      </Section>
      <HelpCta common={common} lang={lang} />
    </>
  );
}
