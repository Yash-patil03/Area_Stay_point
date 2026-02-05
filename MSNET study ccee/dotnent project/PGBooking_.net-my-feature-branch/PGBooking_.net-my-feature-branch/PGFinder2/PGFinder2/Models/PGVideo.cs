// Models/PGVideo.cs
namespace PGFinder2.Models;
public class PGVideo
{
    public int PGVideoId { get; set; }
    public int PGId { get; set; }
    public PG? PG { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
