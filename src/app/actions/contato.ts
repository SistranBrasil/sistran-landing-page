'use server';

/**
 * Server action dos formulários de contato.
 *
 * Existe por um motivo de segurança apontado no relatório de UX (p12, P0): os
 * dois formulários eram `<form onSubmit>` sem `method` nem `action`. Sem JS — ou
 * com o JS ainda carregando — o navegador cai no padrão do HTML e faz **GET**,
 * publicando nome, e-mail, telefone e a mensagem inteira na barra de endereços,
 * no histórico e nos logs de proxy.
 *
 * Com uma server action o envio é sempre POST. Nada de dado pessoal na URL, com
 * ou sem JS.
 *
 * ── Estado atual: ainda é demonstração ──────────────────────────────────────
 * Não há integração externa: nada é gravado, nada é enviado por e-mail. É o que
 * o texto do site já dizia ("Este formulário é uma demonstração. Nenhuma
 * integração externa foi executada.") e esse texto não mudou.
 *
 * O relatório (p12, P1) pede que consentimento e dados passem a um backend
 * próprio com revisão de LGPD antes de publicar. Enquanto isso não existir, esta
 * action valida e devolve o estado — de propósito sem persistir nada, porque
 * guardar dado pessoal sem base legal definida seria pior que não guardar.
 */

/* O tipo e o `ESTADO_INICIAL` vivem em `./contato-estado`: este módulo é
   `'use server'` e só pode exportar funções async. Reexportar daqui reintroduz o
   mesmo problema — os componentes importam de lá. */
import type { EstadoContato } from './contato-estado';

const OBRIGATORIOS = ['nome', 'email', 'telefone', 'mensagem'] as const;

const texto = (dados: FormData, campo: string) =>
  typeof dados.get(campo) === 'string' ? (dados.get(campo) as string).trim() : '';

export async function enviarContato(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  const invalidos = OBRIGATORIOS.filter((campo) => {
    const valor = texto(dados, campo);
    if (!valor) return true;
    // Validação mínima; o navegador já faz o resto pelos tipos dos inputs.
    if (campo === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    return false;
  });

  if (invalidos.length) {
    return {
      status: 'erro',
      mensagem:
        'Não foi possível enviar. Verifique os campos obrigatórios e tente novamente.',
      invalidos,
    };
  }

  return {
    status: 'sucesso',
    mensagem: 'Mensagem recebida.',
    invalidos: [],
  };
}

/**
 * Mesma garantia de POST para os formulários de campos variáveis (`DemoForm`:
 * Trabalhe Conosco, Contato, ESG…). Aqui a obrigatoriedade de cada campo é
 * declarada no próprio HTML pelo `required`, então a validação do navegador já
 * barra o envio vazio; esta action não tem como saber quais campos existem.
 */
export async function enviarFormulario(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  const algumPreenchido = [...dados.values()].some(
    (v) => (typeof v === 'string' ? v.trim().length > 0 : true),
  );

  if (!algumPreenchido) {
    return {
      status: 'erro',
      mensagem: 'Não foi possível enviar. Preencha os campos obrigatórios.',
      invalidos: [],
    };
  }

  return { status: 'sucesso', mensagem: 'Mensagem recebida.', invalidos: [] };
}
