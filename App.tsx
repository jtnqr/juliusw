import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, GraduationCap, ChevronUp, ChevronDown, AlertTriangle, Loader2 } from 'lucide-react';
import { Student, StudentFormData } from './types';
import { Modal } from './components/Modal';
import { StudentForm } from './components/StudentForm';
import { Button } from './components/Button';

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Student;
  direction: SortDirection;
}

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Fetch data dari API saat komponen dimuat
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (data: StudentFormData) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Gagal menambah data');
      
      const newStudent = await response.json();
      setStudents(prev => [newStudent, ...prev]); // Tambahkan ke awal list untuk UX lebih baik
      setIsFormModalOpen(false);
      
      setHighlightedId(newStudent.id);
      setTimeout(() => setHighlightedId(null), 2000);
    } catch (err) {
      alert('Gagal menambah mahasiswa: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateStudent = async (data: StudentFormData) => {
    if (!editingStudent) return;
    
    try {
      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Gagal mengupdate data');

      const updatedStudent = await response.json();
      
      setStudents(students.map((s) =>
        s.id === editingStudent.id ? updatedStudent : s
      ));
      
      setHighlightedId(editingStudent.id);
      setTimeout(() => setHighlightedId(null), 2000);

      setEditingStudent(null);
      setIsFormModalOpen(false);
    } catch (err) {
      alert('Gagal update mahasiswa: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const promptDelete = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        const response = await fetch(`/api/students/${studentToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Gagal menghapus data');

        setStudents(students.filter((s) => s.id !== studentToDelete.id));
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
      } catch (err) {
        alert('Gagal menghapus mahasiswa: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleSort = (key: keyof Student) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedStudents = useMemo(() => {
    let result = students.filter((student) =>
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.npm.includes(searchTerm) ||
      student.jurusan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [students, searchTerm, sortConfig]);

  const getSortIcon = (columnKey: keyof Student) => {
    if (sortConfig?.key !== columnKey) {
      return <div className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity"><ChevronUp size={16} /></div>;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} className="text-indigo-600" /> : <ChevronDown size={16} className="text-indigo-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">DataMahasiswa</h1>
          </div>
          <Button onClick={openAddModal} size="sm" className="hidden sm:flex gap-2">
            <Plus size={16} />
            Tambah Data
          </Button>
          <button 
             onClick={openAddModal}
             className="sm:hidden flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg"
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama, NPM, atau jurusan..."
              className="pl-10 w-full h-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Mahasiswa: <span className="text-slate-900">{students.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">#</th>
                  
                  <th 
                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    onClick={() => handleSort('nama')}
                  >
                    <div className="flex items-center gap-1">
                      Nama Mahasiswa
                      {getSortIcon('nama')}
                    </div>
                  </th>
                  
                  <th 
                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    onClick={() => handleSort('npm')}
                  >
                    <div className="flex items-center gap-1">
                      NPM
                      {getSortIcon('npm')}
                    </div>
                  </th>
                  
                  <th 
                    className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                    onClick={() => handleSort('jurusan')}
                  >
                    <div className="flex items-center gap-1">
                      Jurusan
                      {getSortIcon('jurusan')}
                    </div>
                  </th>
                  
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
                        <p>Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                   <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p>Gagal memuat data: {error}</p>
                        <p className="text-xs text-slate-400 mt-1">Pastikan server backend berjalan (npm start)</p>
                      </div>
                    </td>
                  </tr>
                ) : processedStudents.length > 0 ? (
                  processedStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`transition-colors duration-500 ${
                        highlightedId === student.id ? 'bg-indigo-100' : 'hover:bg-indigo-50/30'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.nama}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {student.npm}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {student.jurusan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => promptDelete(student)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                           <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                            <path d="M53.3334 32V50.6667C53.3334 52.1334 52.1334 53.3334 50.6667 53.3334H13.3334C11.8667 53.3334 10.6667 52.1334 10.6667 50.6667V13.3334C10.6667 11.8667 11.8667 10.6667 13.3334 10.6667H32" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M53.3333 10.6666L29.3333 34.6666L21.3333 26.6666" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M42.6666 21.3334C45.3333 18.6667 48 16 50.6666 13.3334" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="45" cy="45" r="10" stroke="#94A3B8" strokeWidth="2"/>
                            <path d="M52 52L56 56" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <h3 className="text-slate-900 font-medium mb-1">Tidak ada data ditemukan</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                          Coba ubah kata kunci pencarian atau tambah data mahasiswa baru.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingStudent ? 'Edit Data Mahasiswa' : 'Tambah Mahasiswa Baru'}
      >
        <StudentForm
          initialData={editingStudent}
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-3 rounded-full flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Apakah Anda yakin ingin menghapus data mahasiswa <span className="font-semibold text-slate-900">{studentToDelete?.nama}</span>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <Button 
              variant="secondary" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
            >
              Hapus Data
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default App;