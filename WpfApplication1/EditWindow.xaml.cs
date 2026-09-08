using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using MnlzJournal.Models;

namespace MnlzJournal
{
    public partial class EditWindow : Window
    {
        private readonly SegmentTestRecord _record;
        private readonly bool _isNew;

        public EditWindow(SegmentTestRecord record, bool isNew)
        {
            InitializeComponent();
            _record = record;
            _isNew = isNew;
            Title = isNew ? "Новая запись" : "Редактирование записи";

            DpDate.SelectedDate = record.TestDate;
            TxtSegment.Text = record.SegmentNumber ?? "";
            TxtLastName.Text = record.LastName ?? "";

            TxtLeftInTop.Text = record.LeftInTop != 0 ? record.LeftInTop.ToString() : "";
            TxtLeftInBottom.Text = record.LeftInBottom != 0 ? record.LeftInBottom.ToString() : "";
            TxtRightInTop.Text = record.RightInTop != 0 ? record.RightInTop.ToString() : "";
            TxtRightInBottom.Text = record.RightInBottom != 0 ? record.RightInBottom.ToString() : "";
            TxtLeftOutTop.Text = record.LeftOutTop != 0 ? record.LeftOutTop.ToString() : "";
            TxtLeftOutBottom.Text = record.LeftOutBottom != 0 ? record.LeftOutBottom.ToString() : "";
            TxtRightOutTop.Text = record.RightOutTop != 0 ? record.RightOutTop.ToString() : "";
            TxtRightOutBottom.Text = record.RightOutBottom != 0 ? record.RightOutBottom.ToString() : "";

            TxtNotes.Text = record.Notes ?? "";

            // Логика дельт временно отключена
            /*
            TxtLeftInTop.TextChanged += UpdateDeltas;
            TxtLeftInBottom.TextChanged += UpdateDeltas;
            TxtRightInTop.TextChanged += UpdateDeltas;
            TxtRightInBottom.TextChanged += UpdateDeltas;
            TxtLeftOutTop.TextChanged += UpdateDeltas;
            TxtLeftOutBottom.TextChanged += UpdateDeltas;
            TxtRightOutTop.TextChanged += UpdateDeltas;
            TxtRightOutBottom.TextChanged += UpdateDeltas;
            UpdateDeltas(null, null);
            */
        }

        /*
        private void UpdateDeltas(object sender, TextChangedEventArgs e)
        {
            decimal lit, lib, rit, rib, lot, lob, rot, rob;
            if (TryParse(TxtLeftInTop, out lit) && TryParse(TxtRightInTop, out rit))
                TxtDeltaInTop.Text = string.Format("Δ Верх: {0:F3} мм", Math.Abs(lit - rit));
            else
                TxtDeltaInTop.Text = "Δ Верх: —";

            if (TryParse(TxtLeftInBottom, out lib) && TryParse(TxtRightInBottom, out rib))
                TxtDeltaInBottom.Text = string.Format("Δ Низ:  {0:F3} мм", Math.Abs(lib - rib));
            else
                TxtDeltaInBottom.Text = "Δ Низ:  —";

            if (TryParse(TxtLeftOutTop, out lot) && TryParse(TxtRightOutTop, out rot))
                TxtDeltaOutTop.Text = string.Format("Δ Верх: {0:F3} мм", Math.Abs(lot - rot));
            else
                TxtDeltaOutTop.Text = "Δ Верх: —";

            if (TryParse(TxtLeftOutBottom, out lob) && TryParse(TxtRightOutBottom, out rob))
                TxtDeltaOutBottom.Text = string.Format("Δ Низ:  {0:F3} мм", Math.Abs(lob - rob));
            else
                TxtDeltaOutBottom.Text = "Δ Низ:  —";
        }
        */

        private static bool TryParse(TextBox tb, out decimal value)
        {
            value = 0;
            string s = (tb.Text ?? "").Trim();
            if (string.IsNullOrEmpty(s)) return false;
            s = s.Replace(',', '.');
            return decimal.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out value);
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(TxtSegment.Text))
            {
                MessageBox.Show("Укажите номер сегмента.", "Проверка", MessageBoxButton.OK, MessageBoxImage.Warning);
                TxtSegment.Focus();
                return;
            }
            if (string.IsNullOrWhiteSpace(TxtLastName.Text))
            {
                MessageBox.Show("Укажите ФИО сотрудника.", "Проверка", MessageBoxButton.OK, MessageBoxImage.Warning);
                TxtLastName.Focus();
                return;
            }

            decimal lit, lib, rit, rib, lot, lob, rot, rob;
            if (!TryParse(TxtLeftInTop, out lit)) { Warn(TxtLeftInTop, "Левая — Вход — Верхнее"); return; }
            if (!TryParse(TxtLeftInBottom, out lib)) { Warn(TxtLeftInBottom, "Левая — Вход — Нижнее"); return; }
            if (!TryParse(TxtRightInTop, out rit)) { Warn(TxtRightInTop, "Правая — Вход — Верхнее"); return; }
            if (!TryParse(TxtRightInBottom, out rib)) { Warn(TxtRightInBottom, "Правая — Вход — Нижнее"); return; }
            if (!TryParse(TxtLeftOutTop, out lot)) { Warn(TxtLeftOutTop, "Левая — Выход — Верхнее"); return; }
            if (!TryParse(TxtLeftOutBottom, out lob)) { Warn(TxtLeftOutBottom, "Левая — Выход — Нижнее"); return; }
            if (!TryParse(TxtRightOutTop, out rot)) { Warn(TxtRightOutTop, "Правая — Выход — Верхнее"); return; }
            if (!TryParse(TxtRightOutBottom, out rob)) { Warn(TxtRightOutBottom, "Правая — Выход — Нижнее"); return; }

            _record.TestDate = DpDate.SelectedDate ?? DateTime.Now;
            _record.SegmentNumber = TxtSegment.Text.Trim();
            _record.LastName = TxtLastName.Text.Trim();
            _record.LeftInTop = lit;
            _record.LeftInBottom = lib;
            _record.RightInTop = rit;
            _record.RightInBottom = rib;
            _record.LeftOutTop = lot;
            _record.LeftOutBottom = lob;
            _record.RightOutTop = rot;
            _record.RightOutBottom = rob;
            _record.Notes = string.IsNullOrWhiteSpace(TxtNotes.Text) ? null : TxtNotes.Text.Trim();

            DialogResult = true;
            Close();
        }

        private void Warn(TextBox tb, string fieldName)
        {
            MessageBox.Show(string.Format("Некорректное значение: {0}", fieldName), "Проверка", MessageBoxButton.OK, MessageBoxImage.Warning);
            tb.Focus();
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}