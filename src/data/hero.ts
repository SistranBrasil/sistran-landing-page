/* Os 3 slides do Slider Revolution do hero da home, com a escrita verbatim.
   Os CTAs originais apontam para `http://localhost/sistran_novo/...` e para
   slugs que nao existem (`/quem-somos/`, `/o-que-fazemos/`,
   `/cliente-e-parceiros/`); aqui cada um aponta para a rota equivalente deste
   projeto — o rotulo do botao é o do site.
   Fonte: .claude/conteudo-site/00-home.md (secao 2) */

export type HeroSlide = {
  id: string;
  /** Sobretitulo em caixa alta. So o slide 2 tem um. */
  eyebrow?: string;
  /** Titulo em duas linhas, como no site. */
  titleTop: string;
  titleBottom: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
};

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 'descubra-nos',
    titleTop: 'Soluções de Negócio',
    titleBottom: 'em Seguros',
    lead: 'A Sistran Brasil impulsiona o mercado de seguros com soluções tecnológicas inovadoras, otimizando processos, reduzindo custos e acelerando o crescimento das Seguradoras.',
    ctaLabel: 'Quem somos',
    ctaHref: '/quem-somos',
  },
  {
    id: 'solucoes-de-negocio',
    eyebrow: 'Sua empresa mais eficiente com a tecnologia certa.',
    titleTop: 'Tecnologia para',
    titleBottom: 'Excelência Operacional',
    lead: 'Oferecemos um portfólio completo de serviços de TI, desde consultoria estratégica até a implementação de soluções modernas de alta performance com uso de inteligência artificial e data science. Aplicamos tecnologias de ponta para otimizar suas operações e impulsionar o crescimento do negócio.',
    ctaLabel: 'Conheça Nossas Soluções',
    ctaHref: '/solucoes',
  },
  {
    id: 'nossos-compromissos',
    titleTop: 'Conhecimento de Negócio',
    titleBottom: 'específico para Seguradoras',
    lead: 'Compreendemos todo o processo e as operações de Seguros, por isso nossos serviços especializados de Squad, Alocação e Projetos são reconhecidos pela alta produtividade, com extrema acurácia. Possuímos um time de especialistas em negócio preparado para solucionar sua demanda.',
    ctaLabel: 'Clientes e Parceiros',
    ctaHref: '/parceiros-e-implementacoes',
  },
] as const;
