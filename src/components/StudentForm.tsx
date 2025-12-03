import React, { useState, useEffect } from 'react';
import { Student, StudentFormData } from '../types';
import { Input } from './Input';
import { Button } from './Button';

interface StudentFormProps {
  initialData?: Student | null;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<StudentFormData>({
    nama: '',
    jurusan: '',
    npm: '',
  });

  const [errors, setErrors] = useState<{ npm?: string }>({});

  const getInitialState = () => ({
    nama: initialData?.nama || '',
    jurusan: initialData?.jurusan || '',
    npm: initialData?.npm || '',
  });

  useEffect(() => {
    setFormData(getInitialState());
    setErrors({});
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.npm.length !== 8) {
      setErrors((prev) => ({ ...prev, npm: 'NPM harus terdiri dari 8 digit angka' }));
      return;
    }

    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData(getInitialState());
    setErrors({});
  };

  const handleCancel = () => {
    const initialState = getInitialState();
    
    // Check if any field is different from initial state
    const isDirty = 
      formData.nama !== initialState.nama || 
      formData.jurusan !== initialState.jurusan || 
      formData.npm !== initialState.npm;

    if (isDirty) {
      if (window.confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin membatalkan?')) {
        resetForm();
        onCancel();
      }
    } else {
      resetForm();
      onCancel();
    }
  };

  const handleNpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, npm: value }));
    
    if (errors.npm) {
      setErrors((prev) => ({ ...prev, npm: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Lengkap"
        value={formData.nama}
        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        placeholder="Contoh: Budi Santoso"
        required
      />
      <Input
        label="Jurusan"
        value={formData.jurusan}
        onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
        placeholder="Contoh: Teknik Informatika"
        required
      />
      <Input
        label="NPM"
        value={formData.npm}
        onChange={handleNpmChange}
        placeholder="Contoh: 20240001"
        maxLength={8}
        error={errors.npm}
        required
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Batal
        </Button>
        <Button type="submit">
          {initialData ? 'Simpan Perubahan' : 'Tambah Mahasiswa'}
        </Button>
      </div>
    </form>
  );
};
