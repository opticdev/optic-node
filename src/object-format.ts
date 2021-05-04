import { toHash } from 'shape-hash'

interface ObjectShape {
    shapeHashV1Base64: string | null,
    asJsonString: Object | null,
    asText: string | null,
  }

export default (Obj: object | string): ObjectShape => {
  return {
    shapeHashV1Base64: toHash(Obj),
    asJsonString: Obj,
    asText: JSON.stringify(Obj)
  }
}
