import { Regions, RegionsMetricName } from '@corona-dashboard/common';
import { ReactNode, useMemo } from 'react';
import { Box } from '~/components/base';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import {
  useChoroplethColorScale,
  useSafetyRegionData,
} from '~/components/choropleth/hooks';
import { getDataThresholds } from '~/components/choropleth/legenda/utils';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { regionGeo } from '~/components/choropleth/topology';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Heading, InlineText, Text } from './typography';
import { useIntl } from '~/intl';

const escalationThresholds = regionThresholds.escalation_levels.level;

interface EscalationMapLegendaProps<K extends RegionsMetricName> {
  metricName: K;
  metricProperty: string;
  data: Pick<Regions, K>;
  lastDetermined: number;
}

export function EscalationMapLegenda<K extends RegionsMetricName>(
  props: EscalationMapLegendaProps<K>
) {
  const { metricName, metricProperty, data, lastDetermined } = props;
  const { siteText, formatDateFromSeconds } = useIntl();

  const { getChoroplethValue, hasData } = useSafetyRegionData(
    regionGeo,
    metricName,
    metricProperty,
    data
  );

  const selectedThreshold = getDataThresholds(
    regionThresholds,
    metricName,
    metricProperty
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    selectedThreshold
  );

  const totalItems = regionGeo.features.length;

  const sortedEscalationArray = useMemo(() => {
    if (!hasData) return [];

    // Add an amount key to the escalation object to count the amount of items
    const sortedEscalationArray = escalationThresholds.map((item) => ({
      ...item,
      amount: regionGeo.features.filter(
        (x) => item.color === getFillColor(x.properties.vrcode)
      ).length,
    }));

    return sortedEscalationArray;
  }, [getFillColor, hasData]);

  return (
    <Box aria-label="legend" width="100%">
      <Heading level={3} fontSize="1rem" mb={0}>
        {siteText.escalatie_niveau.legenda.titel}
      </Heading>
      <Text>
        {replaceVariablesInText(
          siteText.escalatie_niveau.legenda.determined_on,
          { date: formatDateFromSeconds(lastDetermined, 'weekday-medium') }
        )}
      </Text>

      <Box spacing={1}>
        {sortedEscalationArray.map((info) => (
          <Box key={info.threshold} display="flex" alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              spacingHorizontal
              width={{ _: '8rem', sm: '10rem' }}
            >
              <EscalationLevelIcon level={info.threshold} />
              <InlineText pl={2}>
                {siteText.escalatie_niveau.types[info.threshold].titel}
              </InlineText>
            </Box>
            <EscalationBarLegenda
              percentage={info.amount / totalItems}
              color={info.color}
            >
              {info.amount
                ? replaceVariablesInText(
                    info.amount === 1
                      ? siteText.escalatie_niveau.legenda.regio_singular
                      : siteText.escalatie_niveau.legenda.regio_plural,
                    { amount: info.amount }
                  )
                : siteText.escalatie_niveau.legenda.geen_regio}
            </EscalationBarLegenda>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface EscalationBarLegendaProps {
  children: ReactNode;
  color: string;
  percentage: number;
}

function EscalationBarLegenda(props: EscalationBarLegendaProps) {
  const { color, percentage, children } = props;

  return (
    <Box flexGrow={1} paddingY={1} display="flex">
      <Box flexGrow={percentage} backgroundColor={color} paddingRight={1} />
      <Box paddingLeft={2}>{children}</Box>
    </Box>
  );
}