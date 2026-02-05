using Microsoft.EntityFrameworkCore;
using PGFinder2.Data;
using PGFinder2.Models;

namespace PGFinder2.Services
{
    public class DataSeeder
    {
        private readonly AppDbContext _context;

        public DataSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Seed Roles
            if (!await _context.Roles.AnyAsync())
            {
                var roles = new[]
                {
                    new Role { RoleName = "User" },
                    new Role { RoleName = "Owner" },
                    new Role { RoleName = "Admin" }
                };

                _context.Roles.AddRange(roles);
                await _context.SaveChangesAsync();
            }

            // Seed Admin User
            if (!await _context.Users.AnyAsync(u => u.Email == "admin@pgfinder.com"))
            {
                var adminRole = await _context.Roles.FirstAsync(r => r.RoleName == "Admin");
                var adminUser = new User
                {
                    FullName = "Admin User",
                    Email = "admin@pgfinder.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Phone = "9876543210",
                    RoleId = adminRole.RoleId
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();
            }

            // Seed Sample Owner
            if (!await _context.Users.AnyAsync(u => u.Email == "owner@pgfinder.com"))
            {
                var ownerRole = await _context.Roles.FirstAsync(r => r.RoleName == "Owner");
                var ownerUser = new User
                {
                    FullName = "PG Owner",
                    Email = "owner@pgfinder.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Owner@123"),
                    Phone = "9876543211",
                    RoleId = ownerRole.RoleId
                };

                _context.Users.Add(ownerUser);
                await _context.SaveChangesAsync();
            }

            // Seed Sample PGs
            if (!await _context.PGs.AnyAsync())
            {
                var owner = await _context.Users.FirstAsync(u => u.Email == "owner@pgfinder.com");
                var samplePGs = new[]
                {
                    new PG
                    {
                        Name = "Sunrise PG",
                        Address = "123 MG Road, Andheri East",
                        City = "Mumbai",
                        State = "Maharashtra",
                        Pincode = "400069",
                        Rent = 8000,
                        TotalRooms = 20,
                        AvailableRooms = 5,
                        PGType = "Single",
                        Gender = "Male",
                        Description = "Well-furnished PG with all modern amenities",
                        CreatedAt = DateTime.UtcNow,
                        GenderAllowed = "Male",
                        Latitude = 19.1136,
                        Longitude = 72.8697,
                        Area = "Andheri East",
                        IsActive = true,
                        OwnerId = owner.UserId
                    },
                    new PG
                    {
                        Name = "Green Valley PG",
                        Address = "456 Brigade Road, Bandra West",
                        City = "Mumbai",
                        State = "Maharashtra",
                        Pincode = "400050",
                        Rent = 12000,
                        TotalRooms = 15,
                        AvailableRooms = 3,
                        PGType = "Double",
                        Gender = "Female",
                        Description = "Safe and secure PG for working women",
                        CreatedAt = DateTime.UtcNow,
                        GenderAllowed = "Female",
                        Latitude = 19.0596,
                        Longitude = 72.8295,
                        Area = "Bandra West",
                        IsActive = true,
                        OwnerId = owner.UserId
                    },
                    new PG
                    {
                        Name = "City Center PG",
                        Address = "789 Commercial Street, Powai",
                        City = "Mumbai",
                        State = "Maharashtra",
                        Pincode = "400076",
                        Rent = 10000,
                        TotalRooms = 25,
                        AvailableRooms = 8,
                        PGType = "Triple",
                        Gender = "Both",
                        Description = "Affordable PG near IT parks and colleges",
                        CreatedAt = DateTime.UtcNow,
                        GenderAllowed = "Both",
                        Latitude = 19.1197,
                        Longitude = 72.9081,
                        Area = "Powai",
                        IsActive = true,
                        OwnerId = owner.UserId
                    },
                    new PG
                    {
                        Name = "Royal Residency PG",
                        Address = "321 Link Road, Malad West",
                        City = "Mumbai",
                        State = "Maharashtra",
                        Pincode = "400064",
                        Rent = 9000,
                        TotalRooms = 18,
                        AvailableRooms = 6,
                        PGType = "Single",
                        Gender = "Male",
                        Description = "Premium PG with AC rooms and WiFi",
                        CreatedAt = DateTime.UtcNow,
                        GenderAllowed = "Male",
                        Latitude = 19.1864,
                        Longitude = 72.8493,
                        Area = "Malad West",
                        IsActive = true,
                        OwnerId = owner.UserId
                    },
                    new PG
                    {
                        Name = "Comfort Zone PG",
                        Address = "654 SV Road, Borivali East",
                        City = "Mumbai",
                        State = "Maharashtra",
                        Pincode = "400066",
                        Rent = 7500,
                        TotalRooms = 22,
                        AvailableRooms = 10,
                        PGType = "Double",
                        Gender = "Female",
                        Description = "Budget-friendly PG with home-like environment",
                        CreatedAt = DateTime.UtcNow,
                        GenderAllowed = "Female",
                        Latitude = 19.2307,
                        Longitude = 72.8567,
                        Area = "Borivali East",
                        IsActive = true,
                        OwnerId = owner.UserId
                    }
                };

                _context.PGs.AddRange(samplePGs);
                await _context.SaveChangesAsync();
            }
        }
    }
}