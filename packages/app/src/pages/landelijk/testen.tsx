import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { GgdTesten } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { ElementsQueryResult, getElementsQuery, getTimelineEvents } from '~/queries/get-elements-query';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['self_test_overall'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.tests_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('self_test_overall'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
        "parts": ${getPagePartsQuery('tests_page')},
        "elements": ${getElementsQuery('nl', ['self_test_overall'], locale)}
      }`;
    })(context);
    return {
      content: {
        articles: getArticleParts(content.parts.pageParts, 'testsPageArticles'),
        elements: content.elements,
      },
    };
  }
);

const Tests = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, content, lastGenerated } = props;

  const [confirmedCasesSelfTestedTimeframe, setConfirmedCasesSelfTestedTimeframe] = useState<TimeframeOption>(TimeframeOption.SIX_MONTHS);

  const { commonTexts } = useIntl();

  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.development_of_the_virus.title}
            screenReaderCategory={commonTexts.sidebar.metrics.positive_tests.title}
            title={textNl.title}
            icon={<GgdTesten aria-hidden="true" />}
            description={textNl.description}
            metadata={{
              datumsText: textNl.dates,
              dateOrRange: {
                start: data.self_test_overall.last_value.date_start_unix,
                end: data.self_test_overall.last_value.date_end_unix,
              },
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [textNl.sources.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          <ChartTile
            title={textNl.chart_self_tests.title}
            description={textNl.chart_self_tests.description}
            metadata={{
              source: textNl.sources.self_test,
            }}
            timeframeOptions={TimeframeOptionsList}
            timeframeInitialValue={confirmedCasesSelfTestedTimeframe}
            onSelectTimeframe={setConfirmedCasesSelfTestedTimeframe}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'confirmed_cases_self_tested_over_time_chart',
              }}
              values={data.self_test_overall.values}
              timeframe={confirmedCasesSelfTestedTimeframe}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'infected_percentage',
                  label: textNl.chart_self_tests.tooltip_label,
                  color: colors.primary,
                },
              ]}
              dataOptions={{
                isPercentage: true,
                timelineEvents: getTimelineEvents(content.elements.timeSeries, 'self_test_overall'),
              }}
              forceLegend
            />
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default Tests;