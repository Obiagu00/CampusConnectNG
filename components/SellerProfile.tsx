import React from 'react';
import { Product, Seller } from '../types';
import ProductCard from './ProductCard';
import { UserIcon, StarIcon, AcademicCapIcon } from './IconComponents';

interface SellerProfileProps {
    seller: Seller;
    allProducts: Product[];
    onBack: () => void;
    onViewProduct: (product: Product) => void;
    onViewSeller: (seller: Seller) => void;
}

const SellerProfile: React.FC<SellerProfileProps> = ({ seller, allProducts, onBack, onViewProduct, onViewSeller }) => {
    const sellerProducts = allProducts.filter(p => p.seller.id === seller.id);
    const universityName = sellerProducts.length > 0 ? sellerProducts[0].universityName : 'CampusConnect Seller';
    
    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Listings
            </button>

            <div className="bg-white dark:bg-blue-900 rounded-xl shadow-lg p-8 mb-8 flex flex-col sm:flex-row items-center sm:space-x-6">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full flex-shrink-0">
                    <UserIcon className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-center sm:text-left mt-4 sm:mt-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{seller.name}</h1>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-md text-gray-500 dark:text-blue-400">
                        <div className="flex items-center justify-center sm:justify-start">
                            <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-blue-500" />
                            <span>{universityName}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start mt-2 sm:mt-0">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <p className="ml-2 font-medium">Rating: N/A</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-blue-200 mb-6">Listings from {seller.name}</h2>
            {sellerProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sellerProducts.map(product => (
                        <ProductCard key={product.id} product={product} onView={onViewProduct} onViewSeller={onViewSeller} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                     <h2 className="text-2xl font-semibold text-gray-700 dark:text-blue-300">No Listings Yet</h2>
                     <p className="text-gray-500 dark:text-blue-400 mt-2">This seller hasn't listed any items.</p>
                </div>
            )}
        </div>
    );
};
export default SellerProfile;