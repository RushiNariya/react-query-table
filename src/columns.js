import { createColumnHelper } from '@tanstack/react-table';

export const getColumns = (index, onClickViewHandler) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('index', {
      header: 'Index',
      cell: (info) => {
        return index + info.row.index + 1;
      },
    }),
    columnHelper.accessor('id', {
      header: 'User Id',
      cell: (info) => {
        // console.log(info);
        return info.getValue();
      },
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: () => 'Description',
      cell: (info) => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor('autherName', {
      header: () => 'Author Name',
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('publishedDate', {
      header: 'Published Date',
      // header: () => <span>published Date</span>,
    }),
    columnHelper.accessor('details', {
      header: () => 'Details',
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      enableHiding: false,
      cell: ({row}) => {
        return <button onClick={() => onClickViewHandler(row.original.id)}>details</button>
      },
    }),
  ];
};
