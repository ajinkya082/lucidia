import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole, Memory } from '../types';
import Button from '../components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';
import { motion } from 'framer-motion';


const mockMemories: Memory[] = [
    { id: '1', title: 'Wedding Day', date: 'June 15, 1985', description: 'A beautiful sunny day when we said "I do".', imageUrl: 'https://picsum.photos/seed/wedding/400/300', tags: ['family', 'celebration'] },
    { id: '2', title: 'First Trip to Paris', date: 'May 2002', description: 'Saw the Eiffel Tower for the first time. The croissants were amazing.', imageUrl: 'https://picsum.photos/seed/paris/400/300', tags: ['travel', 'europe'] },
    { id: '3', title: 'Teaching Grandson to Fish', date: 'July 2018', description: 'Mike caught his first fish at the lake house.', imageUrl: 'https://picsum.photos/seed/fishing/400/300', tags: ['family', 'hobby'] },
];

const MemoryCard: React.FC<{ memory: Memory, role: UserRole }> = ({ memory, role }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        whileHover={{ y: -5 }}
        className="bg-brand-surface rounded-2xl shadow-lg overflow-hidden flex flex-col"
    >
        {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} className="w-full h-48 object-cover"/>}
        <div className="p-5 flex flex-col flex-grow">
            <p className="text-sm text-brand-text-light">{memory.date}</p>
            <h3 className="text-xl font-bold text-brand-text mt-1">{memory.title}</h3>
            <p className="text-brand-text-light mt-2 flex-grow">{memory.description}</p>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {memory.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold bg-indigo-100 text-brand-primary px-3 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                {role === UserRole.CARETAKER && (
                    <div className="flex space-x-2">
                        <Button variant="secondary" size="sm"><PencilIcon /></Button>
                        <Button variant="danger" size="sm"><TrashIcon /></Button>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

const MemoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-text">My Memories</h1>
                {user?.role === UserRole.CARETAKER && (
                    <Button onClick={() => navigate('/memories/add')} leftIcon={<PlusIcon />} size="lg">
                        Add New Memory
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {mockMemories.map(memory => (
                    <MemoryCard key={memory.id} memory={memory} role={user!.role} />
                ))}
            </div>
        </div>
    );
};

export default MemoriesPage;