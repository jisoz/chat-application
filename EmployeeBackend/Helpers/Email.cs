using EmployeeBackend.Models;
using System.Net;
using System.Net.Mail;

namespace EmployeeBackend.Helpers
{
    public class Email
    {

        private readonly string _emailUsername;
        private readonly string _emailPassword;

        public Email(IConfiguration configuration)
        {
            _emailUsername = configuration["Email:Username"];
            _emailPassword = configuration["Email:Password"];
        }


        public void SendEmail(ApplicationUser user, string token)
        {
            string fromMail = _emailUsername;
            string frompassword = _emailPassword;
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(fromMail);
            mailMessage.Subject = "Email Confirmation";
            mailMessage.To.Add(new MailAddress(user.Email));

            // Generate the confirmation link
            string confirmationLink = $"http://localhost:4200/confirm-email?userId={user.Id}&token={token}";

            // Set the email body with the confirmation link
            mailMessage.Body = $"<html><body><p>Please confirm your email address by clicking <a href='{confirmationLink}'>here</a>.</p></body></html>";
            mailMessage.IsBodyHtml = true;

            var smtpclient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, frompassword),
                EnableSsl = true,

            };

            smtpclient.Send(mailMessage);
        }


        public void SendEmailReset(ApplicationUser user, string token)
        {
            string fromMail = _emailUsername;
            string frompassword = _emailPassword;
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(fromMail);
            mailMessage.Subject = "Password Reset";
            mailMessage.To.Add(new MailAddress(user.Email));

            // Generate the confirmation link
            string confirmationLink = $"http://localhost:4200/confirm-passwordreset?userId={user.Id}&token={token}";

            // Set the email body with the confirmation link
            mailMessage.Body = $"<html><body><p>Reset Password: <a href='{confirmationLink}'>here</a>.</p></body></html>";
            mailMessage.IsBodyHtml = true;

            var smtpclient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, frompassword),
                EnableSsl = true,

            };

            smtpclient.Send(mailMessage);
        }


    }
}
