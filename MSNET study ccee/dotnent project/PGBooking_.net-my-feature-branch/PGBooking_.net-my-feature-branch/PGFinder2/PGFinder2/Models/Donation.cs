
// Models/Donation.cs - Update
namespace PGFinder2.Models;
public class Donation
{
    public int DonationId { get; set; }
    public int DonorId { get; set; }
    public User? Donor { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Used
    public DateTime DonationDate { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedDate { get; set; }
    public int? ApprovedByAdminId { get; set; }
    public User? ApprovedByAdmin { get; set; }
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}