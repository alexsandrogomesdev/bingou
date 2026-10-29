// STYLES
import styles from "./PrivacyPolicy.module.css";

// HOOKS

// COMPONENTS

const PrivacyPolicy = () => {
  return (
    <section className={styles.section_privacy}>
      <article className={styles.article_privacy}>
        <h1>Política de Privacidade - Bingou</h1>
        <p>
          <strong>Última atualização:</strong> 24 de agosto de 2026
        </p>

        <p>
          A sua privacidade é importante para nós. Esta Política de Privacidade explica como o Bingou coleta, usa e
          protege as informações dos usuários.
        </p>

        <section>
          <h2>1. Informações que Coletamos</h2>
          <p>Para a prestação do serviço, coletamos apenas os dados estritamente necessários:</p>
          <ul>
            <li>
              <strong>Dados de Cadastro:</strong> Nome, cpf, endereço de e-mail, telefone e senha.
            </li>
            <li>
              <strong>Dados de Pagamento:</strong> Processados de forma segura por intermediadores de pagamento
              parceiros. Não armazenamos dados completos de cartão de crédito em nossos servidores.
            </li>
            <li>
              <strong>Dados de Uso:</strong> Informações sobre os maços e cartelas gerados para o correto funcionamento
              da ferramenta.
            </li>
            <li>
              <strong>Dados Locais (Sorteador):</strong> O histórico dos números sorteados na funcionalidade de
              sorteador é salvo exclusivamente no seu navegador (via <i>localStorage</i>) e não é enviado ou armazenado
              em nossos servidores.
            </li>
            <li>
              <strong>Dados de Publicidade e Dispositivo:</strong> Através da integração com o Google AdMob, podem ser
              coletados identificadores exclusivos do dispositivo (como o Google Advertising ID - GAID no Android),
              endereço IP, informações de rede, dados de localização aproximada e interações com os anúncios veiculados
              na plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Uso das Informações</h2>
          <p>Os dados coletados são utilizados exclusivamente para:</p>
          <ul>
            <li>Autenticar o acesso do usuário à sua conta.</li>
            <li>Gerenciar as assinaturas e limites dos planos (Gratuito, Básico e Completo).</li>
            <li>Enviar comunicações importantes sobre o serviço ou suporte técnico.</li>
          </ul>
        </section>

        <section>
          <h2>3. Compartilhamento de Dados</h2>
          <p>
            O compartilhamento de dados é estritamente limitado às seguintes finalidades necessárias para o
            funcionamento e monetização do serviço:
          </p>
          <strong>Intermediadores de Pagamento:</strong>
          <p>Para processamento de assinaturas e transações financeiras dos planos pagos.</p>
          <strong>Redes de Anúncios (Google AdMob):</strong>
          <p>
            Para a veiculação e personalização de anúncios publicitários no Plano Gratuito. O Google AdMob pode utilizar
            identificadores de publicidade do dispositivo para apresentar anúncios relevantes com base em interesses.
          </p>
        </section>

        <section>
          <h2>4. Armazenamento e Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados contra acesso não autorizado,
            perda ou alteração.
          </p>
          <p>As senhas são armazenadas utilizando métodos de criptografia seguros.</p>
          <p>O acesso a sua conta só é autorizado por meio de autenticação.</p>
        </section>

        <section>
          <h2>5. Direitos do Usuário (LGPD)</h2>
          <p>
            Você tem o direito de solicitar o acesso, a correção ou a exclusão definitiva dos seus dados pessoais
            armazenados em nossa plataforma a qualquer momento, entrando em contato pelo e-mail de suporte.
          </p>
        </section>

        <section>
          <h2>6. Contato</h2>
          <p>
            Para dúvidas sobre esta Política de Privacidade ou solicitações relativas aos seus dados, entre em contato
            através do e-mail:
            <a href="mailto:suporte@alexsandrogomes.dev">suporte@alexsandrogomes.dev</a>.
          </p>
        </section>
      </article>
    </section>
  );
};

export default PrivacyPolicy;
