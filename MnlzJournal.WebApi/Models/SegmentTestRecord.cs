namespace MnlzJournal.WebApi.Models;

public class SegmentTestRecord
{
    public int Id { get; set; }
    public DateTime TestDate { get; set; }
    public string SegmentNumber { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Левая сторона — вход
    public decimal LeftInTop { get; set; }
    public decimal LeftInBottom { get; set; }

    // Левая сторона — выход
    public decimal LeftOutTop { get; set; }
    public decimal LeftOutBottom { get; set; }

    // Правая сторона — вход
    public decimal RightInTop { get; set; }
    public decimal RightInBottom { get; set; }

    // Правая сторона — выход
    public decimal RightOutTop { get; set; }
    public decimal RightOutBottom { get; set; }

    public string? Notes { get; set; }
}
