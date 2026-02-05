using System.ComponentModel.DataAnnotations;

namespace PGFinder2.DTOs
{
    public class CreateReviewDTO
    {
        [Required(ErrorMessage = "PG ID is required")]
        public int PGId { get; set; }

        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [Required(ErrorMessage = "Comment is required")]
        [StringLength(500, ErrorMessage = "Comment cannot exceed 500 characters")]
        public string Comment { get; set; } = string.Empty;
    }
}