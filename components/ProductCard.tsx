
import React from 'react';
import { Product, Seller } from '../types';
import { StarIcon } from './IconComponents';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onViewSeller: (seller: Seller) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView, onViewSeller }) => {
  
  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewSeller(product.seller);
  };

  return (
    <div className="bg-white dark:bg-blue-900 rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
        <div 
          className="mt-1 group cursor-pointer"
          onClick={handleSellerClick}
        >
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline truncate">
            {product.seller.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-blue-400 truncate">{product.universityName}</p>
        </div>
        
        <div className="flex items-center mt-2">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <p className="text-xs text-gray-500 dark:text-blue-400 ml-1">Rating: N/A</p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            ₦{product.price.toLocaleString()}
          </p>
          <button 
            onClick={() => onView(product)}
            className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
