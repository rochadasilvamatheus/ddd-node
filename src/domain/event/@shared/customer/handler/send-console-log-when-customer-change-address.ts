import EventHandlerInterface from "../../event-handler.interface";
import CustomerChangeAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogWhenCustomerChangedAddressHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{
  handle(event: CustomerChangeAddressEvent): void {
    console.log(
      `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`
    );
  }
}
