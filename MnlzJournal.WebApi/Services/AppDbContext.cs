using Microsoft.EntityFrameworkCore;
using MnlzJournal.WebApi.Models;

namespace MnlzJournal.WebApi.Services;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<SegmentTestRecord> SegmentTestRecords => Set<SegmentTestRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SegmentTestRecord>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SegmentNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.TestDate).IsRequired();
        });
    }
}
