using Microsoft.AspNetCore.Mvc;
using PGFinder2.Data;
using PGFinder2.Models;

namespace PGFinder2.Controllers;
[ApiController]
[Route("api/donations")]
public class DonationController : ControllerBase
{
    private readonly AppDbContext _context;

    public DonationController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Donate(Donation donation)
    {
        _context.Donations.Add(donation);
        _context.SaveChanges();
        return Ok("Thank you for donating!");
    }
}

