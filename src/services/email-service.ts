import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false, // true para portas 465, false para outras
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordRecoveryEmail(to: string, name: string, recoveryLink: string): Promise<void> {
    const htmlContent = `
      <div style="background: #f5f5f5; margin: 0; padding: 20px 0;">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        ">
          <!-- Cabeçalho / Logo -->
          <div style="background-color: #4CAF50; text-align: center; padding: 20px;">
            <img
              src="https://divulgame.com.br/wp-content/uploads/2024/12/cropped-DIVULGAME-CULTURA-LOGO-250-X-100-103x33.png"
              alt="Divulgame"
              style="max-width: 180px;"
            />
          </div>

          <!-- Conteúdo Principal -->
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333; text-align: center; margin-top: 0;">
              Recuperação de Senha
            </h2>

            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Olá, <strong>${name}</strong>,
            </p>

            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Você solicitou a redefinição da sua senha para a plataforma <strong>Divulgame</strong>. 
              Para continuar, clique no botão abaixo:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a
                href="${recoveryLink}"
                style="
                  background-color: #4CAF50;
                  color: #ffffff;
                  padding: 12px 24px;
                  text-decoration: none;
                  font-weight: bold;
                  font-size: 16px;
                  border-radius: 5px;
                "
              >
                Redefinir Senha
              </a>
            </div>

            <p style="color: #999; font-size: 14px; line-height: 1.6; text-align: center;">
              Se você não solicitou essa redefinição, ignore este e-mail com segurança.
            </p>

            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Atenciosamente, <br />
              <strong>Equipe Divulgame</strong>
            </p>
          </div>

          <!-- Rodapé -->
          <div style="background-color: #f0f0f0; text-align: center; padding: 10px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2025 Divulgame. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "DIVULGAME - Recuperação de Senha",
      html: htmlContent,
    });
  }
}
