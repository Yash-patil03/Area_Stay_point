namespace PGFinder2.Models;
public class Booking
{
    public int BookingId { get; set; }
    public int PGId { get; set; }
    public PG? PG { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public int? DonationId { get; set; }
    public Donation? Donation { get; set; }
}