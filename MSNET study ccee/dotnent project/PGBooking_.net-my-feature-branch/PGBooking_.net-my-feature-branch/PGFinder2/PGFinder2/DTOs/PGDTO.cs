using System.ComponentModel.DataAnnotations;

namespace PGFinder2.DTOs
{
    public class CreatePGDTO
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rent is required")]
        [Range(1, 1000000, ErrorMessage = "Rent must be positive")]
        public decimal Rent { get; set; }

        [Required(ErrorMessage = "Gender allowed is required")]
        [RegularExpression(@"^(Male|Female|Both)$", ErrorMessage = "Gender allowed must be Male, Female, or Both")]
        public string GenderAllowed { get; set; } = string.Empty;

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        public double Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        public double Longitude { get; set; }

        [Required(ErrorMessage = "City is required")]
        [StringLength(50, ErrorMessage = "City cannot exceed 50 characters")]
        public string City { get; set; } = "Mumbai";

        [Required(ErrorMessage = "Area is required")]
        [StringLength(100, ErrorMessage = "Area cannot exceed 100 characters")]
        public string Area { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;

        [Range(0, 1000, ErrorMessage = "Capacity must be positive")]
        public int Capacity { get; set; }

        [Range(0, 1000, ErrorMessage = "Available slots must be positive")]
        public int AvailableSlots { get; set; }

        public List<string> Images { get; set; } = new List<string>();
        public List<string> Videos { get; set; } = new List<string>();
    }

    public class UpdatePGDTO : CreatePGDTO
    {
        public bool IsActive { get; set; } = true;
    }
}