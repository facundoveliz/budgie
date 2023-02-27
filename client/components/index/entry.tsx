import React, { useState } from 'react';
import { NextPage } from 'next';
import dateFormat from 'dateformat';
import Modal from '../modals/editEntry';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

type EntryType = {
  _id: string;
  category: string;
  type: boolean;
  amount: number;
  created: Date;
};

type EntryProps = {
  entries: EntryType[];
  getEntryRequest: () => Promise<void>;
  getUserRequest: () => Promise<void>;
};

type SelectedEditProps = {
  id: string;
  category: string;
  amount: number;
  type: boolean;
};

const columnHelper = createColumnHelper<EntryType>();

const columns = [
  columnHelper.accessor('category', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created', {
    cell: (info) => info.getValue(),
  }),
];

const Entry: NextPage<EntryProps> = function Entry({
  entries,
  getEntryRequest,
  getUserRequest,
}: EntryProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEdit, setSelectedEdit] = useState<SelectedEditProps>({
    id: '',
    category: '',
    amount: 0,
    type: true,
  });

  const [sorting, setSorting] = React.useState([]);
  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <EntriesWrapper>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <>
        {showModal ? (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedEdit={selectedEdit}
            getEntryRequest={getEntryRequest}
            getUserRequest={getUserRequest}
          />
        ) : null}
      </>
    </EntriesWrapper>
  );
};

export default Entry;

type EntryStyleProps = {
  readonly type?: boolean;
};

// FIX: make a softer bg
const EntryWrapper = styled.div<EntryStyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${({ theme }) => theme.paddings.dashboard};
  border-radius: ${({ theme }) => theme.borders.radius};
  border-bottom: 1px solid ${({ theme }) => theme.border} !important;
  &:hover {
    background: ${({ theme }) => theme.background};
  }
`;

const EntriesWrapper = styled.div<EntryStyleProps>`
  background: ${({ theme }) => theme.backgroundSoft};
`;

export const ParagraphWrapper = styled.div`
  display: flex;
`;

export const Paragraph = styled.p<EntryStyleProps>`
  color: ${(props) =>
    props.type ? ({ theme }) => theme.primary : ({ theme }) => theme.danger};
  &:last-of-type {
    font-size: 14px;
    color: ${({ theme }) => theme.foreground};
    float: right;
  }
`;
