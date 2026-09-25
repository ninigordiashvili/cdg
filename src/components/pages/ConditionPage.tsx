'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import HelpCta from '../HelpCta';
import { CheckList, Container, H2, Text } from '../ui/Primitives';

type ConditionContent = Dictionary['cdg'] | Dictionary['autism'];
type ConditionSection = ConditionContent['sections'][number] & { list?: string[]; after?: string };

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 72px;
  padding: 80px 0 96px;

  ${mq.tablet} {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 0 64px;
  }
`;

const Toc = styled.nav`
  position: sticky;
  top: 108px;
  align-self: start;

  p {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.muted};
    margin-bottom: 12px;
  }

  ul {
    display: grid;
    gap: 2px;
    border-left: 2px solid ${colors.line};
  }

  ${mq.tablet} {
    position: static;
    padding: 20px;
    border-radius: 20px;
    background: ${colors.creamSoft};
    border: 1px solid ${colors.line};

    ul {
      border-left: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
`;

const TocLink = styled.a<{ $active: boolean }>`
  display: block;
  margin-left: -2px;
  padding: 8px 16px;
  border-left: 2px solid ${({ $active }) => ($active ? colors.brandDark : 'transparent')};
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? colors.brandDark : colors.muted)};
  text-decoration: none;

  &:hover {
    color: ${colors.brandDark};
  }

  ${mq.tablet} {
    margin: 0;
    padding: 6px 14px;
    border: 1px solid ${colors.line};
    border-radius: 999px;
    background: ${colors.white};
    font-size: 14px;
  }
`;

const Article = styled.article`
  display: grid;
  gap: 56px;
  max-width: 760px;
  min-width: 0;

  ${mq.tablet} {
    gap: 40px;
  }
`;

const Block = styled.section`
  display: grid;
  gap: 16px;

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }
`;

const Note = styled.aside`
  padding: 20px 24px;
  border-radius: 16px;
  background: ${colors.cream};
  border-left: 4px solid ${colors.brand};
  color: ${colors.ink};
  font-size: 15px;
`;

export default function ConditionPage({
  content,
  common,
  lang,
}: {
  content: ConditionContent;
  common: Dictionary['common'];
  lang: string;
}) {
  const sections = content.sections as ConditionSection[];
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-110px 0px -60% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} lead={content.lead} />
      <Container>
        <Layout>
          <Toc aria-label={common.onThisPage}>
            <p>{common.onThisPage}</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <TocLink href={`#${s.id}`} $active={active === s.id}>
                    {s.title}
                  </TocLink>
                </li>
              ))}
            </ul>
          </Toc>
          <Article>
            {sections.map((s) => (
              <Block key={s.id} id={s.id}>
                <H2>{s.title}</H2>
                {s.paragraphs.map((p) => (
                  <Text key={p}>{p}</Text>
                ))}
                {s.list && (
                  <CheckList>
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </CheckList>
                )}
                {s.after && <Text>{s.after}</Text>}
              </Block>
            ))}
            <Note>{common.medicalNote}</Note>
          </Article>
        </Layout>
      </Container>
      <HelpCta common={common} lang={lang} />
    </>
  );
}
