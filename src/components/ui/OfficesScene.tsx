'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import { OFFICES } from '@/data/aSistran';
import BrazilOfficesMap from './BrazilOfficesMap';
import type { ExplorerApi } from './BuildingExplorer';

/* WebGL nao roda no servidor, e a cena inteira (three + controles) é o maior
   pacote da pagina: entra sob demanda, e só quando a rolagem chega em Sao
   Paulo. */
const ExploradorPredio = dynamic(
  () => import('./BuildingExplorer').then((m) => m.BuildingExplorer),
  { ssr: false },
);

/**
 * Cena dos escritorios: o mapa fica preso na tela enquanto a rolagem percorre as
 * cidades de sul para nordeste — Pato Branco e Sao Paulo. A cada cidade o
 * marcador acende, a rota chega até ele e as fotos daquele escritorio entram.
 *
 * O Rio de Janeiro saiu da cena por ora: continua no rodape e na pagina de
 * contato, que sao as suas outras aparicoes no site.
 *
 * A secao é alta com o interior `sticky`, como no explorador 3D e na secao de
 * diferenciais, e nao `pin: true`: pin remonta o no no DOM e desalinha com o
 * scroll suave do Lenis.
 *
 * O que muda por quadro de rolagem viaja por atributo e variavel CSS aplicados
 * num ref — nao por estado — para nao re-renderizar a 60 Hz. O estado guarda só
 * o indice da cidade, que muda tres vezes na secao inteira.
 *
 * Nada aqui depende de animacao para existir: abaixo de 1024px e com preferencia
 * por menos movimento a cena vira lista, com todas as cidades acesas no mapa, a
 * rota inteira desenhada e todas as fotos visiveis.
 *
 * Os textos sao os que o site ja tem: as descricoes de Sao Paulo e Pato Branco de
 * `OFFICES` e os rotulos do proprio mapa.
 */

const clamp01 = (valor: number) => Math.min(1, Math.max(0, valor));

type Foto = { base: string; largura: number; altura: number; alt: string };
type Cidade = { id: string; nome: string; texto?: string; fotos: Foto[] };

const textoDe = (id: string) => OFFICES.find((o) => o.id === id)?.text;

/* As tres fotos por cidade: uma de fachada e duas do interior. Cada arquivo tem
   duas larguras geradas por `scripts/otimizar-fotos-escritorios.mjs`; o `srcSet`
   deixa o navegador escolher, o que o `next/image` nao faria aqui porque o
   projeto roda com `images: { unoptimized: true }`. */
const CIDADES: Cidade[] = [
  {
    id: 'pr',
    nome: 'Pato Branco',
    texto: textoDe('pr'),
    fotos: [
      { base: 'pb-0', largura: 1600, altura: 1201, alt: 'Fachada da Sistran em Pato Branco' },
      {
        base: 'pb-3',
        largura: 1280,
        altura: 960,
        alt: 'Área de trabalho da Sistran em Pato Branco',
      },
      { base: 'pb-2', largura: 1024, altura: 768, alt: 'Equipe da Sistran em Pato Branco' },
    ],
  },
  {
    id: 'sp',
    nome: 'São Paulo',
    texto: textoDe('sp'),
    fotos: [
      {
        base: 'sp-1-1',
        largura: 1600,
        altura: 2133,
        alt: 'Fachada do escritório da Sistran em São Paulo',
      },
      {
        base: 'sp-6',
        largura: 1600,
        altura: 2133,
        alt: 'Área de trabalho do escritório da Sistran em São Paulo',
      },
      {
        base: 'sp-4',
        largura: 960,
        altura: 1280,
        alt: 'Área de convivência do escritório da Sistran em São Paulo',
      },
    ],
  },
];

function Fotos({ fotos }: { fotos: Foto[] }) {
  if (!fotos.length) return null;
  return (
    <div className="os-fotos">
      {fotos.map((f, i) => (
        <figure className="os-foto" data-ordem={i} key={f.base}>
          {/* Tag simples de proposito: como as imagens do projeto rodam sem
              otimizacao, o componente do framework nao geraria variante alguma,
              e o srcSet escrito a mao é o que de fato entrega a foto menor no
              celular. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/escritorios/${f.base}-1600.webp`}
            srcSet={`/images/escritorios/${f.base}-960.webp 960w, /images/escritorios/${f.base}-1600.webp ${f.largura}w`}
            sizes="(min-width: 1024px) 40vw, 100vw"
            width={f.largura}
            height={f.altura}
            alt={f.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}

/* Partitura da rolagem, em constantes nomeadas — nao em numeros soltos no meio
   do codigo. O mapa nasce vazio e se desenha; só depois as cidades entram, uma
   por trecho. */
const ENTRADA_FIM = 0.2; // o contorno acaba de se desenhar
const PREENCHE_INICIO = 0.08; // o corpo do pais comeca a aparecer
const ROTA_INICIO = 0.26;
const ROTA_FIM = 0.86;
const CIDADES_INICIO = 0.22; // antes disso nenhuma cidade esta acesa

/* Trecho de Sao Paulo: é o ultimo, e é nele que a sede sai do mapa e vira
   predio. O inicio é calculado da mesma divisao que escolhe a cidade ativa —
   escrito de novo como numero solto, os dois sairiam do lugar juntos. */
const SP_INICIO =
  CIDADES_INICIO + (1 - CIDADES_INICIO) * ((CIDADES.length - 1) / CIDADES.length);
/* Fracoes DENTRO do trecho de Sao Paulo. O predio chega no primeiro terco;
   depois ele se monta e a camera gira (partitura do proprio explorador); e o
   andar do escritorio acende quando a torre ja esta de pé. */
const PREDIO_SURGIR = 0.3;
const MARCADOR_INICIO = 0.56;
/* Montagem comeca um pouco antes do trecho: compilar shader e primeira imagem
   custam alguns quadros, e ninguem deve ver isso acontecendo. */
const PREDIO_MONTAR = 0.06;

export default function OfficesScene() {
  const [dirigindo, setDirigindo] = useState(false);
  /* -1 = ainda na revelacao do mapa, nenhuma cidade acesa. */
  const [ativa, setAtiva] = useState(-1);
  const trilhaRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const ativaRef = useRef(-1);
  /* O predio 3D entra uma vez e fica: montar e desmontar WebGL a cada passada
     pela fronteira do trecho custaria contexto novo, shader novo e um quadro
     branco. Quando nao é a vez dele, o CSS o deixa em opacidade 0. */
  const [predio, setPredio] = useState(false);
  const predioRef = useRef(false);
  const predioApiRef = useRef<ExplorerApi | null>(null);
  const predioProgressoRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
    avaliar();
    mq.addEventListener('change', avaliar);
    return () => mq.removeEventListener('change', avaliar);
  }, []);

  useEffect(() => {
    if (!dirigindo) return;
    const trilha = trilhaRef.current;
    const palco = palcoRef.current;
    if (!trilha || !palco) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        /* Revelacao: o contorno se desenha, e o corpo do pais entra atras dele. */
        palco.style.setProperty('--os-contorno', String(clamp01(p / ENTRADA_FIM)));
        palco.style.setProperty(
          '--os-entrada',
          String(clamp01((p - PREENCHE_INICIO) / (ENTRADA_FIM - PREENCHE_INICIO))),
        );
        /* A rota comeca depois da primeira cidade se apresentar e termina antes
           do fim, para Sao Paulo nao acender no ultimo pixel. */
        palco.style.setProperty(
          '--os-rota',
          String(clamp01((p - ROTA_INICIO) / (ROTA_FIM - ROTA_INICIO))),
        );
        palco.style.setProperty('--os-p', String(p));

        /* Sao Paulo: o mapa cede a cena para a torre da sede. O progresso vai
           por chamada imperativa, nao por estado — a cena 3D nao pode depender
           de re-render para acompanhar a rolagem. */
        const sp = clamp01((p - SP_INICIO) / (1 - SP_INICIO));
        palco.style.setProperty('--os-predio', String(clamp01(sp / PREDIO_SURGIR)));
        predioProgressoRef.current = sp;
        predioApiRef.current?.setProgress(sp);
        predioApiRef.current?.setDestaque(
          clamp01((sp - MARCADOR_INICIO) / (1 - MARCADOR_INICIO)),
        );
        if (!predioRef.current && p > SP_INICIO - PREDIO_MONTAR) {
          predioRef.current = true;
          setPredio(true);
        }

        const trecho = (p - CIDADES_INICIO) / (1 - CIDADES_INICIO);
        const indice =
          trecho < 0 ? -1 : Math.min(CIDADES.length - 1, Math.floor(trecho * CIDADES.length));
        if (indice === ativaRef.current) return;
        ativaRef.current = indice;
        setAtiva(indice);
      },
    });

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      gatilho.kill();
      for (const nome of ['--os-contorno', '--os-entrada', '--os-rota', '--os-p', '--os-predio']) {
        palco.style.removeProperty(nome);
      }
    };
  }, [dirigindo]);

  /* Modo lista (abaixo de 1024px): sem tela cheia e sem sticky, mas o mapa
     continua surgindo com a rolagem — se desenha enquanto a secao atravessa a
     janela. É a mesma partitura do modo scroll, só sem o ciclo das cidades: em
     tela estreita as duas ficam acesas, porque nao ha trecho por cidade.

     Nada aqui é requisito: se este efeito nao rodar (sem JavaScript, ou com
     movimento reduzido), as variaveis nao existem e o CSS usa 1 em todas — o
     mapa aparece pronto. */
  useEffect(() => {
    if (dirigindo || prefersReducedMotion()) return;
    const trilha = trilhaRef.current;
    const palco = palcoRef.current;
    if (!trilha || !palco) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: 'top 88%',
      end: 'bottom 55%',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        palco.style.setProperty('--os-contorno', String(clamp01(p / 0.55)));
        palco.style.setProperty('--os-entrada', String(clamp01((p - 0.1) / 0.45)));
        palco.style.setProperty('--os-rota', String(clamp01((p - 0.4) / 0.5)));
      },
    });

    return () => {
      gatilho.kill();
      for (const nome of ['--os-contorno', '--os-entrada', '--os-rota']) {
        palco.style.removeProperty(nome);
      }
    };
  }, [dirigindo]);

  /* Equivalente por clique e por teclado ao que a rolagem faz: leva a janela ao
     meio do trecho daquela cidade, e é o proprio ScrollTrigger que atualiza o
     mapa e as fotos no caminho. */
  const irPara = useCallback((indice: number) => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const inicio = trilha.offsetTop;
    const percurso = trilha.offsetHeight - window.innerHeight;
    const fracao = CIDADES_INICIO + (1 - CIDADES_INICIO) * ((indice + 0.5) / CIDADES.length);
    window.scrollTo({ top: inicio + percurso * fracao, behavior: 'smooth' });
  }, []);

  const modo = dirigindo ? 'scroll' : 'lista';

  return (
    <div className="os-trilha" data-modo={modo} ref={trilhaRef}>
      <div className="os-inner">
        {/* Durante a revelacao do mapa `data-ativa` vale `nenhuma`: o atributo
            existe, entao o CSS mantem as cidades apagadas, mas nenhuma esta
            acesa. Sem rolagem dirigindo o atributo nao existe e nada apaga. */}
        <div
          className="os-palco"
          data-modo={modo}
          data-ativa={dirigindo ? (ativa >= 0 ? CIDADES[ativa].id : 'nenhuma') : undefined}
          ref={palcoRef}
        >
          {/* O mapa ocupa a tela inteira e é o fundo da cena; os paineis de cada
              cidade pousam sobre ele, do lado em que a propria linha de chamada
              do mapa aponta. */}
          <div className="os-mapa">
            <BrazilOfficesMap />
          </div>

          {/* A sede em tres dimensoes, na MESMA cena do mapa: quando a rolagem
              chega em Sao Paulo a torre surge sobre o mapa que se apaga, e o 2º
              andar acende marcado — é o andar do escritorio. As fotos daquele
              andar estao no painel de Sao Paulo, ao lado.

              Sem controles proprios: aqui o predio é cena de apoio de uma secao
              dirigida por rolagem, e a roda do mouse tem de continuar rolando a
              pagina em vez de dar zoom. Quem quiser girar o modelo tem o
              explorador 360°, que segue com a moldura inteira. */}
          {predio && (
            <div className="os-predio">
              <ExploradorPredio
                model="tower"
                apiRef={predioApiRef}
                progressRef={predioProgressoRef}
                andarDestacado={2}
                rotuloDestaque="2º andar · escritório São Paulo"
                mostrarControles={false}
              />
            </div>
          )}

          <div className="os-cidades">
            {CIDADES.map((c) => (
              <article className="os-painel" data-cidade={c.id} id={`os-painel-${c.id}`} key={c.id}>
                <h3 className="os-cidade-nome">{c.nome}</h3>
                {c.texto ? <p className="os-cidade-texto">{c.texto}</p> : null}
                <Fotos fotos={c.fotos} />
              </article>
            ))}
          </div>

          {dirigindo && (
            <div className="os-abas" role="tablist" aria-label="Escritórios no Brasil">
              {CIDADES.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === ativa}
                  aria-controls={`os-painel-${c.id}`}
                  className={i === ativa ? 'active' : ''}
                  onClick={() => irPara(i)}
                >
                  {c.nome}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
