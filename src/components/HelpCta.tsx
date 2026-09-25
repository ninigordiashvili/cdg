'use client';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { colors, mq } from '@/theme';
import { ButtonLink, Container, H2, localePath } from './ui/Primitives';
import { Heart } from './ui/Icons';

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 48px;
  border-radius: 32px;
  background: ${colors.brandDark};
  color: ${colors.white};

  h2 {
    color: ${colors.white};
    font-size: clamp(24px, 2.6vw, 32px);
  }

  p {
    margin-top: 8px;
    color: ${colors.sageSoft};
    max-width: 560px;
  }

  ${mq.tablet} {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 24px;
    border-radius: 24px;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex-shrink: 0;

  ${mq.mobile} {
    width: 100%;
  }
`;

const Outline = styled(ButtonLink)`
  color: ${colors.white};
  border-color: ${colors.white};

  &:hover {
    background: ${colors.white};
    color: ${colors.brandDeep};
  }
`;

export default function HelpCta({ common, lang }: { common: Dictionary['common']; lang: string }) {
  return (
    <Container style={{ margin: '0 auto 96px' }}>
      <Box>
        <div>
          <H2>{common.helpTitle}</H2>
          <p>{common.helpText}</p>
        </div>
        <Buttons>
          <ButtonLink href={localePath(lang, '/donate')} $variant="light">
            <Heart size={18} />
            {common.donateBtn}
          </ButtonLink>
          <Outline href={localePath(lang, '/beneficiary')} $variant="secondary">
            {common.helpBtn}
          </Outline>
        </Buttons>
      </Box>
    </Container>
  );
}
