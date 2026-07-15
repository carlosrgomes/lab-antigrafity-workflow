/**
 * Represents a game in the RetroVault catalog.
 */
export interface IGame {
  id: string;
  title: string;
  description: string;
  price: number;
  rarity: string;
  console: string;
  stock: number;
  imageUrl: string;
  screenshots: string;
}

/**
 * Represents a single item in an order.
 */
export interface IOrderItem {
  id: string;
  gameId: string;
  orderId: string;
  quantity: number;
  price: number;
  game?: IGame;
}

/**
 * Represents an order.
 */
export interface IOrder {
  id: string;
  total: number;
  status: string;
  items: IOrderItem[];
  createdAt: Date;
}

/**
 * Input format for creating an order.
 */
export interface ICreateOrderInput {
  items: {
    gameId: string;
    quantity: number;
  }[];
}
