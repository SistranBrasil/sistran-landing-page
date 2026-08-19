import { ProgressiveText } from './ProgressiveText';

type Props = {
  id: string;
  kicker: string;
  title: string;
  text?: string;
  size?: 'lg' | 'md';
  /** Acende o título palavra por palavra conforme o scroll. */
  progressive?: boolean;
};

/** Cabeçalho de seção com heading nomeado por `id` para aria-labelledby. */
export function SectionIntro({
  id,
  kicker,
  title,
  text,
  size = 'lg',
  progressive = false,
}: Props) {
  const headingClass = `lp-display lp-display--${size}`;

  return (
    <div className="lp-section-intro">
      <div>
        <p className="lp-eyebrow lp-tag">{kicker}</p>
        {progressive ? (
          <ProgressiveText as="h2" id={id} className={headingClass} text={title} />
        ) : (
          <h2 id={id} className={headingClass}>
            {title}
          </h2>
        )}
      </div>
      {text ? <p>{text}</p> : null}
    </div>
  );
}
