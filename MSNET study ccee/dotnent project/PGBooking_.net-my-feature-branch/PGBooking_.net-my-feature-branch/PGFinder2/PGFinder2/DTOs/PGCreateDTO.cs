using System.ComponentModel.DataAnnotations;

namespace PGFinder2.DTOs
{
    public class PGCreateDTO
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s\-]{3,100}$")]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1000, 100000, ErrorMessage = "Rent must be between 1000 and 100000")]
        public decimal Rent { get; set; }

        [Required]
        [RegularExpression(@"^(Male|Female|Both)$")]
        public string GenderAllowed { get; set; } = string.Empty;

        [Required]
        [Range(-90, 90)]
        public double Latitude { get; set; }

        [Required]
        [Range(-180, 180)]
        public double Longitude { get; set; }

        public string City { get; set; } = "Mumbai";
        public string Area { get; set; } = string.Empty;

        [Required]
        [Range(1, 100)]
        public int Capacity { get; set; }

        [Required]
        [Range(0, 100)]
        public int AvailableSlots { get; set; }
    }
}