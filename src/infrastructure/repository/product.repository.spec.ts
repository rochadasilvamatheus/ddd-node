import { Sequelize } from "sequelize-typescript";

describe("Product repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }, // Synchronize and create tables
    });

    afterEach(async () => {
      await sequelize.close();
    });
  }).before;
});
