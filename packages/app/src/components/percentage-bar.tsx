import { css } from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

interface PercentageProps {
  percentage: number;
  height?: number | string;
  color?: string;
  backgroundStyle?: 'hatched' | 'normal';
  backgroundColor?: string;
}

export function PercentageBar({
  percentage,
  height,
  color,
  backgroundColor = '8fcae7',
  backgroundStyle = 'normal',
}: PercentageProps) {
  const minWidth = percentage > 0 ? '2px' : undefined;

  backgroundColor =
    backgroundStyle === 'normal'
      ? backgroundColor
        ? backgroundColor
        : 'data.underReported'
      : backgroundColor;

  return (
    <Wrapper>
      <Bar
        style={{ width: `${percentage}%` }}
        height={height}
        minWidth={minWidth}
        color={color}
      />

      <Box
        // Created by https://stripesgenerator.com/
        css={css(
          backgroundStyle === 'hatched'
            ? {
                backgroundImage: `linear-gradient(45deg, ${backgroundColor} 30%, #ffffff 30%, #ffffff 50%, ${backgroundColor} 50%, ${backgroundColor} 80%, #ffffff 80%, #ffffff 100%)`,
                backgroundSize: '7.07px 7.07px',
              }
            : {
                backgroundColor,
              }
        )}
        width="100%"
        height="100%"
        position="absolute"
        top={0}
        left={0}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div(
  css({
    display: 'flex',
    position: 'relative',
    minWidth: '4em',
    width: '100%',
  })
);

const Bar = styled.div<{
  height?: number | string;
  minWidth?: string;
  color?: string;
}>((x) =>
  css({
    backgroundColor: x.color ? x.color : 'currentcolor',
    height: x.height ?? '0.8em',
    minWidth: x.minWidth,
    zIndex: 3,
  })
);
