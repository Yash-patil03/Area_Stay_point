namespace PGFinder2.Models;
public class Review
{
    public int ReviewId { get; set; }
    public int UserId { get; set; }
    public int PGId { get; set; }
    public int Rating { get; set; } // 1–5
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

