import Notification from "../notification/notification";

export default abstract class Entity {
  protected _id: string;
  public _notification: Notification;

  constructor() {
    this._notification = new Notification();
  }

  get id(): string {
    return this._id;
  }
}
