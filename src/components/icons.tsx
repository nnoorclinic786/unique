import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 100"
      width="1em"
      height="1em"
      {...props}
    >
        <path d="M49.33,18.33A34.67,34.67,0,0,0,14.67,53V81.67h16V53a18.67,18.67,0,1,1,37.33,0V81.67h16V53A34.67,34.67,0,0,0,49.33,18.33Z" fill="#b91c1c" transform="translate(35, -20) scale(1.2)" />
        <path d="M84,18.33A34.67,34.67,0,0,0,49.33,53V81.67h16V53a18.67,18.67,0,1,1,37.33,0V81.67h16V53A34.67,34.67,0,0,0,84,18.33Z" fill="#1e3a8a" transform="translate(35, -20) scale(1.2)" />
        <path d="M14.67,53a18.67,18.67,0,0,0,34.66,0H14.67Z" fill="#dc2626" transform="translate(35, -20) scale(1.2)" />
        <path d="M84,53a18.67,18.67,0,0,0-34.67,0H84Z" fill="#2563eb" transform="translate(35, -20) scale(1.2)" />
        <path d="M120.5,50.22c-23.33-14.63-54.22-15.52-78.43-2.51-4.23,2.27-8.12,5.22-11.5,8.74-2.3,2.4-4,5.43-5,8.65.6-1.53,1.31-3,2.1-4.39,11-19.14,33.43-30.82,57.89-30.82,15.6,0,30.15,5,42.11,13.79,3.87,2.83,7.2,6.3,9.89,10.29C143.68,58.4,134.42,56.73,120.5,50.22Z" fill="gray" transform="translate(35, -20) scale(1.2)" />
    </svg>
  );
}
