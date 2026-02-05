using System.ComponentModel.DataAnnotations;

namespace PGFinder2.Models
{
    public class DiscountRequest
    {
        [Key]
        public int RequestId { get; set; }   // ✅ explicitly primary key

        public int UserId { get; set; }
        public int PGId { get; set; }

        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public int DiscountPercent { get; set; }

        public User? User { get; set; }
        public PG? PG { get; set; }
    }
}
