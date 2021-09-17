import React, { forwardRef } from 'react';

const Varianten = forwardRef(({ ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      role="img"
      focusable="false"
      viewBox="0 0 22 36"
      fill="#000"
      {...rest}
    >
      <path d="M2.5017 13.6645C3.05982 13.5703 3.86078 13.4997 4.60508 13.6023L4.56273 10.4675L3.62496 10.426C3.39736 10.3913 3.40402 10.2451 3.41387 10.2008C3.41678 10.2002 3.42586 10.2 3.44041 10.1996C3.55744 10.1968 4.02932 10.1855 4.51298 9.89247C4.51784 9.89039 4.52757 9.88624 4.53523 9.87724L4.53317 9.87239C5.1514 9.48829 5.55877 8.79857 5.53112 8.01923C5.49135 6.86097 4.51437 5.95916 3.35353 6.00143C2.19269 6.0437 1.28677 7.02061 1.32654 8.17887C1.35418 8.95821 1.80634 9.61379 2.451 9.95222C2.44983 9.95846 2.44842 9.96415 2.44702 9.96985C2.44421 9.98124 2.4414 9.99263 2.44043 10.0083L2.5017 13.6645Z" />
      <path d="M11.3464 16.3887C10.8927 15.7898 10.2764 15.2734 9.81516 14.9454L11.4367 13.2372C11.4485 13.2268 11.4585 13.2207 11.4686 13.2146C11.4736 13.2116 11.4786 13.2086 11.4838 13.205C11.2673 12.5099 11.4112 11.7266 11.9427 11.1559C12.7336 10.3088 14.0649 10.2586 14.9157 11.0496C15.7664 11.8405 15.8195 13.169 15.0287 14.0161C14.4971 14.5868 13.7214 14.7864 13.0126 14.6209L13.0106 14.6258C12.9989 14.6267 12.989 14.6228 12.9841 14.6208C12.435 14.486 12.0933 14.1603 12.0085 14.0795C11.998 14.0695 11.9914 14.0632 11.9889 14.0616C11.9506 14.086 11.8426 14.1846 11.9789 14.3702L12.6127 15.0625L11.3464 16.3887Z" />
      <path d="M14.1005 24.5081C14.2031 23.7638 14.1325 22.9629 14.0383 22.4048L17.6945 22.3435C17.7102 22.3445 17.7216 22.3473 17.7329 22.3501C17.7386 22.3515 17.7443 22.3529 17.7506 22.3541C18.089 21.7094 18.7446 21.2572 19.5239 21.2296C20.6822 21.1898 21.6591 22.0957 21.7014 23.2566C21.7436 24.4174 20.8418 25.3944 19.6836 25.4342C18.9042 25.4618 18.2145 25.0545 17.8304 24.4362L17.8256 24.4383C17.8166 24.4306 17.8124 24.4209 17.8103 24.416C17.5173 23.9324 17.506 23.4605 17.5032 23.3435C17.5028 23.3289 17.5026 23.3198 17.502 23.3169C17.4577 23.3071 17.3115 23.3004 17.2768 23.528L17.2353 24.4658L14.1005 24.5081Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.894 28.5224L10.4536 29H0V15.7522C0.86586 15.2755 1.81168 14.9552 2.80053 14.8C3.33093 14.7166 3.90063 14.6304 4.89528 14.7167C6.46327 14.8532 7.90546 15.4159 9.11701 16.2834C10.3609 17.174 10.8202 17.8256 11.2373 18.4385C11.7874 19.2467 12.2031 20.1531 12.4523 21.1255C12.775 22.3851 12.7585 23.9603 12.4824 25.2631C12.1885 26.468 11.64 27.5756 10.894 28.5224ZM7.66612 20.4284C7.3732 21.1571 7.73365 21.9883 8.47121 22.2848C9.20877 22.5813 10.0441 22.2309 10.3371 21.5021C10.63 20.7734 10.2695 19.9422 9.53197 19.6457C8.79441 19.3492 7.95904 19.6996 7.66612 20.4284ZM3.30919 18.7C2.75602 18.4776 2.48568 17.8542 2.70537 17.3076C2.92506 16.761 3.55159 16.4982 4.10476 16.7206C4.65792 16.943 4.92826 17.5664 4.70857 18.113C4.48888 18.6595 3.86236 18.9223 3.30919 18.7ZM7.67355 26.1968C7.45386 26.7433 7.7242 27.3667 8.27737 27.5891C8.83054 27.8115 9.45706 27.5487 9.67675 27.0021C9.89644 26.4555 9.6261 25.8322 9.07294 25.6098C8.51977 25.3874 7.89324 25.6502 7.67355 26.1968ZM4.1895 25.2044C3.08316 24.7596 2.54249 23.5128 2.98187 22.4197C3.42125 21.3265 4.6743 20.8009 5.78064 21.2457C6.88697 21.6904 7.42765 22.9372 6.98826 24.0303C6.54888 25.1235 5.29583 25.6491 4.1895 25.2044Z"
      />
    </svg>
  );
});

Varianten.displayName = 'Varianten';

export default Varianten;
