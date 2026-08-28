import { createHash } from 'node:crypto';

function assertWellFormedUnicode(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new TypeError('RFC 8785 JSON strings must not contain lone surrogates');
      }
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      throw new TypeError('RFC 8785 JSON strings must not contain lone surrogates');
    }
  }
}

export function canonicalizeJson(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') {
    assertWellFormedUnicode(value);
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('RFC 8785 JSON numbers must be finite');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    const ownKeys = Reflect.ownKeys(value).filter((key) => key !== 'length');
    if (
      ownKeys.length !== value.length ||
      ownKeys.some(
        (key, index) =>
          typeof key !== 'string' || key !== String(index) || !Object.hasOwn(value, key),
      )
    ) {
      throw new TypeError(
        'RFC 8785 input must not contain sparse arrays or extra array properties',
      );
    }
    return `[${value.map((item) => canonicalizeJson(item)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError('RFC 8785 input must contain only plain JSON objects');
    }
    const ownKeys = Reflect.ownKeys(value);
    if (
      ownKeys.some(
        (key) => typeof key !== 'string' || !Object.prototype.propertyIsEnumerable.call(value, key),
      )
    ) {
      throw new TypeError('RFC 8785 input must contain only enumerable string properties');
    }
    const keys = ownKeys.sort();
    return `{${keys
      .map((key) => {
        assertWellFormedUnicode(key);
        const item = value[key];
        if (item === undefined) throw new TypeError('RFC 8785 input must not contain undefined');
        return `${JSON.stringify(key)}:${canonicalizeJson(item)}`;
      })
      .join(',')}}`;
  }
  throw new TypeError(`RFC 8785 input contains unsupported ${typeof value}`);
}

export function domainSeparatedSha256(domain, bytes) {
  if (!/^tickdeck:[a-z0-9][a-z0-9./:-]*:v1(?:[:][a-z0-9./_-]+)?$/u.test(domain)) {
    throw new TypeError(`invalid TickDeck digest domain: ${domain}`);
  }
  return `sha256:${createHash('sha256')
    .update(domain, 'utf8')
    .update(Buffer.from([0]))
    .update(bytes)
    .digest('hex')}`;
}

export function canonicalJsonDigest(domain, value) {
  return domainSeparatedSha256(domain, Buffer.from(canonicalizeJson(value), 'utf8'));
}
