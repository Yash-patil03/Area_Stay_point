namespace PGFinder2.Models;
public class PG
{
    public int PGId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Rent { get; set; }
    public string GenderAllowed { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string City { get; set; } = "Mumbai";
    public string Area { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public int TotalRooms { get; set; }
    public int AvailableRooms { get; set; }
    public string PGType { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Additional properties that might be expected
    public int Capacity { get; set; }
    public int AvailableSlots { get; set; }

    // Navigation properties
    public int OwnerId { get; set; }
    public User? Owner { get; set; }
    public ICollection<PGImage> Images { get; set; } = new List<PGImage>();
    public ICollection<PGVideo> Videos { get; set; } = new List<PGVideo>();
}