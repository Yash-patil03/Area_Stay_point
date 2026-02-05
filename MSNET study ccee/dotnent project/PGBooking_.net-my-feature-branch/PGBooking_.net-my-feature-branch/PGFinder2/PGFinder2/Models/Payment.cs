namespace PGFinder2.Models;
//namespace PGFinder.API.Models;

public class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }
    public Booking? Booking { get; set; }

    public decimal Amount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
}
