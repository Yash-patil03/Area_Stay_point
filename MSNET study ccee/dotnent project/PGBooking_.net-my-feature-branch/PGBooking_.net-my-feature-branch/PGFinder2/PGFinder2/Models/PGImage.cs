// Models/PGImage.cs
namespace PGFinder2.Models;
public class PGImage
{
    public int PGImageId { get; set; }
    public int PGId { get; set; }
    public PG? PG { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}


