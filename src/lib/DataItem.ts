import { Prisma } from '@prisma/client';

export interface DataItem {
  name: string;
  value: Prisma.JsonValue;
}

export interface EditableDataItem {
  name: string;
  value: string | number | boolean | null;
  type: 'number' | 'boolean' | 'string' | 'object' | 'null';
}

export const unmarshall = ({ name, value }: DataItem): EditableDataItem => {
  if (value === null) {
    return {
      name,
      value: null,
      type: 'null',
    };
  }
  switch (typeof value) {
    case 'number':
      return {
        name,
        value: String(value),
        type: 'number',
      };
    case 'boolean':
      return {
        name,
        value: String(value),
        type: 'boolean',
      };
    case 'string':
      return {
        name,
        value: value,
        type: 'string',
      };
  }
  return {
    name,
    value: JSON.stringify(value),
    type: 'object',
  };
};

export const marshall = ({ name, value, type }: EditableDataItem): DataItem => {
  switch (type) {
    case 'null':
    case 'number':
    case 'boolean':
    case 'string':
      return {
        name,
        value,
      };
  }
  return {
    name,
    value: JSON.parse(value as string),
  };
};

export const fromData = (data: Prisma.JsonObject): DataItem[] =>
  Object.keys(data)
    .filter((key) => typeof data[key] !== 'undefined')
    .map((key) => ({ name: key, value: data[key]! }));
