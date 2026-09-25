'use client';
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
import { External } from '../ui/Icons';

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  ${mq.tablet} {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(Card)`
  display: grid;
  gap: 20px;
  align-content: start;
`;

const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  list-style: none;
  counter-reset: step;
  margin-top: 32px;

  ${mq.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
  }

  li {
    counter-increment: step;
    display: grid;
    gap: 10px;
    align-content: start;
    padding: 28px;
    border-radius: 24px;
    background: ${colors.white};
    border: 1px solid ${colors.line};
  }

  li::before {
    content: counter(step);
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${colors.brandDark};
    color: ${colors.white};
    font-weight: 700;
  }

  p {
    font-size: 15px;
  }
`;

const FormHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 24px;

  ${mq.tablet} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FormFrame = styled.div`
  border-radius: 28px;
  overflow: hidden;
  background: ${colors.white};
  border: 1px solid ${colors.line};

  iframe {
    display: block;
    width: 100%;
    height: 1600px;
    border: 0;
  }

  ${mq.mobile} {
    border-radius: 20px;
    margin: 0 -4px;

    iframe {
      height: 1900px;
    }
  }
`;

const Privacy = styled.p`
  margin-top: 16px;
  font-size: 14px;
  color: ${colors.muted};
`;

export default function Beneficiary({ dictionary }: { dictionary: Dictionary['beneficiary'] }) {
  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <TwoCol>
            <InfoCard>
              <H3>{dictionary.whoTitle}</H3>
              <CheckList>
                {dictionary.who.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </CheckList>
            </InfoCard>
            <InfoCard>
              <H3>{dictionary.docsTitle}</H3>
              <CheckList>
                {dictionary.docs.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </CheckList>
            </InfoCard>
          </TwoCol>
        </Container>
      </Section>

      <Section $tone="cream">
        <Container>
          <H2>{dictionary.stepsTitle}</H2>
          <Steps>
            {dictionary.steps.map((s) => (
              <li key={s.title}>
                <H3>{s.title}</H3>
                <Text>{s.text}</Text>
              </li>
            ))}
          </Steps>
        </Container>
      </Section>

      {site.beneficiaryFormUrl && (
        <Section id="form">
          <Container>
            <FormHead>
              <div>
                <H2>{dictionary.formTitle}</H2>
                <Text style={{ marginTop: 8 }}>{dictionary.formText}</Text>
              </div>
              <ExternalButton
                href={site.beneficiaryFormUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dictionary.openForm}
                <External />
              </ExternalButton>
            </FormHead>
            <FormFrame>
              <iframe
                src={site.beneficiaryFormEmbedUrl}
                title={dictionary.formTitle}
                loading="lazy"
              />
            </FormFrame>
            <Privacy>{dictionary.privacy}</Privacy>
          </Container>
        </Section>
      )}
    </>
  );
}
