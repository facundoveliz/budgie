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
    header: 'CATEGORY',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'TYPE',
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor('amount', {
    header: 'AMOUNT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created', {
    header: 'CREATED',
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
                          asc: '🔼',
                          desc: '🔽',
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
      <Pagination className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <p>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
        </span>
        <div>
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
        </div>
      </Pagination>
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

const EntriesWrapper = styled.div<EntryStyleProps>`
  table {
    background: ${({ theme }) => theme.backgroundSoft};
    padding: ${({ theme }) => theme.paddings.dashboard};
    border-radius: ${({ theme }) => theme.borders.radius};
    width: 100%;
    table-layout: fixed;
    @media (max-width: 650px) {
      padding: ${({ theme }) => theme.paddings.dashboard} 12px;
    }
    thead {
      text-align: left;
      th {
        &::-webkit-scrollbar {
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: ${({ theme }) => theme.border};
        }
        padding-bottom: 12px;
        border-bottom: 1px solid ${({ theme }) => theme.border};
        overflow: hidden;
        cursor: pointer;
        user-select: none;
      }
    }
    tbody {
      td {
        padding: 8px 0;
        overflow: auto;
        white-space: nowrap;
        border-bottom: 1px solid ${({ theme }) => theme.border};
        &::-webkit-scrollbar {
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: ${({ theme }) => theme.border};
        }
      }
    }
  }
`;

const Pagination = styled.div<EntryStyleProps>`
  display: flex;
  gap: 12px;
  padding: 8px;
  color: ${({ theme }) => theme.foregroundSoft};
  div {
    display: flex;
    gap: 8px;
    button {
      color: ${({ theme }) => theme.foregroundSoft};
      border-radius: ${({ theme }) => theme.borders.radius};
      border: 0;
      font-size: 17px;
      &:enabled {
        background: ${({ theme }) => theme.backgroundSoft};
      }
      &:disabled {
        background: ${({ theme }) => theme.background};
      }
    }
  }
`;
