import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../../../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }, // Synchronize and create tables
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1",
      price: 100,
    });
  });

  it("should throw an error when database connection fails during product creation", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    // Mock the database call to simulate a failure (database error)
    jest
      .spyOn(ProductModel, "create")
      .mockRejectedValueOnce(new Error("Database connection failed"));

    // Silence console.error to prevent unwanted logging during test execution
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Expect the create method to reject with the appropriate error message
    await expect(productRepository.create(product)).rejects.toThrow(
      "Failed to create product: Database connection failed"
    );

    // Restore console.error after the test to avoid side effects
    consoleErrorSpy.mockRestore();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1",
      price: 100,
    });

    product.changeName("Product 2");
    product.changePrice(200);

    await productRepository.update(product);

    const updatedProductModel = await ProductModel.findOne({
      where: { id: "1" },
    });

    expect(updatedProductModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 2",
      price: 200,
    });
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    const foundProduct = await productRepository.find("1");

    expect(productModel.toJSON()).toStrictEqual({
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price,
    });
  });

  it("should find all products", async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const allProducts = await productRepository.findAll();
    const products = [product1, product2];

    expect(products).toEqual(allProducts);
  });
});
