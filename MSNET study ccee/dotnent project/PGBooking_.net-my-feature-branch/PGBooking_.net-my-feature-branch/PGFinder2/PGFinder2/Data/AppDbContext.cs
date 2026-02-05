using Microsoft.EntityFrameworkCore;
using PGFinder2.Models;

namespace PGFinder2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<PG> PGs { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<DiscountRequest> DiscountRequests { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PGImage> PGImages { get; set; }
        public DbSet<PGVideo> PGVideos { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure cascade delete behavior to avoid cycles
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.PG)
                .WithMany()
                .HasForeignKey(b => b.PGId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne<PG>()
                .WithMany()
                .HasForeignKey(r => r.PGId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.PG)
                .WithMany()
                .HasForeignKey(r => r.PGId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PGImage>()
                .HasOne(i => i.PG)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.PGId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PGVideo>()
                .HasOne(v => v.PG)
                .WithMany(p => p.Videos)
                .HasForeignKey(v => v.PGId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithMany()
                .HasForeignKey(p => p.BookingId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Donation>()
                .HasOne(d => d.Donor)
                .WithMany()
                .HasForeignKey(d => d.DonorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision
            modelBuilder.Entity<Booking>()
                .Property(b => b.DiscountAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Booking>()
                .Property(b => b.FinalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PG>()
                .Property(p => p.Rent)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Donation>()
                .Property(d => d.Amount)
                .HasPrecision(18, 2);
        }
    }
}