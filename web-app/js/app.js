// Приложение журнала тестирования сегментов МНЛЗ

class MnlzJournalApp {
    constructor() {
        this.records = [];
        this.filteredRecords = [];
        this.selectedRow = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.bindEvents();
        this.render();
    }
    
    // Загрузка данных из localStorage
    loadData() {
        const stored = localStorage.getItem('mnlzRecords');
        if (stored) {
            this.records = JSON.parse(stored);
        } else {
            // Пример данных для демонстрации
            this.records = [
                {
                    id: 1,
                    testDate: '2024-01-15',
                    segmentNumber: 'С-001',
                    lastName: 'Иванов И.И.',
                    leftInTop: 10.523,
                    leftInBottom: 10.518,
                    leftOutTop: 10.521,
                    leftOutBottom: 10.519,
                    rightInTop: 10.525,
                    rightInBottom: 10.520,
                    rightOutTop: 10.522,
                    rightOutBottom: 10.518,
                    notes: 'Плановое тестирование'
                },
                {
                    id: 2,
                    testDate: '2024-01-16',
                    segmentNumber: 'С-002',
                    lastName: 'Петров П.П.',
                    leftInTop: 10.530,
                    leftInBottom: 10.525,
                    leftOutTop: 10.528,
                    leftOutBottom: 10.526,
                    rightInTop: 10.532,
                    rightInBottom: 10.527,
                    rightOutTop: 10.529,
                    rightOutBottom: 10.525,
                    notes: ''
                },
                {
                    id: 3,
                    testDate: '2024-01-17',
                    segmentNumber: 'С-003',
                    lastName: 'Сидоров С.С.',
                    leftInTop: 10.515,
                    leftInBottom: 10.512,
                    leftOutTop: 10.514,
                    leftOutBottom: 10.513,
                    rightInTop: 10.517,
                    rightInBottom: 10.514,
                    rightOutTop: 10.516,
                    rightOutBottom: 10.512,
                    notes: 'Требуется повторная проверка'
                }
            ];
            this.saveData();
        }
        
        this.filteredRecords = [...this.records];
    }
    
    // Сохранение данных в localStorage
    saveData() {
        localStorage.setItem('mnlzRecords', JSON.stringify(this.records));
    }
    
    // Привязка событий
    bindEvents() {
        // Поиск
        document.getElementById('searchBox').addEventListener('input', (e) => {
            this.applyFilter(e.target.value);
        });
        
        // Кнопки
        document.getElementById('addBtn').addEventListener('click', () => this.addRecord());
        document.getElementById('editBtn').addEventListener('click', () => this.editRecord());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteRecord());
        
        // Вкладки
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Модальное окно
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveRecord());
        document.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    // Переключение вкладок
    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
    }
    
    // Применение фильтра поиска
    applyFilter(query) {
        query = query.trim().toLowerCase();
        
        if (!query) {
            this.filteredRecords = [...this.records];
        } else {
            this.filteredRecords = this.records.filter(record => {
                return (record.segmentNumber && record.segmentNumber.toLowerCase().includes(query)) ||
                       (record.lastName && record.lastName.toLowerCase().includes(query)) ||
                       (record.notes && record.notes.toLowerCase().includes(query));
            });
        }
        
        this.render();
    }
    
    // Рендеринг таблицы
    render() {
        const tbody = document.getElementById('gridBody');
        tbody.innerHTML = '';
        
        this.filteredRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.dataset.id = record.id;
            
            if (this.selectedRow === record.id) {
                tr.classList.add('selected');
            }
            
            tr.addEventListener('click', () => this.selectRow(record.id));
            
            tr.innerHTML = `
                <td>${record.id}</td>
                <td>${this.formatDate(record.testDate)}</td>
                <td>${record.segmentNumber || ''}</td>
                <td>${record.lastName || ''}</td>
                <td>${this.formatNumber(record.leftInTop)}</td>
                <td>${this.formatNumber(record.leftInBottom)}</td>
                <td>${this.formatNumber(record.leftOutTop)}</td>
                <td>${this.formatNumber(record.leftOutBottom)}</td>
                <td>${this.formatNumber(record.rightInTop)}</td>
                <td>${this.formatNumber(record.rightInBottom)}</td>
                <td>${this.formatNumber(record.rightOutTop)}</td>
                <td>${this.formatNumber(record.rightOutBottom)}</td>
                <td>${record.notes || ''}</td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Обновление статус-бара
        document.getElementById('recordCount').textContent = `Всего записей: ${this.filteredRecords.length}`;
        
        if (this.filteredRecords.length === 0) {
            document.getElementById('statusText').textContent = 'Нет записей';
        } else {
            document.getElementById('statusText').textContent = 
                `Отображено ${this.filteredRecords.length} из ${this.records.length}`;
        }
    }
    
    // Выбор строки
    selectRow(id) {
        this.selectedRow = id;
        this.render();
    }
    
    // Форматирование даты
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Форматирование числа
    formatNumber(num) {
        if (num === undefined || num === null || num === '') return '';
        return parseFloat(num).toFixed(3);
    }
    
    // Добавление записи
    addRecord() {
        const nextId = this.records.length > 0 
            ? Math.max(...this.records.map(r => r.id)) + 1 
            : 1;
        
        const newRecord = {
            id: nextId,
            testDate: new Date().toISOString().split('T')[0],
            segmentNumber: '',
            lastName: '',
            leftInTop: 0,
            leftInBottom: 0,
            leftOutTop: 0,
            leftOutBottom: 0,
            rightInTop: 0,
            rightInBottom: 0,
            rightOutTop: 0,
            rightOutBottom: 0,
            notes: ''
        };
        
        this.openModal(newRecord, true);
    }
    
    // Редактирование записи
    editRecord() {
        if (!this.selectedRow) {
            alert('Выберите запись для редактирования.');
            return;
        }
        
        const record = this.records.find(r => r.id === this.selectedRow);
        if (record) {
            this.openModal(record, false);
        }
    }
    
    // Удаление записи
    deleteRecord() {
        if (!this.selectedRow) {
            alert('Выберите запись для удаления.');
            return;
        }
        
        const record = this.records.find(r => r.id === this.selectedRow);
        if (!record) return;
        
        if (confirm(`Удалить запись №${record.id} (сегмент ${record.segmentNumber})?`)) {
            this.records = this.records.filter(r => r.id !== this.selectedRow);
            this.saveData();
            this.applyFilter(document.getElementById('searchBox').value);
            this.selectedRow = null;
            this.showStatus('Запись удалена');
        }
    }
    
    // Открытие модального окна
    openModal(record, isNew) {
        const modal = document.getElementById('editModal');
        const title = document.getElementById('modalTitle');
        
        title.textContent = isNew ? 'Новая запись' : 'Редактирование записи';
        
        // Заполнение формы
        document.getElementById('editId').value = record.id;
        document.getElementById('editDate').value = record.testDate || '';
        document.getElementById('editSegment').value = record.segmentNumber || '';
        document.getElementById('editLastName').value = record.lastName || '';
        
        document.getElementById('editLeftInTop').value = record.leftInTop !== 0 ? record.leftInTop : '';
        document.getElementById('editLeftInBottom').value = record.leftInBottom !== 0 ? record.leftInBottom : '';
        document.getElementById('editLeftOutTop').value = record.leftOutTop !== 0 ? record.leftOutTop : '';
        document.getElementById('editLeftOutBottom').value = record.leftOutBottom !== 0 ? record.leftOutBottom : '';
        document.getElementById('editRightInTop').value = record.rightInTop !== 0 ? record.rightInTop : '';
        document.getElementById('editRightInBottom').value = record.rightInBottom !== 0 ? record.rightInBottom : '';
        document.getElementById('editRightOutTop').value = record.rightOutTop !== 0 ? record.rightOutTop : '';
        document.getElementById('editRightOutBottom').value = record.rightOutBottom !== 0 ? record.rightOutBottom : '';
        
        document.getElementById('editNotes').value = record.notes || '';
        
        modal.classList.add('active');
        
        // Фокус на первом поле
        if (isNew) {
            document.getElementById('editSegment').focus();
        }
    }
    
    // Закрытие модального окна
    closeModal() {
        document.getElementById('editModal').classList.remove('active');
    }
    
    // Сохранение записи
    saveRecord() {
        const id = parseInt(document.getElementById('editId').value);
        const segment = document.getElementById('editSegment').value.trim();
        const lastName = document.getElementById('editLastName').value.trim();
        
        // Валидация формата сегмента (X.X или X.X.X)
        const segmentPattern = /^\d+\.\d+(\.\d+)?$/;
        if (!segment) {
            alert('Укажите номер сегмента.');
            document.getElementById('editSegment').focus();
            return;
        }
        
        if (!segmentPattern.test(segment)) {
            alert('Номер сегмента должен быть в формате X.X или X.X.X');
            document.getElementById('editSegment').focus();
            return;
        }
        
        if (!lastName) {
            alert('Укажите ФИО сотрудника.');
            document.getElementById('editLastName').focus();
            return;
        }
        
        // Получение значений полей
        const getDecimal = (elementId) => {
            const value = document.getElementById(elementId).value.trim();
            if (!value) return 0;
            const num = parseFloat(value.replace(',', '.'));
            if (isNaN(num)) {
                throw new Error(`Некорректное значение в поле ${elementId}`);
            }
            return num;
        };
        
        try {
            const recordData = {
                id: id,
                testDate: document.getElementById('editDate').value,
                segmentNumber: segment,
                lastName: lastName,
                leftInTop: getDecimal('editLeftInTop'),
                leftInBottom: getDecimal('editLeftInBottom'),
                leftOutTop: getDecimal('editLeftOutTop'),
                leftOutBottom: getDecimal('editLeftOutBottom'),
                rightInTop: getDecimal('editRightInTop'),
                rightInBottom: getDecimal('editRightInBottom'),
                rightOutTop: getDecimal('editRightOutTop'),
                rightOutBottom: getDecimal('editRightOutBottom'),
                notes: document.getElementById('editNotes').value.trim() || null
            };
            
            // Проверка существования записи
            const existingIndex = this.records.findIndex(r => r.id === id);
            
            if (existingIndex >= 0) {
                // Обновление существующей записи
                this.records[existingIndex] = recordData;
            } else {
                // Добавление новой записи
                this.records.push(recordData);
            }
            
            // Сортировка по дате
            this.records.sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
            
            this.saveData();
            this.applyFilter(document.getElementById('searchBox').value);
            this.closeModal();
            
            this.showStatus(existingIndex >= 0 ? 'Запись обновлена' : 'Запись добавлена');
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    // Показ статуса
    showStatus(message) {
        const statusEl = document.getElementById('statusText');
        statusEl.textContent = message;
        
        // Очистка через 3 секунды
        setTimeout(() => {
            if (statusEl.textContent === message) {
                statusEl.textContent = '';
            }
        }, 3000);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MnlzJournalApp();
});
