import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { SortingState } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/20/solid';


type DataTableProps<TData> = {
    columns: ColumnDef<TData, any>[];
    data: TData[];
};

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const exportCSV = () => {
        const csv = Papa.unparse(table.getRowModel().rows.map(row => {
            const rowData: any = {};
            row.getVisibleCells().forEach(cell => {
                rowData[cell.column.id] = cell.getValue();
            });
            return rowData;
        }));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'table.csv');
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [table.getVisibleFlatColumns().map(col => col.id)],
            body: table.getRowModel().rows.map(row =>
                row.getVisibleCells().map(cell => String(cell.getValue()))
            )

        });
        doc.save('table.pdf');
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            {/* Search and Export Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Export CSV
                    </button>
                    <button
                        onClick={exportPDF}
                        className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Export PDF
                    </button>
                </div>
            </div>


            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="p-2 text-left font-semibold cursor-pointer select-none"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* New Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                {/* Mobile view: Previous and Next buttons only */}
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {/* Desktop view: Showing text + page numbers */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{' '}
                            <span className="font-medium">
                                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{' '}
                            results
                        </p>
                    </div>
                    <div>
                        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {/* Previous */}
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="size-5" aria-hidden="true" />
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: table.getPageCount() }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => table.setPageIndex(index)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 ${table.getState().pagination.pageIndex === index
                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline-indigo-600'
                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                        }`}
                                    aria-current={table.getState().pagination.pageIndex === index ? 'page' : undefined}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            {/* Next */}
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="size-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    );
}
