import { IEntidade } from "./IEntidade";

export class Cliente extends IEntidade {
  name: string;
  email: string;

  constructor(name: string, email: string, id?: number) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
  }
}