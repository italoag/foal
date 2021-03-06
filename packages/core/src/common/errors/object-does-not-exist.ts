export class ObjectDoesNotExist extends Error {
  readonly isObjectDoesNotExist = true;

  constructor(public content?: any) {
    super();
    Object.setPrototypeOf(this, ObjectDoesNotExist.prototype);
  }
}

export function isObjectDoesNotExist(err: object): err is ObjectDoesNotExist {
  return err instanceof ObjectDoesNotExist || (err as any).isObjectDoesNotExist === true;
}
