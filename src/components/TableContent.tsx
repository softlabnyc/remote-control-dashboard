import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import * as React from 'react';

export const TableContent = ({
  columns,
  data,
  Action,
}: {
  columns: {
    header: string;
    accessor: string;
    Cell?: (data: any) => JSX.Element;
  }[];
  data: any[];
  Action?: (row: any) => JSX.Element;
}) => {
  return (
    <Table my="8" borderWidth="1px" fontSize="sm">
      <Thead bg={mode('gray.50', 'gray.800')}>
        <Tr>
          {columns.map((column, index) => (
            <Th whiteSpace="nowrap" scope="col" key={index}>
              {column.header}
            </Th>
          ))}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => {
          return (
            <Tr key={index}>
              {columns.map((column, index) => {
                const cell = row[column.accessor as keyof typeof row];
                const element = column.Cell?.(cell) ?? cell;
                return (
                  <Td whiteSpace="nowrap" key={index}>
                    {element}
                  </Td>
                );
              })}
              {Action && <Td textAlign="right">{Action?.(row)}</Td>}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
