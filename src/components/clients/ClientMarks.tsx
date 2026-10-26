import Image from 'next/image';

/** Home page logo wall cell: the client's logo when one is set, otherwise its name. */
export function LogoCell({ name, logo }: { name: string; logo?: string | null }) {
  return (
    <div className={`logo-cell${logo ? ' has-logo' : ''}`} title={logo ? name : undefined}>
      {logo ? <Image src={logo} alt={name} width={200} height={80} unoptimized /> : name}
    </div>
  );
}

/** Client Base and industry page chip: name, with the logo beside it when one is set. */
export function ClientChip({ name, logo }: { name: string; logo?: string | null }) {
  return (
    <div className={`client-chip${logo ? ' has-logo' : ''}`}>
      {logo && <Image src={logo} alt="" width={96} height={40} unoptimized />}
      {name}
    </div>
  );
}

/** Disclaimer under client lists; mentions trademarks once any logo is on show. */
export function clientFinePrint(showsLogos: boolean) {
  return showsLogos
    ? 'Names and logos are listed as a factual record of client relationships, not as endorsements. Each logo is a trademark of its owner.'
    : 'Names are listed as a factual record of client relationships, not as endorsements.';
}
