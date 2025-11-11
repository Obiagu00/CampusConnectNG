
import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Chatbot from './components/Chatbot';
import SellItemForm from './components/SellItemForm';
import SellerProfile from './components/SellerProfile';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import ChatView from './components/ChatView';
import { Product, Seller, User, Conversation, DirectMessage } from './types';
import { mockProducts, mockUsers, universities } from './constants';
import { ProfileIcon } from './components/IconComponents';

type View = 'marketplace' | 'detail' | 'sell' | 'profile' | 'myListings' | 'myProfile';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSellerUniversity, setSelectedSellerUniversity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  
  const [view, setView] = useState<View>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewedSeller, setViewedSeller] = useState<Seller | null>(null);
  
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category).sort())], [products]);
  const conditions = ['All', 'New', 'Used'];

  useEffect(() => {
    let tempProducts = products;

    if (searchTerm) {
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSellerUniversity !== 'All') {
      tempProducts = tempProducts.filter(p => p.universityName === selectedSellerUniversity);
    }
    
    if (selectedCategory !== 'All') {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }
    
    if (selectedCondition !== 'All') {
        tempProducts = tempProducts.filter(p => p.condition === selectedCondition);
    }

    setFilteredProducts(tempProducts);
  }, [searchTerm, selectedSellerUniversity, selectedCategory, selectedCondition, products]);

  const handleViewProduct = (product: Product) => {
      setSelectedProduct(product);
      setView('detail');
      window.scrollTo(0, 0);
  };
  
  const handleViewSeller = (seller: Seller) => {
      setViewedSeller(seller);
      setView('profile');
      window.scrollTo(0, 0);
  }

  const handleBackToMarketplace = () => {
      setSelectedProduct(null);
      setViewedSeller(null);
      setView('marketplace');
  };
  
  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };
  
  const handleStartSelling = () => {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }
    setView('sell');
    window.scrollTo(0, 0);
  };

  const handleViewMyListings = () => {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }
    setView('myListings');
    window.scrollTo(0, 0);
  };

  const handleViewProfile = () => {
    if (currentUser) {
      setView('myProfile');
      window.scrollTo(0, 0);
    }
  }
  
  const handleProductListed = (newProduct: Omit<Product, 'id' | 'seller'>) => {
      if (!currentUser) return;
      const productWithId: Product = {
          ...newProduct,
          id: Date.now(),
          seller: { id: currentUser.id, name: currentUser.name },
      };
      setProducts(prevProducts => [productWithId, ...prevProducts]);
      setView('marketplace');
  };

  const handleLogin = (credentials: {email: string; pass: string}) => {
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      if (user) {
          setCurrentUser(user);
          setAuthModalOpen(false);
      } else {
          alert("User not found. Try signing up!");
      }
  };
  
  const handleSignUp = (details: Omit<User, 'id'>) => {
      const newUser: User = { ...details, id: Date.now() };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setAuthModalOpen(false);
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      setView('marketplace');
  };

  const handleUpdateUser = (updatedData: {name: string, universityName: string}) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setProducts(products.map(p => p.seller.id === updatedUser.id ? {...p, seller: { ...p.seller, name: updatedUser.name }} : p));
  };

  const handleContactSeller = (product: Product) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    if (currentUser.id === product.seller.id) {
      alert("You cannot contact yourself about your own listing.");
      return;
    }

    const conversationId = `${currentUser.id}-${product.seller.id}-${product.id}`;
    const existingConvo = conversations.find(c => c.id === conversationId);

    if (existingConvo) {
      setActiveConversation(existingConvo);
    } else {
      const newConversation: Conversation = {
        id: conversationId,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        buyer: { id: currentUser.id, name: currentUser.name },
        seller: product.seller,
        messages: [],
      };
      setConversations([...conversations, newConversation]);
      setActiveConversation(newConversation);
    }
  };

  const handleSendDirectMessage = (conversationId: string, text: string) => {
    if (!currentUser) return;

    const newMessage: DirectMessage = {
      id: Date.now(),
      conversationId,
      senderId: currentUser.id,
      text,
      timestamp: Date.now(),
    };
    
    const updateConversations = (updater: (convo: Conversation) => Conversation) => {
        const updatedConversations = conversations.map(c => c.id === conversationId ? updater(c) : c);
        setConversations(updatedConversations);
        const active = updatedConversations.find(c => c.id === conversationId);
        if (active) setActiveConversation(active);
    };
    
    updateConversations(convo => ({ ...convo, messages: [...convo.messages, newMessage] }));

    // Simulate seller's automated reply
    setTimeout(() => {
        const activeConvo = conversations.find(c => c.id === conversationId) || activeConversation;
        if (!activeConvo) return;
        
        const sellerReply: DirectMessage = {
            id: Date.now() + 1,
            conversationId,
            senderId: activeConvo.seller.id,
            text: "Thanks for your message! The seller has been notified and will get back to you shortly.",
            timestamp: Date.now(),
        };
        updateConversations(convo => ({ ...convo, messages: [...convo.messages, sellerReply] }));
    }, 1500);
  };

  const handleCloseChat = () => {
    setActiveConversation(null);
  };

  const renderContent = () => {
    switch(view) {
        case 'sell':
            return <SellItemForm user={currentUser} onCancel={handleBackToMarketplace} onProductListed={handleProductListed} />;
        case 'detail':
            return selectedProduct && <ProductDetail product={selectedProduct} allProducts={products} onBack={handleBackToMarketplace} onViewProduct={handleViewProduct} onViewSeller={handleViewSeller} onContactSeller={handleContactSeller} />;
        case 'profile':
            return viewedSeller && <SellerProfile seller={viewedSeller} allProducts={products} onBack={handleBackToMarketplace} onViewProduct={handleViewProduct} onViewSeller={handleViewSeller} />;
        case 'myProfile':
            return currentUser && <Profile user={currentUser} onUpdateUser={handleUpdateUser} onBack={handleBackToMarketplace} />;
        case 'myListings':
            const myListings = currentUser ? products.filter(p => p.seller.id === currentUser.id) : [];
            return (
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-blue-200 mb-6">My Listings</h2>
                    {myListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {myListings.map(product => (
                                <ProductCard key={product.id} product={product} onView={handleViewProduct} onViewSeller={handleViewSeller} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-20">
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-blue-300">You have no listings yet.</h2>
                            <button 
                              onClick={handleStartSelling} 
                              className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                            >
                              List Your First Item
                            </button>
                        </div>
                    )}
                </div>
            );
        case 'marketplace':
        default:
            return (
              <>
                <div className="bg-white dark:bg-blue-900 p-4 sm:p-6 rounded-xl shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full md:flex-1 p-3 transition"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                         <div className="relative w-full md:w-auto md:min-w-[200px]">
                            <select
                                className="appearance-none bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full p-3"
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-blue-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <div className="relative w-full md:w-auto md:min-w-[200px]">
                            <select
                                className="appearance-none bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full p-3"
                                value={selectedCondition}
                                onChange={e => setSelectedCondition(e.target.value)}
                            >
                                {conditions.map(con => <option key={con} value={con}>{con === 'All' ? 'Any Condition' : con}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-blue-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <div className="relative w-full md:w-auto md:min-w-[200px]">
                            <select
                                className="appearance-none bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full p-3"
                                value={selectedSellerUniversity}
                                onChange={e => setSelectedSellerUniversity(e.target.value)}
                            >
                                <option value="All">All Seller Universities</option>
                                {universities.map(uni => <option key={uni.name} value={uni.name}>{uni.name}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-blue-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        {!currentUser && (
                            <div className="grid grid-cols-2 gap-4 md:hidden mt-2">
                                <button onClick={() => openAuthModal('login')} className="w-full px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors">
                                  Login
                                </button>
                                <button onClick={() => openAuthModal('signup')} className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                                  Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
        
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} onView={handleViewProduct} onViewSeller={handleViewSeller} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-blue-300">No Items Found</h2>
                    <p className="text-gray-500 dark:text-blue-400 mt-2">Try adjusting your search or filters. Or ask our AI assistant for help!</p>
                  </div>
                )}
              </>
            );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-blue-950 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      {isAuthModalOpen && <AuthModal mode={authMode} onLogin={handleLogin} onSignUp={handleSignUp} onClose={() => setAuthModalOpen(false)} />}
      {activeConversation && currentUser && (
        <ChatView 
          conversation={activeConversation}
          currentUser={currentUser}
          onSendMessage={handleSendDirectMessage}
          onClose={handleCloseChat}
        />
      )}
      <header className="bg-white dark:bg-blue-900/80 shadow-md sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" onClick={handleBackToMarketplace}>
                CampusConnect <span className="text-green-500">NG</span>
              </h1>
              <div className="hidden md:flex items-center space-x-4">
                {currentUser ? (
                    <>
                        <button onClick={handleViewMyListings} className="px-5 py-2 text-gray-700 dark:text-blue-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            My Listings
                        </button>
                        <button onClick={handleStartSelling} className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                            Sell an Item
                        </button>
                         <button onClick={handleViewProfile} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-800 transition-colors">
                            <ProfileIcon className="h-6 w-6 text-gray-600 dark:text-blue-300" />
                        </button>
                        <button onClick={handleLogout} className="px-5 py-2 text-gray-700 dark:text-blue-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => openAuthModal('login')} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                            Login
                        </button>
                        <button onClick={() => openAuthModal('signup')} className="hidden md:inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                            Sign Up
                        </button>
                    </>
                )}
              </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
