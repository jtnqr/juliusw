export interface Student {
  id: number; // Changed from string to number for MySQL compatibility
  nama: string;
  jurusan: string;
  npm: string;
}

export type StudentFormData = Omit<Student, 'id'>;