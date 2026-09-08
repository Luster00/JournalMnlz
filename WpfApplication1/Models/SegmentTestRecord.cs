using System;
using System.Xml.Serialization;

namespace MnlzJournal.Models
{
    public class SegmentTestRecord
    {
        [XmlAttribute("Id")]
        public int Id { get; set; }

        public DateTime TestDate { get; set; }
        public string SegmentNumber { get; set; }
        public string LastName { get; set; }

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

        public string Notes { get; set; }

        // Дельты: левая vs правая, по точкам и положениям
        [XmlIgnore]
        public decimal DeltaInTop { get { return Math.Abs(LeftInTop - RightInTop); } }

        [XmlIgnore]
        public decimal DeltaInBottom { get { return Math.Abs(LeftInBottom - RightInBottom); } }

        [XmlIgnore]
        public decimal DeltaOutTop { get { return Math.Abs(LeftOutTop - RightOutTop); } }

        [XmlIgnore]
        public decimal DeltaOutBottom { get { return Math.Abs(LeftOutBottom - RightOutBottom); } }
    }
}

