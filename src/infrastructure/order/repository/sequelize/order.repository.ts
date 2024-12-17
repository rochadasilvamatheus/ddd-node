import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    // Update the order itself
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );

    // Fetch existing items from the database for comparison
    const existingItems = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    // Identify items to add, update, and delete

    const itemsToAdd = entity.items.filter(
      (item) => !existingItems.some((dbItem) => dbItem.id === item.id)
    );

    const itemsToUpdate = entity.items.filter((item) =>
      existingItems.some((dbItem) => dbItem.id === item.id)
    );

    const itemsToDelete = existingItems.filter(
      (dbItem) => !entity.items.some((item) => item.id === dbItem.id)
    );

    // Add new items
    if (itemsToAdd.length > 0) {
      await OrderItemModel.bulkCreate(
        itemsToAdd.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        }))
      );
    }

    // Update existing items
    for (const item of itemsToUpdate) {
      await OrderItemModel.update(
        {
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        },
        {
          where: { id: item.id, order_id: entity.id },
        }
      );
    }

    // Delete removed items
    if (itemsToDelete.length > 0) {
      await OrderItemModel.destroy({
        where: { id: itemsToDelete.map((item) => item.id) },
      });
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id: id },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const items = orderModel.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
    );
    const order = new Order(id, orderModel.id, items);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    const orders = orderModels.map((orderModel) => {
      let items = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
      );
      let order = new Order(orderModel.id, orderModel.customer_id, items);

      return order;
    });

    return orders;
  }
}
