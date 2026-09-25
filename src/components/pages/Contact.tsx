'use client';
import styled from 'styled-components';
import type { Dictionary } from '@/get-dictionary';
import { site } from '@/config/site';
import { colors, mq } from '@/theme';
import PageHero from '../PageHero';
import { ButtonLink, Card, Container, H2, H3, Section, Text, localePath } from '../ui/Primitives';
import { Facebook, Instagram, Mail, Phone } from '../ui/Icons';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  ${mq.mobile} {
    grid-template-columns: 1fr;
  }
`;

const ChannelCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${colors.brand};
  }

  p {
    font-size: 15px;
    overflow-wrap: anywhere;
  }
`;

const Icon = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: ${colors.sageSoft};
  color: ${colors.brandDeep};
`;

const Soon = styled.span`
  font-size: 14px;
  color: ${colors.muted};
`;

const Apply = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 40px;
  border-radius: 28px;
  background: ${colors.cream};

  ${mq.tablet} {
    flex-direction: column;
    align-items: flex-start;
    padding: 28px 24px;
  }
`;

export default function Contact({
  dictionary,
  common,
  lang,
}: {
  dictionary: Dictionary['contact'];
  common: Dictionary['common'];
  lang: string;
}) {
  const channels = [
    {
      key: 'facebook',
      icon: <Facebook size={26} />,
      title: dictionary.facebook,
      text: dictionary.facebookText,
      href: site.facebookUrl,
      external: true,
    },
    {
      key: 'instagram',
      icon: <Instagram size={26} />,
      title: dictionary.instagram,
      text: dictionary.instagramText,
      href: site.instagramUrl,
      external: true,
    },
    {
      key: 'email',
      icon: <Mail size={26} />,
      title: dictionary.email,
      text: site.email,
      href: site.email && `mailto:${site.email}`,
    },
    {
      key: 'phone',
      icon: <Phone size={26} />,
      title: dictionary.phone,
      text: site.phone,
      href: site.phone && `tel:${site.phone.replace(/\s/g, '')}`,
    },
  ];

  return (
    <>
      <PageHero eyebrow={dictionary.eyebrow} title={dictionary.title} lead={dictionary.lead} />
      <Section>
        <Container>
          <Grid>
            {channels.map((c) =>
              c.href ? (
                <ChannelCard
                  key={c.key}
                  as="a"
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon>{c.icon}</Icon>
                  <div>
                    <H3>{c.title}</H3>
                    <Text>{c.text}</Text>
                  </div>
                </ChannelCard>
              ) : (
                <ChannelCard key={c.key}>
                  <Icon>{c.icon}</Icon>
                  <div>
                    <H3>{c.title}</H3>
                    <Soon>{common.comingSoon}</Soon>
                  </div>
                </ChannelCard>
              )
            )}
          </Grid>
          <Apply>
            <div>
              <H2 style={{ fontSize: 'clamp(22px, 2.4vw, 28px)' }}>{dictionary.formTitle}</H2>
              <Text style={{ marginTop: 8 }}>{dictionary.formText}</Text>
            </div>
            <ButtonLink href={localePath(lang, '/beneficiary')}>{dictionary.formBtn}</ButtonLink>
          </Apply>
        </Container>
      </Section>
    </>
  );
}
