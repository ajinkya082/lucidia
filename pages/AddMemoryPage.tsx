import React from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AddMemoryPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-text mb-8">Add New Memory</h1>
            <div className="max-w-2xl mx-auto bg-brand-surface/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                <form className="space-y-6">
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-brand-text-light">Title</label>
                        <input type="text" id="title" className="form-input" placeholder="Title of the memory"/>
                    </div>
                    
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-brand-text-light">Date</label>
                        <input type="date" id="date" className="form-input"/>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-text-light">Description</label>
                        <textarea id="description" rows={4} className="form-input" placeholder="Describe the memory..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text-light">Image (Optional)</label>
                        <div className="mt-2 flex items-center">
                           <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.993A1 1 0 001 20h22a1 1 0 001-1.007zM12 12a4 4 0 100-8 4 4 0 000 8z" />
                                </svg>
                           </span>
                           <label htmlFor="file-upload" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-xl shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer">
                               <span>Upload a file</span>
                               <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-brand-text-light">Tags</label>
                        <input type="text" id="tags" className="form-input" placeholder="family, travel, holiday (comma separated)"/>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/memories')} size="lg">Cancel</Button>
                        <Button type="submit" size="lg">Save Memory</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemoryPage;