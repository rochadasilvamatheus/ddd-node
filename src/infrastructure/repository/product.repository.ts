import Product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
  async create(entity: Product): Promise<void> {
    if (!entity.isValid()) {
      throw new Error("Invalid product data");
    }

    try {
      const createdProduct = await ProductModel.create({
        id: entity.id,
        name: entity.name,
        price: entity.price,
      });
    } catch (error: unknown) {
      // Log the original error for debugging
      console.error("Error occurred while creating the product:", error);

      if (error instanceof Error) {
        // Throw an error with a clear message and include the original error's details
        throw new Error(`Failed to create product: ${error.message}`);
      } else {
        // If the error is not an instance of Error, throw a generic error message
        throw new Error("Failed to create product: Unknown error");
      }
    }
  }

  async update(entity: Product): Promise<void> {
    await ProductModel.update(
      {
        name: entity.name,
        price: entity.price,
      },
      {
        where: { id: entity.id },
      }
    );
  }

  async find(id: string): Promise<Product> {
    const productModel = await ProductModel.findOne({ where: { id } });

    if (!productModel) {
      throw new Error(`Product with id ${id} not found.`);
    }

    return new Product(productModel.id, productModel.name, productModel.price);
  }

  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.findAll();
    return productModels.map(
      (productModel) =>
        new Product(productModel.id, productModel.name, productModel.price)
    );
  }
}
