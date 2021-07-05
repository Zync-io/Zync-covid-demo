import { assert } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import Getest from '~/assets/test.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { internationalThresholds } from '~/components/choropleth/international-thresholds';
import { PositiveTestedPeopleInternationalTooltip } from '~/components/choropleth/tooltips/international/positive-tested-people-international-tooltip';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { EuropeChoroplethTile } from '~/domain/internationaal/europe-choropleth-tile';
import { choroplethMockData } from '~/domain/internationaal/logic/choropleth-mock-data';
import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { getInPositiveTestsQuery } from '~/queries/in-positive-tests-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { getCountryNames } from '~/static-props/utils/get-country-names';
import { InPositiveTestsQuery } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{
    page: InPositiveTestsQuery;
    highlight: {
      articles?: ArticleSummary[];
    };
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
      "page": ${getInPositiveTestsQuery()},
      "highlight": ${createPageArticlesQuery('in_positiveTestsPage', locale)}
    }`;
  }),
  createGetChoroplethData({
    in: ({ tested_overall }) => tested_overall || choroplethMockData(),
  }),
  getCountryNames
);

export default function PositiefGetesteMensenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { lastGenerated, content, choropleth, countryNames } = props;
  const { in: choroplethData } = choropleth;

  const intl = useIntl();
  const text = intl.siteText.internationaal_positief_geteste_personen;

  const metadata = {
    ...intl.siteText.internationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const comparedName = countryNames['nld'];
  const comparedValue = choropleth.in.find(
    (x) => x.country_code.toLocaleLowerCase() === 'nld'
  )?.infected_per_100k_average;

  assert(
    isDefined(comparedName),
    'comparedName could not be found for country code nld'
  );
  assert(
    isDefined(comparedValue),
    'comparedValue could not be found for country code nld'
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InternationalLayout lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            title={text.titel}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: 0, // @TODO date
              dateOfInsertionUnix: 0, // @TODO date
              dataSources: [
                text.bronnen.rivm,
                text.bronnen.our_world_in_data,
                text.bronnen.ecdc,
              ],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight.articles}
            usefulLinks={content.page.usefulLinks}
          />

          <EuropeChoroplethTile
            title={text.choropleth.titel}
            description={text.choropleth.toelichting}
            legend={{
              thresholds: internationalThresholds.infected_per_100k_average,
              title: text.choropleth.legenda_titel,
            }}
            metadata={{
              source: text.bronnen.rivm,
            }}
          >
            <EuropeChoropleth
              accessibility={{
                key: 'international_tested_overall_choropleth',
              }}
              data={choroplethData}
              metricProperty="infected_per_100k_average"
              tooltipContent={(context) => (
                <PositiveTestedPeopleInternationalTooltip
                  title={text.choropleth.tooltip_titel}
                  countryName={
                    countryNames[context.country_code.toLowerCase()] ||
                    context.country_code
                  }
                  value={context.infected_per_100k_average}
                  comparedName={comparedName}
                  comparedValue={comparedValue}
                />
              )}
            />
          </EuropeChoroplethTile>
        </TileList>
      </InternationalLayout>
    </Layout>
  );
}