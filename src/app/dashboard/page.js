'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';

export default function DashboardPage() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/rsvp');
            const data = await res.json();
            setData(data);
        };
        fetchData();
    }, []);


    const columnHelper = createColumnHelper()
    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('attending', {
            header: 'Attending',
            cell: info => (info.getValue() ? '✅' : '❌'),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('plusOne', {
            header: 'Plus One',
            cell: info => (info.getValue() ? '✅' : '❌'),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('plusOneName', {
            header: 'Plus One Name',
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('dietaryRestrictions', {
            header: 'Dietary Restrictions',
            cell: info => info.getValue() || '—',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('message', {
            header: 'Message',
            cell: info => info.getValue() || '—',
            footer: info => info.column.id,
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const total = data.length;
    const attending = data.filter((d) => d.attending).length;
    const plusOnes = data.filter((d) => d.plusOne).length;

    const handleDownload = async () => {
        const response = await fetch('/api/rsvp/download');

        if (!response.ok) {
            alert('Failed to download CSV');
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rsvps.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };



    return (
        <div className="p-4 space-y-6 max-w-screen-lg mx-auto bg-black">
            {/* Top Summary Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard title="Total RSVPs" value={total} />
                <SummaryCard title="Attending" value={attending} />
                <SummaryCard title="Plus Ones" value={plusOnes} />
            </div>
            <div className='flex flex-row justify-between'>
            <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
                Download CSV
            </button>

            {/* Global Filter */}
            <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full mt-4 border border-gray-200 text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="p-2 border-b cursor-pointer"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted()] ?? ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-blue-600">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-2 border-b">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div className="bg-[#d4bbff] p-4 rounded shadow text-center">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}
