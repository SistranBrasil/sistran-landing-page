import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Social from '@/components/Social';
import DemoForm, { type DemoField } from '@/components/forms/DemoForm';

export const metadata = {
  title: 'Trabalhe conosco · Sistran',
};

/* Mesmos campos do formulario de /trabalhe-conosco/ (aqui Telefone é
   obrigatorio, ao contrario do formulario de Contato). */
const FIELDS: readonly DemoField[] = [
  { kind: 'name-pair', id: 'nome', label: 'Nome Completo', required: true },
  { kind: 'input', id: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', required: true },
  { kind: 'input', id: 'telefone', label: 'Telefone', type: 'tel', autoComplete: 'tel', required: true },
  {
    kind: 'file',
    id: 'curriculo',
    label: 'Envio de arquivo',
    hint: 'Clique ou arraste um arquivo para esta área para fazer upload.',
    required: true,
  },
];

/* Escrita de /trabalhe-conosco/: sobretitulo "Carreira", o titulo em duas
   linhas e a frase de apoio. O site fecha esta pagina com o CTA comercial
   ("Quer conversar com um de nossos especialistas?") e publica o texto de
   carreira na pagina de Contato — aqui a pagina fecha com o bloco de LinkedIn,
   que é o que ela realmente tem escrito, sem CTA de publico errado.
   O site tambem nao lista vaga alguma nem link para portal de vagas; nada foi
   inventado para preencher.
   Fonte: .claude/conteudo-site/08-trabalhe-conosco.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Carreira"
        title="Venha fazer parte do nosso time!"
        highlight="#SomosSistraners"
        description={<p>Venha fazer parte de uma empresa que apoia seu desenvolvimento.</p>}
      />

      <section aria-label="Envie seu currículo" className="section-py">
        <div className="container-lp max-w-2xl">
          <DemoForm fields={FIELDS} />
        </div>
      </section>

      <Social />
    </PageShell>
  );
}
