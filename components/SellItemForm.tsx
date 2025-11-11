
import React, { useState, useCallback, useMemo } from 'react';
import { Product, User } from '../types';
import { universities } from '../constants';
import { analyzeProductImage } from '../services/geminiService';
import { UploadIcon } from './IconComponents';

interface SellItemFormProps {
  user: User | null;
  onCancel: () => void;
  onProductListed: (newProduct: Omit<Product, 'id' | 'seller'>) => void;
}

const commonInputClasses = "bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full p-3 transition";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1";

const SellItemForm: React.FC<SellItemFormProps> = ({ user, onCancel, onProductListed }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState<'New' | 'Used'>('New');
  const [universityName, setUniversityName] = useState(user?.universityName || universities[0]?.name || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const categories = useMemo(() => ['Electronics', 'Books', 'Hobbies', 'Appliances', 'Fashion', 'Gaming', 'Services'], []);

  const handleImageChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setAnalysisResult('');
      setIsAnalyzing(true);
      analyzeProductImage(file).then(result => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
      });
    } else {
      setImageFile(null);
      setImagePreview(null);
      setAnalysisResult('');
    }
  }, []);

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isOver: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(isOver);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      handleDragEvents(e, false);
      handleImageChange(e.dataTransfer.files);
  };
  
  const isFormValid = useMemo(() => {
    return name.trim() && price.trim() && Number(price) > 0 && category && universityName && imageFile;
  }, [name, price, category, universityName, imageFile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !imagePreview) return;
    
    onProductListed({
      name,
      description,
      price: parseFloat(price),
      category,
      condition,
      universityName,
      imageUrl: imagePreview,
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-blue-200 mb-6">List a New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-blue-900 p-8 rounded-xl shadow-lg">
            
            <div>
                <label className={labelClasses}>Product Photo</label>
                <label 
                    onDragOver={(e) => handleDragEvents(e, true)}
                    onDragEnter={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDrop={handleDrop}
                    className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 ${dragOver ? 'border-indigo-500' : 'border-gray-300 dark:border-blue-600'} border-dashed rounded-md cursor-pointer transition-colors`}
                >
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                           <img src={imagePreview} alt="Product preview" className="mx-auto h-40 w-auto rounded-md object-cover" />
                        ) : (
                            <>
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-blue-400">
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-blue-500">PNG, JPG, GIF up to 10MB</p>
                            </>
                        )}
                         <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={e => handleImageChange(e.target.files)} />
                    </div>
                </label>
                {(isAnalyzing || analysisResult) && (
                    <div className="mt-3 text-sm p-3 rounded-md bg-gray-100 dark:bg-blue-800 flex items-center">
                        {isAnalyzing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600 dark:text-blue-300">Analyzing your photo...</span>
                            </>
                        ) : (
                           <p className="text-gray-800 dark:text-blue-200">{analysisResult}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Item Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={commonInputClasses} required />
                </div>
                <div>
                    <label htmlFor="price" className={labelClasses}>Price (₦)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className={commonInputClasses} required min="0" placeholder="e.g., 5000" />
                </div>
            </div>

            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={commonInputClasses}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category" className={labelClasses}>Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={commonInputClasses} required>
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClasses}>Condition</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                            <input type="radio" value="New" checked={condition === 'New'} onChange={() => setCondition('New')} className="form-radio h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-gray-700 dark:text-blue-300">New</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" value="Used" checked={condition === 'Used'} onChange={() => setCondition('Used')} className="form-radio h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-gray-700 dark:text-blue-300">Used</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="university" className={labelClasses}>Your University</label>
                <select id="university" value={universityName} onChange={e => setUniversityName(e.target.value)} className={commonInputClasses} required>
                    {universities.map(uni => <option key={uni.name} value={uni.name}>{uni.name}</option>)}
                </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={!isFormValid} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors">
                    List Item
                </button>
            </div>
        </form>
    </div>
  );
};

export default SellItemForm;
