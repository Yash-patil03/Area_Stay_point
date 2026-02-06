namespace PGFinder2.Helpers;
using System.Net;
using System.Net.Mail;

public class EmailService
{
    public static void Send(string to, string subject, string body)
    {
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential("yp121313@gmail.com", "bgap bguc wfyc pmod"),
            EnableSsl = true
        };

        client.Send("yp121313@gmail.com", to, subject, body);
    }
}

