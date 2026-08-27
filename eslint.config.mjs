import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'linha-tempo-sistran-react/**',
      'sistran-video/**',
      'scroll-world/**',
      'subprojects/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    // Regras novas do React Compiler (eslint-plugin-react-hooks 7). O código atual
    // as viola em animações rAF/count-up que funcionam corretamente; tratadas como
    // aviso até a refatoração dedicada.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
];
