const nodemailer = require("nodemailer");
const { mailing, jwtSecret } = require("../config/config");
const { usersService } = require("../repositories");
const jwt = require("jsonwebtoken");

const transport = nodemailer.createTransport({
  service: mailing.service,
  port: mailing.port,
  auth: mailing.auth,
});

class MailingService {
  async sendRegistrationMail(destinationEmail) {
    try {
      await transport.sendMail({
        from: `Virtual Store <${mailing.auth.user}>`,
        to: destinationEmail,
        subject: `Mensaje de bienvenida a Virtual Store`,
        html: `
            <h1>¡Ahora eres uno de nosotros!</h1>
            <p>Estamos felices de contar contigo, te damos la bienvenida a Virtual Store, tu tienda favorita.</p>
        `,
      });

      console.log(`mail sent succesfully`);
    } catch (error) {
      console.log(error.message);
    }
  }

  async sendPurchaseMail(destinationEmail, ticketCode = "123456") {
    try {
      await transport.sendMail({
        from: `Virtual Store <${mailing.auth.user}>`,
        to: destinationEmail,
        subject: `Confirmación de compra - Ticket ${ticketCode}`,
        html: `
            <h1>¡Pronto recibirás tus productos!</h1>
            <p>La compra indicada en el ticket ${ticketCode} fue realizada con éxito.</p>
            <p>Disfruta de tus productos. Recuerda visitarnos de nuevo, estaremos felices de recibirte.</p>
        `,
      });

      console.log(`mail sent succesfully`);
    } catch (error) {
      console.log(error.message);
    }
  }

  async sendPasswordResetMail(user, destinationEmail) {
    try {
      const passwordResetToken = jwt.sign(user, jwtSecret, { expiresIn: "1h" });

      await transport.sendMail({
        from: `Virtual Store <${mailing.auth.user}>`,
        to: destinationEmail,
        subject: `Cambio de contraseña`,
        html: `
            <div>
              <h1>Dale clic al enlace para cambiar tu contraseña</h1>
              <a href="http://localhost:8080/api/sessions/validateToken/${passwordResetToken}">Cambiar contraseña</a>
              <br />
              <p>Si no fuiste tú quién solicitó el cambio, haz caso omiso a este correo.</p>
            </div>
        `,
      });

      console.log(`mail sent succesfully`);
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = MailingService;
