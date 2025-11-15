import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 100h-32v48h32a28 28 0 0 0 0-56h-32v28h32a12 12 0 0 1 0 24h-32v-44h48.89a8 8 0 0 0 5.9-2.51l15.32-17.5a8 8 0 1 0-11.82-10.32L179.11 92H168a28 28 0 0 0-27.42 21.42L116 172h-12a8 8 0 0 0 0 16h36a8 8 0 0 0 7.42-5.42L172 124h-4a8 8 0 0 0 0 16h-16v8h16a28 28 0 0 0 0-56Z" transform="translate(-15 -15) scale(1.15)" />
      </g>
    </svg>
  );
}
