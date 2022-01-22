import {
  Button,
  chakra,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import * as React from 'react';
import { useTable, useSortBy, Column, TableState } from 'react-table';
import { EditableDataItem } from '@/lib/dataItem';

export const TableContent = ({
  columns,
  data,
}: {
  columns: Column<EditableDataItem>[];
  data: any[];
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<EditableDataItem>({ columns, data }, useSortBy);

  return (
    <Table my="8" borderWidth="1px" fontSize="sm" {...getTableProps()}>
      <Thead bg={mode('gray.50', 'gray.800')}>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.id}
              >
                {column.render('Header')}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <HiArrowUp
                        aria-label="sorted descending"
                        style={{ display: 'inline' }}
                      />
                    ) : (
                      <HiArrowDown
                        aria-label="sorted ascending"
                        style={{ display: 'inline' }}
                      />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} key={cell.value}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
