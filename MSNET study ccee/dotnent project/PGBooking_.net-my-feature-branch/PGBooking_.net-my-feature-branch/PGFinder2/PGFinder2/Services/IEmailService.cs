
using System.Threading.Tasks;

namespace PGFinder2.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }
}
