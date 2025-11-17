import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <path d="M25,20 v40 a25,25 0 0,0 50,0 V20 H50 V60 a25,25 0 0,0 -0,0 H50 V20 z" fill="#b91c1c" />
      <path d="M75,20 v40 a25,25 0 0,1 -50,0 V20 H50 V60 a25,25 0 0,1 -0,0 H50 V20 z" fill="#1e3a8a" />
      <path d="M20,45 C35,30 65,30 80,45 C70,35 50,32 30,35 Z" fill="#6c757d" />
      <rect x="32" y="25" width="8" height="15" fill="white" />
      <rect x="60" y="25" width="8" height="15" fill="white" />
    </svg>
  );
}
