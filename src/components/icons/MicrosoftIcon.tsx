import { SVGProps } from 'react';

export function MicrosoftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path fill="#f25022" d="M0 0h11.5v11.5H0z"/>
      <path fill="#00a4ef" d="M12.5 0H24v11.5H12.5z"/>
      <path fill="#7fba00" d="M0 12.5h11.5V24H0z"/>
      <path fill="#ffb900" d="M12.5 12.5H24V24H12.5z"/>
    </svg>
  );
}