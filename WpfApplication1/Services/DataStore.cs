using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using MnlzJournal.Models;

namespace MnlzJournal.Services
{
    public static class DataStore
    {
        private static readonly string FolderPath =
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "MnlzJournal");

        private static readonly string FilePath = Path.Combine(FolderPath, "records.xml");

        public static List<SegmentTestRecord> Load()
        {
            try
            {
                if (!File.Exists(FilePath))
                    return new List<SegmentTestRecord>();
                var serializer = new XmlSerializer(typeof(List<SegmentTestRecord>));

                using (var fs = File.OpenRead(FilePath))
                {
                    return (List<SegmentTestRecord>)serializer.Deserialize(fs);
                }
            }
            catch
            {
                return new List<SegmentTestRecord>();
            }
        }

        public static void Save(List<SegmentTestRecord> records)
        {
            if (!Directory.Exists(FolderPath))
                Directory.CreateDirectory(FolderPath);
            var serializer = new XmlSerializer(typeof(List<SegmentTestRecord>));
            var settings = new XmlWriterSettings
            {
                Indent = true,
                IndentChars = " "
            };
            using (var writer = XmlWriter.Create(FilePath, settings))
            {
                serializer.Serialize(writer, records);
            }
        }

        public static int GetNextId(List<SegmentTestRecord> records)
        {
            int max = 0;
            foreach (var r in records)
                if (r.Id > max) max = r.Id;
            return max + 1;
        }
    }
}
