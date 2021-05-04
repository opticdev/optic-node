import { toHash } from 'shape-hash'
export interface ValueShape {
    shapeHashV1Base64: string | null,
    asJsonString: Object | null,
    asText: string | null,
  }

export interface ObjectShape {
    uuid: string,
    request: {
      host: string,
      method: string,
      path: string,
      query:  ValueShape,
      headers: ValueShape,
      body: {
        contentType: string,
        value: ValueShape,
      }
    },
    response: {
      statusCode: number,
      headers: ValueShape,
      body: {
        contentType: string,
        value: ValueShape,
      }
    },
    tags: Array<string>
  }

export default (Obj: object | string): ValueShape => {
  return {
    shapeHashV1Base64: toHash(Obj),
    asJsonString: Obj,
    asText: JSON.stringify(Obj)
  }
}
