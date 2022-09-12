import { useRouter } from 'next/router';
import { AnchorTile } from '~/components/anchor-tile';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { TileList } from '~/components/tile-list';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { LockdownTable } from '~/domain/restrictions/lockdown-table';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { LockdownData, RoadmapData } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textVr: siteText.pages.measures_page.vr,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export { getStaticPaths } from '~/static-paths/vr';

type GeldendeAdviezenData = {
  lockdown: LockdownData;
  roadmap?: RoadmapData;
};

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectVrData(),
  createGetContent<GeldendeAdviezenData>((context) => {
    const { locale } = context;

    return `
    {
      'lockdown': *[_type == 'lockdown']{
        ...,
        "message": {
          ...message,
          "description": {
            ...message.description,
            "${locale}": [
              ...message.description.${locale}[]
              {
                ...,
                "asset": asset->
              },
            ]
          },
        }
      }[0],
      // We will need the roadmap when lockdown is disabled in the CMS.
      // 'roadmap': *[_type == 'roadmap'][0]
    }`;
  })
);

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, content, vrName, lastGenerated } = props;

  const { commonTexts } = useIntl();
  const { textVr } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );
  type VRCode = keyof typeof textVr.urls;

  const { lockdown } = content;

  const router = useRouter();
  const code = router.query.code as unknown as VRCode;

  const regioUrl = textVr.urls[code];

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(textVr.metadata.title, {
      safetyRegionName: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <Box as="header" spacing={4}>
            <Heading level={1}>
              {replaceVariablesInText(textVr.titel, {
                safetyRegionName: vrName,
              })}
            </Heading>
            {lockdown.message.description ? (
              <Box maxWidth="maxWidthText">
                <RichContent blocks={lockdown.message.description} />
              </Box>
            ) : null}
          </Box>

          <Box as="article" spacing={3}>
            <Heading level={3}>{lockdown.title}</Heading>
            <LockdownTable data={lockdown} level={1} />
          </Box>

          <AnchorTile
            external
            title={textVr.titel_aanvullendemaatregelen}
            href={regioUrl}
            label={replaceVariablesInText(textVr.linktext_regionpage, {
              safetyRegionName: vrName,
            })}
          >
            {textVr.toelichting_aanvullendemaatregelen}
          </AnchorTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default RegionalRestrictions;