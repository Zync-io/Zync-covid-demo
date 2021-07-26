import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { Box } from '../base';
import { SidebarDifference } from '../difference-indicator';
import { Heading, InlineText } from '../typography';

type SidebarKpiValueProps = {
  title: string;
  /**
   * Make value optional for odd case where we do not show a metric.
   * Currently only `Behavior` is doing that.
   */
  value?: number;
  description?: string;
  valueAnnotation?: string;
  difference?: DifferenceDecimal | DifferenceInteger;
  isPercentage?: boolean;
};

export function SidebarKpiValue(props: SidebarKpiValueProps) {
  const {
    value,
    isPercentage,
    title,
    description,
    valueAnnotation,
    difference,
  } = props;

  const { formatPercentage, formatNumber } = useIntl();

  return (
    <Box width="100%" minHeight="4rem">
      <Heading level={4} fontSize={2} fontWeight="normal" m={0} as="div">
        {title}
      </Heading>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap="wrap"
      >
        {isDefined(value) && (
          <InlineText
            fontSize={3}
            fontWeight="bold"
            margin="0"
            marginRight={isDefined(difference) ? 1 : 3}
          >
            {isPercentage ? `${formatPercentage(value)}%` : formatNumber(value)}
          </InlineText>
        )}

        {isDefined(difference) && (
          <Box fontSize={3} display="flex" alignItems="center" marginRight={1}>
            <SidebarDifference value={difference} />
          </Box>
        )}

        {isDefined(description) && (
          <InlineText
            display="inline-block"
            margin="0"
            color="annotation"
            fontSize={1}
          >
            {description}
          </InlineText>
        )}
      </Box>

      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
