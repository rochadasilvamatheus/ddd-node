import Address from "../../entity/address";
import Customer from "../../entity/customer";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import CustomerChangedAddressEvent from "./customer/customer-changed-address.event";
import CustomerCreatedEvent from "./customer/customer-created.event";
import SendConsoleLogWhenCustomerChangedAddressHandler from "./customer/handler/send-console-log-when-customer-change-address";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "./customer/handler/send-console-log1-when-customer-is-created";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "./customer/handler/send-console-log2-when-customer-is-created";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register product created event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should register customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const secondEventHandler =
      new SendConsoleLog2WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(firstEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(secondEventHandler);
  });

  it("should register customer changed address event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerChangedAddressHandler();

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister product created event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const secondEventHandler =
      new SendConsoleLog2WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(firstEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(secondEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);

    eventDispatcher.unregister("CustomerCreatedEvent", firstEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(secondEventHandler);
  });

  it("should unregister customer changed address event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerChangedAddressHandler();

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length
    ).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendEmailWhenProductIsCreatedHandler();
    const eventHandler2 = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler1);
    eventDispatcher.register("ProductCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      2
    );

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify product created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // When the notify is executed the SendEmailWhenProductIsCreatedHandler.handle() should be called
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const secondEventHandler =
      new SendConsoleLog2WhenCustomerIsCreatedHandler();

    const spyEventHandler1 = jest.spyOn(firstEventHandler, "handle");
    const spyEventHandler2 = jest.spyOn(secondEventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(firstEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(secondEventHandler);

    const costumerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
    });

    // When the notify is executed the SendConsoleLogWhenCustomerIsCreatedHandler.handle() should be called
    eventDispatcher.notify(costumerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify customer changed address event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const secondEventHandler =
      new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const addressChangedEventHandler =
      new SendConsoleLogWhenCustomerChangedAddressHandler();

    const customerCreatedLog1SpyEventHandler1 = jest.spyOn(
      firstEventHandler,
      "handle"
    );
    const customerCreatedLog2SpyEventHandler2 = jest.spyOn(
      secondEventHandler,
      "handle"
    );
    const addressChangedSpyEventHandler = jest.spyOn(
      addressChangedEventHandler,
      "handle"
    );

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);
    eventDispatcher.register(
      "CustomerChangedAddressEvent",
      addressChangedEventHandler
    );

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(firstEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(secondEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(addressChangedEventHandler);

    const customer = new Customer("123", "Customer 1");
    const costumerCreatedEvent = new CustomerCreatedEvent({ customer });
    // When the notify is executed the SendConsoleLogWhenCustomerIsCreatedHandler.handle() should be called
    eventDispatcher.notify(costumerCreatedEvent);

    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      id: customer.id,
      name: customer.name,
      address: address,
    });
    eventDispatcher.notify(customerChangedAddressEvent);

    expect(customerCreatedLog1SpyEventHandler1).toHaveBeenCalled();
    expect(customerCreatedLog2SpyEventHandler2).toHaveBeenCalled();
    expect(addressChangedSpyEventHandler).toHaveBeenCalled();
  });
});
