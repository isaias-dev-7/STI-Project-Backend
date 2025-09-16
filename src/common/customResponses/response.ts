export abstract class MyResponse {
    constructor() {}
    abstract toJSON(): any;
    abstract getCode(): number;
  }