
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useMemoryStore } from '../store/memoryStore';
import { CameraIcon } from '../components/icons/Icons';

const AddMemoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { addMemory } = useMemoryStore();
    
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addMemory({
                title,
                date: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                description,
                imageUrl: imagePreview || undefined,
                tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
            });
            navigate('/memories');
        } catch (error) {
            console.error("Failed to add memory:", error);
            alert("Error saving memory. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-brand-text mb-8">New Memory</h1>
            <div className="bg-brand-surface/80 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl border border-white">
                <form className="space-y-6" onSubmit={handleSubmit}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-bold text-brand-text-light mb-2">Title</label>
                                <input 
                                    type="text" 
                                    id="title" 
                                    className="form-input py-4" 
                                    placeholder="e.g., Wedding Anniversary"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="date" className="block text-sm font-bold text-brand-text-light mb-2">When did it happen?</label>
                                <input 
                                    type="date" 
                                    id="date" 
                                    className="form-input py-4"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-bold text-brand-text-light mb-2">Categories (comma separated)</label>
                                <input 
                                    type="text" 
                                    id="tags" 
                                    className="form-input py-4" 
                                    placeholder="family, travel, 1980s"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-brand-text-light mb-2">Memorable Photo</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-3xl h-full min-h-[250px] relative overflow-hidden group">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="space-y-1 text-center self-center">
                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                            <CameraIcon />
                                        </div>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-secondary">
                                                <span>Upload a photo</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                )}
                                {imagePreview && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label htmlFor="file-upload" className="cursor-pointer text-white font-bold underline">Change Photo</label>
                                    </div>
                                )}
                            </div>
                        </div>
                     </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-brand-text-light mb-2">Describe the moment</label>
                        <textarea 
                            id="description" 
                            rows={4} 
                            className="form-input py-4" 
                            placeholder="Write a short story about this memory..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-4 pt-8">
                        <Button type="button" variant="secondary" onClick={() => navigate('/memories')} size="lg" className="px-8 rounded-2xl">Cancel</Button>
                        <Button type="submit" size="lg" className="px-10 rounded-2xl shadow-xl" loading={loading}>Save Story</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemoryPage;
