import {
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import styled from 'styled-components';
import { HoverPoint } from '~/components-styled/area-chart/components/marker';
import { TimestampedTrendValue } from '~/components-styled/area-chart/logic';
import { Spacer } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { AllLanguages } from '~/locale';
import { useIntl } from '~/intl';

export type TooltipValue = (
  | NlVaccineDeliveryValue
  | NlVaccineDeliveryEstimateValue
  | NlVaccineAdministeredValue
  | NlVaccineAdministeredEstimateValue
) &
  TimestampedTrendValue;

export function FormatVaccinationsTooltip(
  values: HoverPoint<TooltipValue>[],
  text: AllLanguages
) {
  const { formatDateFromSeconds, formatNumber } = useIntl();

  if (!values.length) {
    return null;
  }

  const [firstValue, ...otherValues] = values;

  /**
   * The values with administered data are all of the "other" value. These kind
   * of things will be solved later when converting to TimeSeriesChart.
   */
  const administeredData = otherValues[0].data;

  const dateEndString = formatDateFromSeconds(
    administeredData.date_end_unix,
    'day-month'
  );

  return (
    <>
      <Text as="span" fontWeight="bold">
        {dateEndString}
      </Text>
      <TooltipList>
        <TooltipListItem>
          <span>
            <ColorIndicator color={firstValue.color} />
            {formatLabel(firstValue.label, text)}:
          </span>
          <TooltipValueContainer>
            {formatNumber(firstValue.data.total)}
          </TooltipValueContainer>
        </TooltipListItem>

        {otherValues.map((value) => (
          <TooltipListItem key={value.label}>
            <span>
              <ColorIndicator color={value.color} />
              {formatLabel(value.label, text)}:
            </span>
            <TooltipValueContainer>
              <strong>
                {formatNumber((value.data as any)[value.label as string] || 0)}
              </strong>
            </TooltipValueContainer>
          </TooltipListItem>
        ))}

        <Spacer mb={1} />
        <TooltipListItem>
          <span>
            <ColorIndicator color="transparent" />
            {text.vaccinaties.data.vaccination_chart.doses_administered_total}:
          </span>
          <TooltipValueContainer>
            <strong>{formatNumber(administeredData.total)}</strong>
          </TooltipValueContainer>
        </TooltipListItem>
      </TooltipList>
    </>
  );
}

function formatLabel(labelKey: string | undefined, text: AllLanguages) {
  const labelText = labelKey
    ? (text.vaccinaties.data.vaccination_chart.product_names as any)[labelKey]
    : undefined;
  return labelText ?? labelKey;
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ColorIndicator = styled.span<{
  color?: string;
}>`
  &::before {
    content: '';
    display: ${(x) => (x.color ? 'inline-block' : 'none')};
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(x) => x.color || 'black'};
    margin-right: 0.5em;
    flex-shrink: 0;
  }
`;

const TooltipListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TooltipValueContainer = styled.span`
  font-weight: bold;
  margin-left: 1em;
`;