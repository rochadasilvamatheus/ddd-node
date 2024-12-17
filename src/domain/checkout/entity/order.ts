import OrderItem from "./order_item";

export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
  }

  addItem(item: OrderItem): void {
    this._items.push(item);
    this.adjustTotal(this.total());
  }

  removeItem(itemId: string): void {
    const index = this._items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error("Item not found in the order");
    }
    this._items.splice(index, 1);
    this.adjustTotal(this.total());
  }

  // Method in Order class to update quantity of an order item
  updateItemQuantity(itemId: string, newQuantity: number): void {
    const item = this._items.find((item) => item.id === itemId);
    if (!item) {
      throw new Error("Item not found in the order");
    }
    item.updateQuantity(newQuantity); // Delegates the quantity update to the OrderItem class
    this._total = this.total(); // Recalculate the total after the update
  }

  adjustTotal(newTotal: number): void {
    if (newTotal < 0) {
      throw new Error("Total cannot be negative");
    }
    this._total = newTotal;
  }
}
