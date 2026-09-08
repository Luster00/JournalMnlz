// Интерфейс для записи журнала
interface MnlzRecord {
    id: number;
    testDate: string;
    segmentNumber: string;
    lastName: string;
    leftInTop: number;
    leftInBottom: number;
    leftOutTop: number;
    leftOutBottom: number;
    rightInTop: number;
    rightInBottom: number;
    rightOutTop: number;
    rightOutBottom: number;
    notes: string | null;
}

// Приложение журнала тестирования сегментов МНЛЗ
class MnlzJournalApp {
    private records: MnlzRecord[];
    private filteredRecords: MnlzRecord[];
    private selectedRow: number | null;

    constructor() {
        this.records = [];
        this.filteredRecords = [];
        this.selectedRow = null;
        
        this.init();
    }
    
    private init(): void {
        this.loadTheme();
        this.loadData();
        this.bindEvents();
        this.render();
    }
    
    // Загрузка данных из localStorage
    private loadData(): void {
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
    private saveData(): void {
        localStorage.setItem('mnlzRecords', JSON.stringify(this.records));
    }
    
    // Привязка событий
    private bindEvents(): void {
        // Поиск
        const searchBox = document.getElementById('searchBox') as HTMLInputElement;
        if (searchBox) {
            searchBox.addEventListener('input', (e: Event) => {
                const target = e.target as HTMLInputElement;
                this.applyFilter(target.value);
            });
        }
        
        // Переключатель темы
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Кнопки
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addRecord());
        }
        
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteRecord());
        }
        
        // Вкладки
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                const tabName = target.dataset.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
        
        // Модальное окно
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveRecord());
        }
        
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    // Переключение темы
    private toggleTheme(): void {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Загрузка сохранённой темы
    private loadTheme(): void {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
    
    // Переключение вкладок
    private switchTab(tabName: string): void {
        document.querySelectorAll('.tab').forEach(tab => {
            const tabEl = tab as HTMLElement;
            tabEl.classList.toggle('active', tabEl.dataset.tab === tabName);
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            const contentEl = content as HTMLElement;
            contentEl.classList.toggle('active', contentEl.id === tabName + 'Tab');
        });
    }
    
    // Применение фильтра поиска
    private applyFilter(query: string): void {
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
    private render(): void {
        const tbody = document.getElementById('gridBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.filteredRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.dataset.id = record.id.toString();
            
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
                <td>
                    <span class="notes-preview">${record.notes || '—'}</span>
                    <button class="edit-btn-inline" title="Редактировать запись" data-id="${record.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Добавляем обработчики на кнопки редактирования в строках
        tbody.querySelectorAll('.edit-btn-inline').forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                e.stopPropagation(); // Чтобы не срабатывал клик по строке
                const target = btn as HTMLElement;
                const id = parseInt(target.dataset.id || '0');
                if (id) {
                    this.editRecordById(id);
                }
            });
        });
        
        // Обновление статус-бара
        const recordCountEl = document.getElementById('recordCount');
        if (recordCountEl) {
            recordCountEl.textContent = `Всего записей: ${this.filteredRecords.length}`;
        }
        
        const statusTextEl = document.getElementById('statusText');
        if (statusTextEl) {
            if (this.filteredRecords.length === 0) {
                statusTextEl.textContent = 'Нет записей';
            } else {
                statusTextEl.textContent = 
                    `Отображено ${this.filteredRecords.length} из ${this.records.length}`;
            }
        }
    }
    
    // Выбор строки
    private selectRow(id: number): void {
        this.selectedRow = id;
        this.render();
    }
    
    // Форматирование даты
    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Форматирование числа
    private formatNumber(num: number | undefined | null): string {
        if (num === undefined || num === null) return '';
        return parseFloat(num.toString()).toFixed(3);
    }
    
    // Добавление записи
    private addRecord(): void {
        const nextId = this.records.length > 0 
            ? Math.max(...this.records.map(r => r.id)) + 1 
            : 1;
        
        const newRecord: MnlzRecord = {
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
    private editRecord(): void {
        if (!this.selectedRow) {
            alert('Выберите запись для редактирования.');
            return;
        }
        
        const record = this.records.find(r => r.id === this.selectedRow);
        if (record) {
            this.openModal(record, false);
        }
    }
    
    // Редактирование записи по ID (для кнопки в строке)
    private editRecordById(id: number): void {
        const record = this.records.find(r => r.id === id);
        if (record) {
            this.openModal(record, false);
        }
    }
    
    // Удаление записи
    private deleteRecord(): void {
        if (!this.selectedRow) {
            alert('Выберите запись для удаления.');
            return;
        }
        
        const record = this.records.find(r => r.id === this.selectedRow);
        if (!record) return;
        
        if (confirm(`Удалить запись №${record.id} (сегмент ${record.segmentNumber})?`)) {
            this.records = this.records.filter(r => r.id !== this.selectedRow);
            this.saveData();
            const searchBox = document.getElementById('searchBox') as HTMLInputElement;
            if (searchBox) {
                this.applyFilter(searchBox.value);
            }
            this.selectedRow = null;
            this.showStatus('Запись удалена');
        }
    }
    
    // Открытие модального окна
    private openModal(record: MnlzRecord, isNew: boolean): void {
        const modal = document.getElementById('editModal');
        const title = document.getElementById('modalTitle');
        
        if (title) {
            title.textContent = isNew ? 'Новая запись' : 'Редактирование записи';
        }
        
        // Заполнение формы
        const setFieldValue = (fieldId: string, value: any) => {
            const field = document.getElementById(fieldId) as HTMLInputElement;
            if (field) {
                field.value = value !== 0 && value ? value : '';
            }
        };
        
        setFieldValue('editId', record.id);
        setFieldValue('editDate', record.testDate || '');
        setFieldValue('editSegment', record.segmentNumber || '');
        setFieldValue('editLastName', record.lastName || '');
        
        setFieldValue('editLeftInTop', record.leftInTop);
        setFieldValue('editLeftInBottom', record.leftInBottom);
        setFieldValue('editLeftOutTop', record.leftOutTop);
        setFieldValue('editLeftOutBottom', record.leftOutBottom);
        setFieldValue('editRightInTop', record.rightInTop);
        setFieldValue('editRightInBottom', record.rightInBottom);
        setFieldValue('editRightOutTop', record.rightOutTop);
        setFieldValue('editRightOutBottom', record.rightOutBottom);
        
        setFieldValue('editNotes', record.notes || '');
        
        if (modal) {
            modal.classList.add('active');
        }
        
        // Фокус на первом поле
        if (isNew) {
            const segmentField = document.getElementById('editSegment') as HTMLInputElement;
            if (segmentField) {
                segmentField.focus();
            }
        }
    }
    
    // Закрытие модального окна
    private closeModal(): void {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    // Сохранение записи
    private saveRecord(): void {
        const idField = document.getElementById('editId') as HTMLInputElement;
        const id = parseInt(idField?.value || '0');
        
        const segmentField = document.getElementById('editSegment') as HTMLInputElement;
        const segment = segmentField?.value.trim() || '';
        
        const lastNameField = document.getElementById('editLastName') as HTMLInputElement;
        const lastName = lastNameField?.value.trim() || '';
        
        // Валидация формата сегмента (X.X или X.X.X)
        const segmentPattern = /^\d+\.\d+(\.\d+)?$/;
        if (!segment) {
            alert('Укажите номер сегмента.');
            segmentField?.focus();
            return;
        }
        
        if (!segmentPattern.test(segment)) {
            alert('Номер сегмента должен быть в формате X.X или X.X.X');
            segmentField?.focus();
            return;
        }
        
        if (!lastName) {
            alert('Укажите ФИО сотрудника.');
            lastNameField?.focus();
            return;
        }
        
        // Получение значений полей
        const getDecimal = (elementId: string): number => {
            const field = document.getElementById(elementId) as HTMLInputElement;
            const value = field?.value.trim() || '';
            if (!value) return 0;
            const num = parseFloat(value.replace(',', '.'));
            if (isNaN(num)) {
                throw new Error(`Некорректное значение в поле ${elementId}`);
            }
            return num;
        };
        
        try {
            const recordData: MnlzRecord = {
                id: id,
                testDate: (document.getElementById('editDate') as HTMLInputElement)?.value || '',
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
                notes: (document.getElementById('editNotes') as HTMLInputElement)?.value.trim() || null
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
            this.records.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
            
            this.saveData();
            
            const searchBox = document.getElementById('searchBox') as HTMLInputElement;
            if (searchBox) {
                this.applyFilter(searchBox.value);
            }
            
            this.closeModal();
            
            this.showStatus(existingIndex >= 0 ? 'Запись обновлена' : 'Запись добавлена');
            
        } catch (error) {
            const err = error as Error;
            alert(err.message);
        }
    }
    
    // Показ статуса
    private showStatus(message: string): void {
        const statusEl = document.getElementById('statusText');
        if (statusEl) {
            statusEl.textContent = message;
            
            // Очистка через 3 секунды
            setTimeout(() => {
                if (statusEl.textContent === message) {
                    statusEl.textContent = '';
                }
            }, 3000);
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    (window as any).app = new MnlzJournalApp();
});
