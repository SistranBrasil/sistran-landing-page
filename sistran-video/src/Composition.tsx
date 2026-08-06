import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Video} from '@remotion/media';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily} = loadFont();

// ── Design tokens (mesmos do site) ─────────────────────────────
const NAVY = '#04122A';
const CYAN = '#0ed8f6';
const BLUE = '#0079CB';
const VIOLET = '#a855f7';
const WHITE = '#f8fafc';
const MUTED = '#B8DDF6';

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// ── Helpers de animação ────────────────────────────────────────
const useFade = (start: number, dur = 20) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
};

const useRise = (start: number, dur = 24, dist = 40) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
};

// Fade-out global de um capítulo (aplicado no wrapper)
const useChapterOut = (outStart: number, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [outStart, outStart + dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
};

// ── Typewriter ─────────────────────────────────────────────────
const Typewriter: React.FC<{
  text: string;
  start: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
}> = ({text, start, charsPerFrame = 0.55, style}) => {
  const frame = useCurrentFrame();
  const chars = Math.max(0, Math.floor((frame - start) * charsPerFrame));
  const shown = text.slice(0, chars);
  const done = chars >= text.length;
  const cursorOn = done ? Math.floor(frame / 16) % 2 === 0 : true;
  return (
    <span style={style}>
      {shown}
      <span
        style={{
          display: 'inline-block',
          width: '0.08em',
          height: '0.95em',
          marginLeft: '0.06em',
          verticalAlign: 'text-bottom',
          background: CYAN,
          opacity: cursorOn ? 1 : 0,
          boxShadow: `0 0 18px ${CYAN}`,
        }}
      />
    </span>
  );
};

// ── Contador ───────────────────────────────────────────────────
const Counter: React.FC<{
  value: number;
  suffix: string;
  label: string;
  start: number;
}> = ({value, suffix, label, start}) => {
  const frame = useCurrentFrame();
  const opacity = useFade(start, 16);
  const y = useRise(start, 22, 30);
  const n = Math.round(
    interpolate(frame, [start, start + 40], [0, value], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    })
  );
  return (
    <div style={{opacity, transform: `translateY(${y}px)`}}>
      <div
        style={{
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          background: `linear-gradient(100deg, ${WHITE} 20%, ${CYAN} 80%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {n.toLocaleString('pt-BR')}
        {suffix}
      </div>
      <div style={{fontSize: 26, color: MUTED, fontWeight: 500, marginTop: 6}}>
        {label}
      </div>
    </div>
  );
};

// ── Chip glass ─────────────────────────────────────────────────
const Chip: React.FC<{text: string; start: number}> = ({text, start}) => {
  const opacity = useFade(start, 16);
  const y = useRise(start, 22, 26);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        padding: '18px 34px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.16)',
        background:
          'linear-gradient(135deg, rgba(8,26,55,0.85), rgba(15,44,88,0.55))',
        color: WHITE,
        fontSize: 28,
        fontWeight: 600,
        boxShadow: `0 0 30px -12px ${BLUE}`,
      }}
    >
      {text}
    </div>
  );
};

const Eyebrow: React.FC<{text: string; start: number}> = ({text, start}) => {
  const opacity = useFade(start, 16);
  return (
    <div
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        color: CYAN,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        marginBottom: 34,
      }}
    >
      <div style={{width: 54, height: 2, background: CYAN}} />
      {text}
    </div>
  );
};

// Zona de conteúdo: coluna esquerda (os vídeos têm a esquerda escura)
const LeftColumn: React.FC<{children: React.ReactNode; opacity?: number}> = ({
  children,
  opacity = 1,
}) => (
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      paddingLeft: 130,
      paddingRight: 620,
      opacity,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ── Capítulo 1: badge + typewriter ─────────────────────────────
const Chapter1: React.FC = () => {
  const out = useChapterOut(170);
  const badgeOpacity = useFade(8, 18);
  const badgeY = useRise(8, 24, 24);
  return (
    <LeftColumn opacity={out}>
      <div
        style={{
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
          alignSelf: 'flex-start',
          padding: '14px 30px',
          borderRadius: 999,
          border: `1px solid rgba(14,216,246,0.4)`,
          color: CYAN,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: 46,
          background: 'rgba(4,18,42,0.5)',
        }}
      >
        Especialistas em seguros desde 1988
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 96,
          lineHeight: 1.08,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: WHITE,
        }}
      >
        <Typewriter start={40} text="Especialistas em tecnologia para seguradoras." />
      </h1>
    </LeftColumn>
  );
};

// ── Capítulo 2: IA + soluções ──────────────────────────────────
const Chapter2: React.FC = () => {
  const out = useChapterOut(200);
  const titleOpacity = useFade(14, 20);
  const titleY = useRise(14, 26, 36);
  const chips = [
    'APIs & Integrações',
    'Migrações e Sustentação',
    'Squads dedicadas',
    'Managed Services',
    'IA aplicada a seguros',
  ];
  return (
    <LeftColumn opacity={out}>
      <Eyebrow text="Tecnologia + IA" start={4} />
      <h2
        style={{
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 84,
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: WHITE,
        }}
      >
        IA pragmática.{' '}
        <span
          style={{
            background: `linear-gradient(100deg, ${CYAN}, ${VIOLET})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Entregas reais.
        </span>
      </h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 56}}>
        {chips.map((c, i) => (
          <Chip key={c} text={c} start={44 + i * 12} />
        ))}
      </div>
    </LeftColumn>
  );
};

// ── Capítulo 3: números ────────────────────────────────────────
const Chapter3: React.FC = () => {
  const out = useChapterOut(190);
  const stats = [
    {value: 850, suffix: '+', label: 'Profissionais no Grupo Sistran'},
    {value: 130, suffix: '+', label: 'Clientes atendidos'},
    {value: 230, suffix: '+', label: 'Implementações de ERPs'},
    {value: 23, suffix: '+', label: 'Prêmios e reconhecimentos'},
  ];
  return (
    <LeftColumn opacity={out}>
      <Eyebrow text="Resultados que sustentam" start={4} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          rowGap: 74,
          columnGap: 90,
        }}
      >
        {stats.map((s, i) => (
          <Counter key={s.label} {...s} start={20 + i * 14} />
        ))}
      </div>
    </LeftColumn>
  );
};

// ── Capítulo 4: abrangência ────────────────────────────────────
const Chapter4: React.FC = () => {
  const out = useChapterOut(170);
  const titleOpacity = useFade(10, 20);
  const titleY = useRise(10, 26, 36);
  const subOpacity = useFade(52, 20);
  const subY = useRise(52, 26, 28);
  return (
    <LeftColumn opacity={out}>
      <Eyebrow text="Do Brasil para o mundo" start={4} />
      <h2
        style={{
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 84,
          lineHeight: 1.12,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: WHITE,
        }}
      >
        Da subscrição ao sinistro.
        <br />
        <span
          style={{
            background: `linear-gradient(100deg, ${CYAN}, ${BLUE})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Do vida ao P&C.
        </span>
      </h2>
      <p
        style={{
          margin: 0,
          marginTop: 44,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontSize: 34,
          lineHeight: 1.5,
          color: MUTED,
          maxWidth: 900,
          fontWeight: 500,
        }}
      >
        Há mais de três décadas transformando processos, sistemas e operações
        de seguradoras no Brasil e no exterior.
      </p>
    </LeftColumn>
  );
};

// ── Capítulo 5: logo final ─────────────────────────────────────
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const logoOpacity = useFade(16, 30);
  const logoScale = interpolate(frame, [16, 60], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const lineOpacity = useFade(64, 22);
  const glow = interpolate(frame, [16, 90], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {/* Glow atrás da logo */}
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 560,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(0,121,203,${glow * 0.35}), transparent 70%)`,
        }}
      />
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo é branca sobre cinza — screen + mask remove o fundo */}
        <Img
          src={staticFile('sistran-logo.png')}
          style={{
            width: 860,
            mixBlendMode: 'screen',
            maskImage:
              'radial-gradient(ellipse 62% 58% at 50% 50%, black 52%, transparent 76%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 62% 58% at 50% 50%, black 52%, transparent 76%)',
          }}
        />
        <div
          style={{
            opacity: lineOpacity,
            marginTop: 26,
            fontSize: 30,
            fontWeight: 500,
            color: MUTED,
            letterSpacing: '0.06em',
          }}
        >
          Especialistas em tecnologia para seguradoras — desde 1988
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Fundos (clipes do Flow) com crossfade ──────────────────────
const Backgrounds: React.FC = () => {
  const frame = useCurrentFrame();
  // cena1 (filamentos): 0–240 | cena2 (esfera IA): 200–470 | cena3 (malha): 430–fim
  const bg1 = interpolate(frame, [200, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bg2 = interpolate(frame, [200, 240, 430, 470], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bg3 = interpolate(frame, [430, 470], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vidStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };
  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      <Sequence durationInFrames={250}>
        <AbsoluteFill style={{opacity: bg1}}>
          <Video muted loop src={staticFile('videos/cena1.mp4')} style={vidStyle} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={200} durationInFrames={280}>
        <AbsoluteFill style={{opacity: bg2}}>
          <Video muted loop src={staticFile('videos/cena2.mp4')} style={vidStyle} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={430}>
        <AbsoluteFill style={{opacity: bg3}}>
          <Video muted loop src={staticFile('videos/cena3.mp4')} style={vidStyle} />
        </AbsoluteFill>
      </Sequence>
      {/* Darken à esquerda para garantir leitura dos textos */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, rgba(4,18,42,0.82) 0%, rgba(4,18,42,0.55) 42%, transparent 68%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Composição principal — 36s @ 30fps = 1080 frames ──────────
export const SistranHero: React.FC = () => {
  return (
    <AbsoluteFill style={{fontFamily, backgroundColor: NAVY}}>
      <Backgrounds />
      <Sequence durationInFrames={195}>
        <Chapter1 />
      </Sequence>
      <Sequence from={205} durationInFrames={225}>
        <Chapter2 />
      </Sequence>
      <Sequence from={445} durationInFrames={215}>
        <Chapter3 />
      </Sequence>
      <Sequence from={675} durationInFrames={195}>
        <Chapter4 />
      </Sequence>
      <Sequence from={880}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
