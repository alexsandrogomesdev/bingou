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
          <strong>Última atualização:</strong> 22 de agosto de 2026
        </p>

        <p>
          A sua privacidade é importante para nós. Esta Política de Privacidade
          explica como o Bingou coleta, usa e protege as informações dos
          usuários.
        </p>

        <section>
          <h2>1. Informações que Coletamos</h2>
          <p>
            Para a prestação do serviço, coletamos apenas os dados estritamente
            necessários:
          </p>
          <ul>
            <li>
              <strong>Dados de Cadastro:</strong> Nome, cpf, endereço de e-mail,
              telefone e senha.
            </li>
            <li>
              <strong>Dados de Pagamento:</strong> Processados de forma segura
              por intermediadores de pagamento parceiros. Não armazenamos dados
              completos de cartão de crédito em nossos servidores.
            </li>
            <li>
              <strong>Dados de Uso:</strong> Informações sobre os maços e
              cartelas gerados para o correto funcionamento da aplicação.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Uso das Informações</h2>
          <p>Os dados coletados são utilizados exclusivamente para:</p>
          <ul>
            <li>Autenticar o acesso do usuário à sua conta.</li>
            <li>
              Gerenciar as assinaturas e limites dos planos (Gratuito, Básico e
              Completo).
            </li>
            <li>
              Enviar comunicações importantes sobre o serviço ou suporte
              técnico.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos, alugamos ou repassamos seus dados pessoais a terceiros
            para fins que não sejam o de gerenciar pagamento e assinatura do
            plano contratado.
          </p>
          <p>
            O único compartilhamento de dados que fazemos é com intermediadores
            de pagamento para processamento de pagamento e assinatura do plano
            contratado.
          </p>
        </section>

        <section>
          <h2>4. Armazenamento e Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para proteger
            seus dados contra acesso não autorizado, perda ou alteração.
          </p>
          <p>
            As senhas são armazenadas utilizando métodos de criptografia
            seguros.
          </p>
          <p>O acesso a sua conta só é autorizado por meio de autenticação.</p>
        </section>

        <section>
          <h2>5. Direitos do Usuário (LGPD)</h2>
          <p>
            Você tem o direito de solicitar o acesso, a correção ou a exclusão
            definitiva dos seus dados pessoais armazenados em nossa plataforma a
            qualquer momento, entrando em contato pelo e-mail de suporte.
          </p>
        </section>

        <section>
          <h2>6. Contato</h2>
          <p>
            Para dúvidas sobre esta Política de Privacidade ou solicitações
            relativas aos seus dados, entre em contato através do e-mail:
            <a href="mailto:suporte@alexsandrogomes.dev">
              suporte@alexsandrogomes.dev
            </a>
            .
          </p>
        </section>
      </article>
    </section>
  );
};

export default PrivacyPolicy;
