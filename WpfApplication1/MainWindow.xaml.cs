using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using MnlzJournal.Models;
using MnlzJournal.Services;

namespace MnlzJournal
{
    public partial class MainWindow : Window
    {
        private List<SegmentTestRecord> _allRecords;
        private List<SegmentTestRecord> _filteredRecords;

        public MainWindow()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            _allRecords = DataStore.Load();
            ApplyFilter();
        }

        private void ApplyFilter()
        {
            string q = SearchBox.Text == (string)SearchBox.Tag ? "" : (SearchBox.Text ?? "");

            if (string.IsNullOrWhiteSpace(q))
            {
                _filteredRecords = _allRecords.ToList();
            }
            else
            {
                q = q.Trim().ToLower();
                _filteredRecords = _allRecords
                    .Where(r =>
                        (r.SegmentNumber != null && r.SegmentNumber.ToLower().Contains(q)) ||
                        (r.LastName != null && r.LastName.ToLower().Contains(q)) ||
                        (r.Notes != null && r.Notes.ToLower().Contains(q)))
                    .ToList();
            }

            MainGrid.ItemsSource = null;
            MainGrid.ItemsSource = _filteredRecords;
            RecordCountText.Text = string.Format("Всего записей: {0}", _filteredRecords.Count);
            StatusText.Text = _filteredRecords.Count == 0
                ? "Нет записей"
                : string.Format("Отображено {0} из {1}", _filteredRecords.Count, _allRecords.Count);
        }

        private void AddButton_Click(object sender, RoutedEventArgs e)
        {
            var newRecord = new SegmentTestRecord
            {
                TestDate = DateTime.Now,
                Id = DataStore.GetNextId(_allRecords)
            };

            var editWin = new EditWindow(newRecord, true);
            editWin.Owner = this;

            if (editWin.ShowDialog() == true)
            {
                _allRecords.Add(newRecord);
                _allRecords = _allRecords.OrderBy(r => r.TestDate).ToList();
                DataStore.Save(_allRecords);
                ApplyFilter();
                StatusText.Text = "Запись добавлена";
            }
        }

        private void EditButton_Click(object sender, RoutedEventArgs e)
        {
            var record = MainGrid.SelectedItem as SegmentTestRecord;
            if (record == null)
            {
                MessageBox.Show("Выберите запись для редактирования.",
                    "Внимание", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            var editWin = new EditWindow(record, false);
            editWin.Owner = this;

            if (editWin.ShowDialog() == true)
            {
                DataStore.Save(_allRecords);
                ApplyFilter();
                StatusText.Text = "Запись обновлена";
            }
        }

        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            var record = MainGrid.SelectedItem as SegmentTestRecord;
            if (record == null)
            {
                MessageBox.Show("Выберите запись для удаления.",
                    "Внимание", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            var result = MessageBox.Show(
                string.Format("Удалить запись №{0} (сегмент {1})?",
                    record.Id, record.SegmentNumber),
                "Подтверждение",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                _allRecords.Remove(record);
                DataStore.Save(_allRecords);
                ApplyFilter();
                StatusText.Text = "Запись удалена";
            }
        }

        private void SearchBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (!string.IsNullOrEmpty(SearchBox.Text) && SearchBox.Text != (string)SearchBox.Tag)
                ApplyFilter();
        }

        private void SearchBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (SearchBox.Text == (string)SearchBox.Tag)
                SearchBox.Text = "";
        }

        private void SearchBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(SearchBox.Text))
                SearchBox.Text = (string)SearchBox.Tag;
            else
                ApplyFilter();
        }
    }
}

