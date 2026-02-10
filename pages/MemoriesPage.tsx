
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMemoryStore } from '../store/memoryStore';
import { UserRole, Memory } from '../types';
import Button from '../components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const MemoryCard: React.FC<{ memory: Memory, role: UserRole }> = ({ memory, role }) => {
    const { deleteMemory } = useMemoryStore();
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            whileHover={{ y: -5 }}
            className="bg-brand-surface rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-100"
        >
            {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} className="w-full h-48 object-cover"/>}
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">{memory.date}</p>
                <h3 className="text-xl font-bold text-brand-text mt-1">{memory.title}</h3>
                <p className="text-brand-text-light mt-2 flex-grow text-sm leading-relaxed">{memory.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {memory.tags?.map(tag => (
                            <span key={tag} className="text-[10px] font-bold bg-indigo-50 text-brand-primary px-2 py-1 rounded-md uppercase">{tag}</span>
                        ))}
                    </div>
                    {role === UserRole.CARETAKER && (
                        <div className="flex space-x-2">
                            <Button variant="secondary" size="sm" className="p-2"><PencilIcon /></Button>
                            <Button variant="danger" size="sm" className="p-2" onClick={() => deleteMemory(memory.id)}><TrashIcon /></Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const MemoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { memories, init } = useMemoryStore();

    useEffect(() => {
        const unsubscribe = init();
        return () => unsubscribe && unsubscribe();
    }, [init]);
    
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-brand-text">Life Story</h1>
                    <p className="text-brand-text-light text-lg">Beautiful moments to remember forever.</p>
                </div>
                {user?.role === UserRole.CARETAKER && (
                    <Button onClick={() => navigate('/memories/add')} leftIcon={<PlusIcon />} size="lg" className="rounded-2xl shadow-xl">
                        Add New Memory
                    </Button>
                )}
            </div>

            {memories.length === 0 ? (
                <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-300">
                    <p className="text-brand-text-light text-xl italic">No memories added yet. Start capturing the story.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {memories.map(memory => (
                            <MemoryCard key={memory.id} memory={memory} role={user!.role} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default MemoriesPage;
