'use client';
import Image from 'next/image';
import styled from 'styled-components';
import { colors, mq } from '@/theme';
import { Container, Eyebrow, H1, Lead } from './ui/Primitives';

const Wrapper = styled.section`
  position: relative;
  overflow: hidden;
  background: ${colors.cream};
  padding: 80px 0 88px;

  ${mq.tablet} {
    padding: 48px 0 56px;
  }
`;

const Bird = styled.div`
  position: absolute;
  right: -40px;
  bottom: -70px;
  width: 380px;
  pointer-events: none;

  ${mq.tablet} {
    width: 220px;
    right: -50px;
    bottom: -50px;
    opacity: 0.7;
  }
`;

const Content = styled.div`
  position: relative;
  display: grid;
  gap: 16px;
  max-width: 820px;
`;

export default function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Wrapper>
      <Bird aria-hidden="true">
        <Image src="/assets/logo/bird-sage.svg" alt="" width={380} height={335} />
      </Bird>
      <Container>
        <Content>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <H1>{title}</H1>
          </div>
          {lead && <Lead>{lead}</Lead>}
        </Content>
      </Container>
    </Wrapper>
  );
}
