
export interface University {
  name: string;
  type: 'Federal' | 'State' | 'Private';
}

export interface Seller {
  id: number;
  name: string;
}

export interface User extends Seller {
  email: string;
  universityName: string;
  password?: string; // Password is optional for client-side representation
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  universityName: string;
  category: string;
  condition: 'New' | 'Used';
  seller: Seller;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// New types for direct messaging
export interface DirectMessage {
  id: number;
  conversationId: string;
  senderId: number;
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string; // Composite key: `${buyerId}-${sellerId}-${productId}`
  productId: number;
  productName: string;
  productImageUrl: string;
  buyer: Seller;
  seller: Seller;
  messages: DirectMessage[];
}
