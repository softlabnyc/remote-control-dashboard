import { chakra, HTMLChakraProps } from '@chakra-ui/react';
import * as React from 'react';

export const Logo = (props: HTMLChakraProps<'svg'>) => {
  return (
    <chakra.svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 42"
      fill="currentColor"
      h="6"
      flexShrink={0}
      {...props}
    >
      <path d="M15.81538,18.32014c0-2.06531-1.67-3.16452-3.99813-3.16452s-3.95234,1.011-3.95234,2.68107c0,2.28316,3.6453,2.32815,4.65542,2.41459,4.34927.57165,9.84107,1.71416,11.1582,7.24916a12.3075,12.3075,0,0,1,.2214,2.15254c0,6.41546-6.239,10.10487-12.08268,10.10487C6.8106,39.75785,0,36.68243,0,28.86258H7.60022c0,3.03124,2.54875,3.60289,4.26113,3.60289,2.45958,0,4.43748-.70308,4.43748-2.45958,0-2.19673-3.51389-2.28493-4.65631-2.41724C6.67831,27.1052.79136,26.00768.21963,18.93412v.04331C-.13144,12.21348,5.40436,8.17116,11.94956,8.17116c5.49169,0,11.42193,3.07543,11.42193,10.149Z"></path>
      <path d="M41.36112,8.12618a15.83783,15.83783,0,1,1,0,31.67489,15.623,15.623,0,0,1-15.9036-15.77129A15.73472,15.73472,0,0,1,41.36112,8.12618ZM41.1856,32.6843a8.23713,8.23713,0,0,0,8.56623-8.65452c0-5.88526-4.30428-8.78595-8.56623-8.69854-4.17295.0882-8.2584,2.9448-8.2584,8.69854C32.9272,29.78538,37.01265,32.64108,41.1856,32.6843Z"></path>
      <polygon points="79.694 8.347 79.694 8.347 59.793 8.347 59.793 39.362 67.261 39.362 67.261 28.248 78.991 28.248 78.991 21.262 67.261 21.262 67.261 15.509 79.694 15.509 79.694 15.509 85.46 15.509 85.46 39.516 92.972 39.516 92.972 15.441 101.233 15.441 101.233 8.347 79.694 8.347"></polygon>
      <path d="M106.809,39.36172h-3.34863V15.44105H106.809Z"></path>
      <path d="M130.96841,20.87483V39.36172h-3.34863V36.86841c-1.33273,2.01509-4.306,2.7675-6.59532,2.80212-6.45868,0-9.944-4.5456-9.944-9.6378,0-4.9885,3.62113-9.46574,9.87568-9.46574,2.2892,0,5.0567.54571,6.69735,2.76839l-.03375-2.46055Zm-10.07972,2.63085a6.24268,6.24268,0,0,0-6.45956,6.527,6.59551,6.59551,0,1,0,13.19065.06828A6.47815,6.47815,0,0,0,120.88869,23.50568Z"></path>
      <path d="M139.03393,23.26612c1.60515-2.18539,3.92985-2.69913,6.21824-2.69913,6.25543,0,9.50115,4.47724,9.50115,9.46574,0,5.0922-3.11084,9.6378-9.56775,9.6378-2.28919-.03462-4.81888-.787-6.15164-2.80212v2.49331h-3.34775V15.44105h3.34775Zm6.015,13.431c4.23689.10211,6.39042-3.28035,6.35577-6.6644-.03462-3.24581-2.0514-6.4578-6.08327-6.527-3.14379-.03365-6.28749,2.15351-6.28749,6.59533C139.03393,34.4408,142.00733,36.62885,145.04892,36.69713Z"></path>
    </chakra.svg>
  );
};