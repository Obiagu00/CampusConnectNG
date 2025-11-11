
import React, { useState } from 'react';
import { Product, Seller } from '../types';
import ProductCard from './ProductCard';
import { UserIcon, StarIcon, CloseIcon } from './IconComponents';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onViewProduct: (product: Product) => void;
  onViewSeller: (seller: Seller) => void;
  onContactSeller: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, onBack, onViewProduct, onViewSeller, onContactSeller }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="animate-fade-in">
        <button onClick={onBack} className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Listings
        </button>

        <div className="bg-white dark:bg-blue-900 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4">
                    <img 
                        src={product.imageUrl.replace('/400/300', '/800/600')} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => setIsImageModalOpen(true)}
                    />
                </div>
                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-700">
                            {product.category}
                        </span>
                        <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{product.name}</h1>
                        
                        <p className="text-gray-700 dark:text-blue-300 mt-4 text-base">
                            {product.description}
                        </p>

                        <div className="mt-4 flex items-center space-x-4">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${product.condition === 'New' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
                                {product.condition}
                            </span>
                        </div>

                        <div 
                            className="mt-6 pt-6 border-t border-gray-200 dark:border-blue-700 cursor-pointer group"
                            onClick={() => onViewSeller(product.seller)}
                        >
                            <h2 className="text-xl font-bold text-gray-800 dark:text-blue-200 mb-3">Seller Information</h2>
                             <div className="flex items-center text-gray-700 dark:text-blue-300 mb-2">
                                <UserIcon className="h-6 w-6 mr-3 text-gray-500 dark:text-blue-400" />
                                <span className="font-semibold group-hover:underline">
                                    {product.seller.name}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-blue-300 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 000 1.84L9 9.61V16.5a1 1 0 00.394.806l7 3.5a1 1 0 001.212-.805V9.61l-5.606-2.803zM10 8.39L4 5.59l6-3 6 3-6 2.8z" />
                                </svg>
                                <span>{product.universityName}</span>
                            </div>
                             <div className="flex items-center text-gray-700 dark:text-blue-300">
                                <StarIcon className="h-6 w-6 mr-3 text-yellow-400" />
                                <span className="font-medium">Rating: N/A</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            ₦{product.price.toLocaleString()}
                        </p>
                         <button 
                            onClick={() => onContactSeller(product)}
                            className="mt-4 w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                         >
                            Contact Seller
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {relatedProducts.length > 0 && (
             <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-blue-200 mb-6">Related Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} onView={onViewProduct} onViewSeller={onViewSeller} />
                    ))}
                </div>
            </div>
        )}

        {isImageModalOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
                onClick={() => setIsImageModalOpen(false)}
            >
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                     <img 
                        src={product.imageUrl.replace('/400/300', '/1200/900')} 
                        alt={product.name} 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                    />
                     <button 
                        onClick={() => setIsImageModalOpen(false)} 
                        className="absolute -top-3 -right-3 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        aria-label="Close image view"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProductDetail;
