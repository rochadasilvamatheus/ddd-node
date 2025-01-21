import { Not } from "sequelize-typescript";
import Entity from "../../@shared/entity/entity.abstract";
import Address from "../value-object/address";
import NotificationError from "../../@shared/notification/notification.error";

export default class Customer extends Entity {
  private _name: string;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this._name = name;
    this.validate();

    if (this._notification.hasErrors()) {
      throw new NotificationError(this._notification.getErrors());
    }
  }

  get name() {
    return this._name;
  }

  get address(): Address {
    return this._address;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      this._notification.addError({
        context: "customer",
        message: "Id is required",
      });
    }
    if (this._name.length === 0) {
      this._notification.addError({
        context: "customer",
        message: "Name is required",
      });
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  changeAddress(address: Address) {
    this._address = address;
    this.validate();
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
