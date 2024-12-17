export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;
  private _total: number;

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._productId = productId;
    this._quantity = quantity;
    this._total = this.orderItemTotal();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    this._quantity = newQuantity;
    this._total = this.orderItemTotal(); // Recalculate total after quantity update
  }
}
