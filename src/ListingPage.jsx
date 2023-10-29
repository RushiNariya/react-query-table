import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { getColumns } from './columns';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import DebouncedInput from './filterSearch';
import { Route, Routes, useNavigate } from 'react-router';
import DetailsPage from './DetailsPage';

function fetchData({ queryKey }) {
  return axios.get('https://63ac20c634c46cd7ae78342e.mockapi.io/articles', {
    params: {
      limit: queryKey[2],
      page: queryKey[1] + 1,
      sortBy: queryKey[3],
      order: queryKey[4] ? 'desc' : 'asc',
      search: queryKey[5] || '',
    },
  });
}

function ListingPage() {
  const [data, setData] = useState([]);
  const [index, setIndex] = React.useState(0);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const navigate = useNavigate();

  const onClickViewHandler = (id) => {
    navigate(`/details/${id}`);
  };

  const tableData = React.useMemo(() => data?.items, [data?.items]);
  const columns = React.useMemo(
    () => getColumns(index, onClickViewHandler),
    [index]
  );

  let [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  //
  const [sorting, setSorting] = React.useState([]);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const {
    isLoading,
    isError,
    data: result,
    error,
  } = useQuery(
    [
      'articles',
      pagination.pageIndex,
      pagination.pageSize,
      sorting[0]?.id,
      sorting[0]?.desc,
      globalFilter,
    ],
    fetchData,
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        setData({
          ...response.data,
          pageCount: response.data.count / pagination.pageSize,
        });

        const getIndex = () => {
          return Number(`${pagination.pageIndex * pagination.pageSize}`);
        };
        setIndex(getIndex);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil(data?.pageCount) ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    // debugTable: false,
    // debugHeaders: true,
    // debugColumns: true,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="h-100">
      {data?.items?.length ? (
        // this portiion is to hide columns ------------- starts
        <div>
          {' '}
          {/* <div className="inline-block border border-black shadow rounded">
            <div className="px-1 border-b border-black">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                  }}
                />{' '}
                Toggle All
              </label>
            </div>
            {table.getAllLeafColumns().map((column) => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      {...{
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{' '}
                    {column.id}
                  </label>
                </div>
              );
            })}
          </div> */}
          {/* this portiion is to hide columns ------------- ends */}
          <div>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
            />
          </div>
          <table className="table table-bordered">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th scope="col" key={header.id} colSpan={header.colSpan}>
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
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
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
            {/* {dataQuery.isFetching ? 'Loading...' : null} */}
          </div>
          <div>{table.getRowModel().rows.length} Rows</div>
          <div></div>
        </div>
      ) : (
        <div>no data found</div>
      )}

     
    </div>
  );
}

export default ListingPage;
