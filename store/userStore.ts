
import { create } from 'zustand';
import { User, UserRole } from '../types';

const mockPatient: User = {
  id: 'patient-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: UserRole.PATIENT,
  patientCode: 'JOHNDO',
};

const mockCaretaker: User = {
  id: 'caretaker-1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: UserRole.CARETAKER,
  patientId: 'patient-1',
};


interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (updatedUser: User) => void;
  findUserByPatientCode: (code: string) => User | undefined;
  findUserByRole: (role: UserRole) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [mockPatient, mockCaretaker],
  addUser: (userData) => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random()}`,
      ...userData,
    };
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser;
  },
  updateUser: (updatedUser) => {
    set((state) => ({
      users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
    }));
  },
  findUserByPatientCode: (code: string) => {
    return get().users.find(u => u.role === UserRole.PATIENT && u.patientCode === code.toUpperCase());
  },
  findUserByRole: (role: UserRole) => {
    const usersOfRole = get().users.filter(u => u.role === role);
    return usersOfRole[usersOfRole.length - 1]; // return last registered user of that role
  }
}));
