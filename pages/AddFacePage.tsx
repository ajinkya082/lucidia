
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { CameraIcon } from '../components/icons/Icons';
import { useNavigate } from 'react-router-dom';
import { useFaceStore } from '../store/faceStore';

const AddFacePage: React.FC = () => {
    const navigate = useNavigate();
    const { addFace } = useFaceStore();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');
    const [notes, setNotes] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !relation || !imagePreview) {
            alert("Please provide a name, relation, and photo.");
            return;
        }

        addFace({
            name,
            relation,
            imageUrl: imagePreview,
            notes: notes || 'No extra notes provided.'
        });

        alert("Profile saved successfully!");
        navigate('/faces');
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-text mb-8">Add New Face Profile</h1>
            <div className="max-w-2xl mx-auto bg-brand-surface/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-light">Photo</label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-full shadow-md" />
                                ) : (
                                    <div className="mx-auto h-16 w-16 text-gray-400">
                                       <CameraIcon />
                                    </div>
                                )}
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none px-3 py-1">
                                        <span>Upload a photo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-text-light">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="form-input" 
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="relation" className="block text-sm font-medium text-brand-text-light">Relation</label>
                        <input 
                            type="text" 
                            id="relation" 
                            className="form-input" 
                            placeholder="Daughter, Doctor, etc."
                            value={relation}
                            onChange={(e) => setRelation(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-brand-text-light">Notes</label>
                        <textarea 
                            id="notes" 
                            rows={3} 
                            className="form-input" 
                            placeholder="A short note about this person."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/faces')} size="lg">Cancel</Button>
                        <Button type="submit" size="lg">Save Profile</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFacePage;
