// State Data Utama
let items = JSON.parse(localStorage.getItem('inventaris_items')) || [
    { id: 1, name: 'Kain Katun Premium', qty: 25, date: '2026-09-25', status: 'Masuk', desc: 'Kiriman dari supplier utama' },
    { id: 2, name: 'Jaket Denim Vintage', qty: 12, date: '2026-09-26', status: 'Sedang Dicuci', desc: 'Pencucian khusus laundry' },
    { id: 3, name: 'Kaos Polos Cotton Combed', qty: 50, date: '2026-09-24', status: 'Packing', desc: 'Persiapan pengiriman toko online' },
    { id: 4, name: 'Kemeja Flanel', qty: 15, date: '2026-09-22', status: 'Selesai', desc: 'Selesai dan sudah dikirim', completedDate: '2026-09-27' }
];

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Set default date di form ke hari ini
    document.getElementById('itemDate').valueAsDate = new Date();
    renderAll();
});

// Switch Tab Navigasi
function switchTab(tabName) {
    const dashboardTab = document.getElementById('tab-dashboard');
    const logsTab = document.getElementById('tab-logs');
    const navDashboard = document.getElementById('nav-dashboard');
    const navLogs = document.getElementById('nav-logs');

    if (tabName === 'dashboard') {
        dashboardTab.classList.remove('hidden');
        logsTab.classList.add('hidden');
        
        navDashboard.className = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-indigo-600 shadow-sm flex items-center gap-2";
        navLogs.className = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:bg-white/10 flex items-center gap-2";
    } else {
        dashboardTab.classList.add('hidden');
        logsTab.classList.remove('hidden');
        
        navLogs.className = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-emerald-600 shadow-sm flex items-center gap-2";
        navDashboard.className = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:bg-white/10 flex items-center gap-2";
        renderLogs();
    }
}

// Simpan data ke LocalStorage
function saveData() {
    localStorage.setItem('inventaris_items', JSON.stringify(items));
}

// Render Semua Data & Statistik
function renderAll() {
    renderItems();
    renderStats();
}

// Render Statistik
function renderStats() {
    const total = items.length;
    const process = items.filter(i => ['Masuk', 'Proses Kirim'].includes(i.status)).length;
    const washPack = items.filter(i => ['Sedang Dicuci', 'Packing'].includes(i.status)).length;
    const completed = items.filter(i => i.status === 'Selesai').length;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-process').innerText = process;
    document.getElementById('stat-wash-pack').innerText = washPack;
    document.getElementById('stat-completed').innerText = completed;
}

// Render Tabel Barang Utama
function renderItems() {
    const tbody = document.getElementById('itemsTableBody');
    const emptyState = document.getElementById('emptyState');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const filterVal = document.getElementById('filterStatus').value;

    const filtered = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchVal) || (item.desc && item.desc.toLowerCase().includes(searchVal));
        const matchFilter = filterVal === '' || item.status === filterVal;
        return matchSearch && matchFilter;
    });

    document.getElementById('itemCountBadge').innerText = `${filtered.length} Item`;

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = filtered.map(item => `
        <tr class="hover:bg-slate-50/80 transition-colors">
            <td class="py-3.5 px-6 font-medium text-slate-800">
                ${item.name}
            </td>
            <td class="py-3.5 px-6 text-slate-500 text-xs">
                ${item.desc || '-'}
            </td>
            <td class="py-3.5 px-6 font-semibold text-slate-700">
                ${item.qty} pcs
            </td>
            <td class="py-3.5 px-6 text-slate-500 text-xs">
                <i class="fa-regular fa-calendar mr-1"></i> ${formatDate(item.date)}
            </td>
            <td class="py-3.5 px-6">
                ${getStatusBadge(item.status)}
            </td>
            <td class="py-3.5 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="editItem(${item.id})" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center text-xs" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="deleteItem(${item.id})" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center text-xs" title="Hapus">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render Log Barang Selesai
function renderLogs() {
    const tbody = document.getElementById('logsTableBody');
    const emptyState = document.getElementById('emptyLogState');
    const searchVal = document.getElementById('searchLogInput') ? document.getElementById('searchLogInput').value.toLowerCase() : '';

    const completedItems = items.filter(item => {
        const isCompleted = item.status === 'Selesai';
        const matchSearch = item.name.toLowerCase().includes(searchVal) || (item.desc && item.desc.toLowerCase().includes(searchVal));
        return isCompleted && matchSearch;
    });

    if (completedItems.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = completedItems.map((item, index) => `
        <tr class="hover:bg-slate-50/80 transition-colors">
            <td class="py-3.5 px-6 text-slate-400 font-medium">${index + 1}</td>
            <td class="py-3.5 px-6 font-semibold text-slate-800">${item.name}</td>
            <td class="py-3.5 px-6 text-slate-700">${item.qty} pcs</td>
            <td class="py-3.5 px-6 text-slate-500 text-xs">${formatDate(item.date)}</td>
            <td class="py-3.5 px-6 font-medium text-emerald-600 text-xs">
                <i class="fa-solid fa-circle-check mr-1"></i> ${item.completedDate ? formatDate(item.completedDate) : formatDate(new Date().toISOString().split('T')[0])}
            </td>
            <td class="py-3.5 px-6 text-slate-500 text-xs">${item.desc || '-'}</td>
        </tr>
    `).join('');
}

// Badge Status Styling
function getStatusBadge(status) {
    switch (status) {
        case 'Masuk':
            return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Masuk</span>`;
        case 'Sedang Dicuci':
            return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200/60"><span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>Sedang Dicuci</span>`;
        case 'Proses Kirim':
            return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Proses Kirim</span>`;
        case 'Packing':
            return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>Packing</span>`;
        case 'Selesai':
            return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Selesai</span>`;
        default:
            return `<span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">${status}</span>`;
    }
}

// Format Tanggal Indonesia Sederhana
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

// Modal Kontrol
function openModal(isEdit = false) {
    document.getElementById('itemModal').classList.remove('hidden');
    if (!isEdit) {
        document.getElementById('modalTitle').innerText = 'Tambah Barang Baru';
        document.getElementById('itemForm').reset();
        document.getElementById('itemId').value = '';
        document.getElementById('itemDate').valueAsDate = new Date();
    }
}

function closeModal() {
    document.getElementById('itemModal').classList.add('hidden');
}

// Simpan / Tambah / Edit Barang
function saveItem(e) {
    e.preventDefault();
    const id = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const qty = parseInt(document.getElementById('itemQty').value);
    const date = document.getElementById('itemDate').value;
    const status = document.getElementById('itemStatus').value;
    const desc = document.getElementById('itemDesc').value;

    const todayStr = new Date().toISOString().split('T')[0];

    if (id) {
        // Edit Existing
        items = items.map(item => {
            if (item.id == id) {
                let completedDate = item.completedDate;
                if (status === 'Selesai' && item.status !== 'Selesai') {
                    completedDate = todayStr;
                } else if (status !== 'Selesai') {
                    completedDate = null;
                }
                return { ...item, name, qty, date, status, desc, completedDate };
            }
            return item;
        });
        showToast('Data barang berhasil diperbarui!');
    } else {
        // Add New
        const newItem = {
            id: Date.now(),
            name,
            qty,
            date,
            status,
            desc,
            completedDate: status === 'Selesai' ? todayStr : null
        };
        items.unshift(newItem);
        showToast('Barang baru berhasil ditambahkan!');
    }

    saveData();
    renderAll();
    closeModal();
}

// Edit Item Trigger
function editItem(id) {
    const item = items.find(i => i.id == id);
    if (!item) return;

    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemQty').value = item.qty;
    document.getElementById('itemDate').value = item.date;
    document.getElementById('itemStatus').value = item.status;
    document.getElementById('itemDesc').value = item.desc || '';

    document.getElementById('modalTitle').innerText = 'Edit Data Barang';
    openModal(true);
}

// Hapus Item
function deleteItem(id) {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        items = items.filter(i => i.id != id);
        saveData();
        renderAll();
        showToast('Barang berhasil dihapus!', 'fa-circle-xmark', 'text-rose-400');
    }
}

// Filter Pencarian Tabel Utama
function filterItems() {
    renderItems();
}

// Filter Pencarian Log
function filterLogs() {
    renderLogs();
}

// Toast Notifikasi Interaktif
function showToast(msg, icon = 'fa-circle-check', iconColor = 'text-emerald-400') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.innerText = msg;
    toastIcon.className = `fa-solid ${icon} ${iconColor}`;

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
