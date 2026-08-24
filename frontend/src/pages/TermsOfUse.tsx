// STYLES
import styles from "./TermsOfUse.module.css";

// HOOKS

// COMPONENTS

const TermsOfUse = () => {
  return (
    <section className={styles.section_terms}>
      <article className={styles.article_terms}>
        <h1>Termos de Uso - Bingou</h1>
        <p>
          <strong>Última atualização:</strong> 24 de agosto de 2026
        </p>

        <p>
          Ao criar uma conta ou utilizar a plataforma Bingou (disponível em{" "}
          <a href="https://bingou.alexsandrogomes.dev" target="_blank" rel="noopener noreferrer">
            https://bingou.alexsandrogomes.dev
          </a>
          ), você concorda com os presentes Termos de Uso.
        </p>

        <section>
          <h2>1. Natureza do Serviço</h2>
          <p>
            O Bingou é exclusivamente um gerador e marcador digital de cartelas de bingo, e sorteador de bolas de bingo.
            O Bingou se trata de uma ferramenta utilitária. O seu uso deve ser destinado a jogos de bingo recreativos e
            sem premiação.
          </p>
          <p>
            <strong>
              O BINGOU NÃO É UM JOGO DE BINGO, NÃO DISTRIBUI PRÊMIOS E NÃO INTERMEDIA APOSTAS DE QUALQUER NATUREZA.
            </strong>
          </p>
        </section>

        <section>
          <h2>2. Uso Aceitável e Isenção de Responsabilidade</h2>
          <p>
            O usuário é o único responsável pela utilização que faz das cartelas, do marcador digital e do sorteador de
            bolas disponibilizados. O Bingou não se responsabiliza pelo uso indevido da ferramenta para a prática de
            jogos de azar ilegais, apostas não autorizadas ou qualquer atividade ilícita.
          </p>
        </section>

        <section>
          <h2>3. Planos e Limites de Cartelas</h2>
          <p>O serviço é oferecido sob o modelo de assinatura com as seguintes especificações:</p>
          <ul>
            <li>
              <strong>Plano Gratuito:</strong> Limite de até 50 cartelas por maço.
            </li>
            <li>
              <strong>Plano Básico (R$ 19,90/mês):</strong> Limite de até 2.000 cartelas por maço.
            </li>
            <li>
              <strong>Plano Completo (R$ 29,90/mês):</strong> Limite de até 10.000 cartelas por maço.
            </li>
          </ul>
          <p>
            Não há limite para a quantidade de maços criados pelo usuário. Os limites aplicam-se estritamente à
            quantidade de cartelas dentro de cada maço.
          </p>
        </section>

        <section>
          <h2>4. Pagamentos e Cancelamento</h2>
          <p>
            As assinaturas dos planos pagos são cobradas recorrentemente (mensalmente). O usuário pode solicitar o
            cancelamento da assinatura a qualquer momento através do painel da conta, garantindo o acesso aos recursos
            do plano contratado até o fim do período já pago.
          </p>
        </section>

        <section>
          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o código, design, marcas e funcionalidades do Bingou pertencem exclusivamente aos seus criadores. É
            proibida a reprodução, engenharia reversa ou cópia da plataforma sem autorização prévia.
          </p>
        </section>

        <section>
          <h2>6. Modificações nos Termos</h2>
          <p>
            Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações significativas serão
            notificadas aos usuários cadastrados.
          </p>
        </section>

        <section>
          <h2>7. Foro</h2>
          <p>Estes termos são regidos pelas leis da República Federativa do Brasil.</p>
        </section>
      </article>
    </section>
  );
};

export default TermsOfUse;
