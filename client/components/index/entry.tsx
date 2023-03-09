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
    cell: (info) => (info.getValue() ? 'Income' : 'Expense'),
  }),
  columnHelper.accessor('amount', {
    header: 'AMOUNT',
    cell: (info) =>
      info.getValue() > 0 ? (
        <Income>${info.getValue()}</Income>
      ) : (
        <Expense>${info.getValue()}</Expense>
      ),
  }),
  columnHelper.accessor('created', {
    header: 'CREATED',
    cell: (info) => dateFormat(info.getValue(), 'HH:MM, mmmm d, yy'),
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
                          asc: '↑',
                          desc: '↓',
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
                <tr
                  key={row.id}
                  onClick={() => {
                    setSelectedEdit({
                      id: row.original._id,
                      category: row.original.category,
                      amount: row.original.amount,
                      type: row.original.type,
                    });
                    setShowModal((prev) => !prev);
                    console.log(row);
                  }}
                >
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
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
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
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
  }
  table {
    border-radius: ${({ theme }) => theme.borders.radius};
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
    thead {
      text-align: left;
      color: ${({ theme }) => theme.foregroundSofter};
      th {
        font-weight: 400;
        font-size: 15px;
        &::-webkit-scrollbar {
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: ${({ theme }) => theme.border};
        }
        padding: 18px 12px 0 12px;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
      }
    }
    tbody {
      tr {
        background: ${({ theme }) => theme.backgroundSoft};
        &:hover {
          background: ${({ theme }) => theme.backgroundSofter};
        }
      }
      td {
        padding: 16px;
        overflow: auto;
        white-space: nowrap;
        cursor: pointer;
        &:first-child {
          -moz-border-radius: 8px 0 0 8px;
          -webkit-border-radius: 8px 0 0 8px;
        }
        &:last-child {
          -moz-border-radius: 0 8px 8px 0;
          -webkit-border-radius: 0 8px 8px 0;
        }
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

const Income = styled.div<EntryStyleProps>`
  color: ${({ theme }) => theme.positive};
`;
const Expense = styled.div<EntryStyleProps>`
  color: ${({ theme }) => theme.negative};
`;
