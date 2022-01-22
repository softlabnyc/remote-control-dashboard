import { Prisma } from '@prisma/client';

export interface DataItem {
  name: string;
  value: Prisma.JsonValue;
}

export interface EditableDataItem {
  name: string;
  value: Prisma.JsonValue;
  type: 'number' | 'boolean' | 'string' | 'object' | 'array' | 'null';
  editableValue: string | number | boolean | null;
  editableType: 'number' | 'boolean' | 'string' | 'object' | 'null';
}

export interface CastDataItem {
  name: string;
  editableValue: string | number | boolean | null;
  editableType: 'number' | 'boolean' | 'string' | 'object' | 'null';
}

export const unmarshall = ({ name, value }: DataItem): EditableDataItem => {
  if (value === null) {
    return {
      name,
      value,
      type: 'null',
      editableValue: null,
      editableType: 'null',
    };
  }
  switch (typeof value) {
    case 'number':
      return {
        name,
        value,
        type: 'number',
        editableValue: String(value),
        editableType: 'number',
      };
    case 'boolean':
      return {
        name,
        value,
        type: 'boolean',
        editableValue: String(value),
        editableType: 'boolean',
      };
    case 'string':
      return {
        name,
        value,
        type: 'string',
        editableValue: value,
        editableType: 'string',
      };
  }
  return {
    name,
    value,
    type: Array.isArray(value) ? 'array' : 'object',
    editableValue: JSON.stringify(value),
    editableType: 'object',
  };
};

export const marshall = ({
  name,
  editableType,
  editableValue,
  value,
}: EditableDataItem): DataItem => {
  return {
    name,
    value,
  };
};

export const fromCastDataItem = ({
  name,
  editableType,
  editableValue,
}: CastDataItem): EditableDataItem => {
  switch (editableType) {
    case 'null':
    case 'number':
    case 'boolean':
    case 'string':
      return unmarshall({
        name,
        value: editableValue,
      });
  }
  return unmarshall({
    name,
    value: JSON.parse(editableValue as string),
  });
};

export const fromData = (data: Prisma.JsonObject): DataItem[] =>
  Object.keys(data)
    .filter((key) => typeof data[key] !== 'undefined')
    .map((key) => ({ name: key, value: data[key]! }));
