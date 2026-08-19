import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import DemoForm, { type DemoField } from '@/components/forms/DemoForm';
import { CONTACT_EMAIL, CONTACT_PHONE, HQ_ADDRESS, UNITS } from '@/data/contact';

export const metadata = {
  title: 'Contato · Sistran',
};

/* Mesmos campos e mesmas obrigatoriedades do formulario de /contato/ (Telefone
   nao é obrigatorio aqui, e é em Trabalhe conosco — divergencia do site,
   preservada). */
const FIELDS: readonly DemoField[] = [
  { kind: 'name-pair', id: 'nome', label: 'Seu Nome e Sobrenome', required: true },
  { kind: 'input', id: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', required: true },
  { kind: 'input', id: 'telefone', label: 'Telefone', type: 'tel', autoComplete: 'tel' },
  {
    kind: 'input',
    id: 'empresa',
    label: 'Empresa',
    type: 'text',
    autoComplete: 'organization',
    required: true,
  },
  { kind: 'textarea', id: 'mensagem', label: 'Escreva sua mensagem', required: true },
];

/* Escrita de /contato/. A secao "Onde Estamos" do site nao tem uma unica
   palavra — so um mapa embutido por script. Aqui ela carrega o endereco em
   texto e a lista de escritorios, para nao ficar vazia sem o mapa nem para
   leitor de tela.
   Fonte: .claude/conteudo-site/09-contato.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        title="Preencha o formulário e"
        highlight="fale com a gente!"
        description={
          <p>
            A Inovação e a Transformação Digital começam hoje. Traga a evolução para a sua empresa
            com a <strong className="font-bold text-white">SISTRAN!</strong>
          </p>
        }
      />

      <section aria-label="Formulário de contato" className="section-py">
        <div className="container-lp grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <ul className="space-y-5">
            <li className="glass-card-hover flex gap-4 p-6">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#A5F0FF]" strokeWidth={1.8} />
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Matriz - Sistran São Paulo:
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{HQ_ADDRESS}</p>
              </div>
            </li>
            <li className="glass-card-hover flex gap-4 p-6">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#A5F0FF]" strokeWidth={1.8} />
              <div>
                <h2 className="font-display text-base font-bold text-white">E-mail</h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 inline-block text-sm text-white/85 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </li>
            <li className="glass-card-hover flex gap-4 p-6">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#A5F0FF]" strokeWidth={1.8} />
              <div>
                <h2 className="font-display text-base font-bold text-white">Telefone:</h2>
                <a
                  href={`tel:${CONTACT_PHONE.replace(/\D/g, '')}`}
                  className="mt-2 inline-block text-sm text-white/85 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_PHONE}
                </a>
              </div>
            </li>
          </ul>

          <DemoForm fields={FIELDS} />
        </div>
      </section>

      {/* Onde Estamos — no site esta secao é so um mapa, sem texto nenhum. */}
      <section aria-labelledby="onde-estamos" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <span className="tag-section">#sistran</span>
          <h2 id="onde-estamos" className="mt-4 font-display text-section font-bold text-ink">
            Onde Estamos
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {UNITS.map((u) => (
              <article key={u.id} className="glass-card p-6">
                <h3 className="font-display text-lg font-bold text-ink">
                  {u.city} – {u.state}
                </h3>
                {/* Pato Branco e Rio de Janeiro nao tem endereco nem telefone
                    publicados em lugar nenhum do site. */}
                {u.address ? (
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{u.address}</p>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-ink-faint">
                    Endereço não divulgado.
                  </p>
                )}
                {u.phone && (
                  <a
                    href={`tel:${u.phone.replace(/\D/g, '')}`}
                    className="mt-3 inline-block text-sm font-semibold text-[#1273BC] underline underline-offset-4"
                  >
                    {u.phone}
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Este bloco esta na pagina de Contato do site (e o CTA comercial esta em
          Trabalhe conosco — os dois estao trocados na origem). Mantido onde o
          site o publica, com o link apontando para a pagina de carreira. */}
      <section aria-labelledby="time-sistran" className="section-py">
        <div className="container-lp max-w-3xl">
          <span className="tag-section">#sistran</span>
          <h2 id="time-sistran" className="mt-4 font-display text-section font-bold text-white">
            Venha Fazer Parte do <span className="text-gradient-brand">#timeSISTRAN!</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/85">
            Nós temos a vaga ideal para você. Venha fazer parte de uma empresa que acolhe o
            colaborador, oferece diversos benefícios e apoia o seu desenvolvimento.
          </p>
          <Link href="/trabalhe-conosco" className="btn-primary mt-8 inline-flex">
            Venha ser Sistran
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
