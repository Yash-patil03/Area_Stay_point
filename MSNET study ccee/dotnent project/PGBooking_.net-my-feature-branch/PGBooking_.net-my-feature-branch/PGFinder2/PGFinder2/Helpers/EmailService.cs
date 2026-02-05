namespace PGFinder2.Helpers;
using System.Net;
using System.Net.Mail;

public class EmailService
{
    public static void Send(string to, string subject, string body)
    {
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential("yourmail@gmail.com", "app-password"),
            EnableSsl = true
        };

        client.Send("yourmail@gmail.com", to, subject, body);
    }
}

