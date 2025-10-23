'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const API = {
  guests: '/api/guests',
  parties: '/api/parties',
  assign: (partyId) => `/api/parties/${partyId}/assign`,
  unassign: '/api/guests/unassign',
  uploadCsv: '/api/upload/csv',
};

async function jsonFetch(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init && init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init && init.headers ? init.headers : {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Request ${url} → ${res.status} ${res.statusText}\n${txt}`);
  }
  return res.json();
}

export default function GuestsCRMPage() {
  const [guests, setGuests] = useState([]);
  const [parties, setParties] = useState([]);
  const [activePartyId, setActivePartyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selectedGuestIds, setSelectedGuestIds] = useState(new Set());
  const [creatingParty, setCreatingParty] = useState(false);
  const [creatingGuest, setCreatingGuest] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [gs, ps] = await Promise.all([jsonFetch(API.guests), jsonFetch(API.parties)]);
      setGuests(gs);
      setParties(ps);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadAll(); }, []);

  const counts = useMemo(() => ({
    total: guests.length,
    attending: guests.filter((g) => g.attending).length,
    withPlusOne: guests.filter((g) => g.plusOne).length,
    unassigned: guests.filter((g) => !g.partyId).length,
  }), [guests]);

  // ---------- CRUD + actions ----------
  async function addParty(input) {
    const resp = await jsonFetch(API.parties, { method: 'POST', body: JSON.stringify(input) });
    await loadAll();
    return resp.id;
  }
  async function updateParty(partyId, input) {
    await jsonFetch(`/api/parties/${partyId}`, { method: 'PATCH', body: JSON.stringify(input) });
    await loadAll();
  }
  async function deleteParty(partyId) {
    if (!confirm('Delete party? Guests will NOT be deleted; they will be unassigned.')) return;
    await jsonFetch(`/api/parties/${partyId}`, { method: 'DELETE' });
    await loadAll();
  }

  async function addGuest(input) {
    const resp = await jsonFetch(API.guests, {
      method: 'POST',
      body: JSON.stringify({
        partyId: input.partyId ?? null,
        title: input.title ?? null,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email ?? null,
        phone: input.phone ?? null,
        attending: input.attending ?? null,
        plusOne: input.plusOne ?? false,
        plusOneName: input.plusOneName ?? null,
        dietary: input.dietary ?? null,
        message: input.message ?? null,
      }),
    });
    await loadAll();
    return resp.id;
  }
  async function updateGuest(guestId, input) {
    await jsonFetch(`/api/guests/${guestId}`, { method: 'PATCH', body: JSON.stringify(input) });
    await loadAll();
  }
  async function deleteGuest(guestId) {
    if (!confirm('Delete this guest?')) return;
    await jsonFetch(`/api/guests/${guestId}`, { method: 'DELETE' });
    await loadAll();
  }
  async function assignSelectedToParty(partyId) {
    if (selectedGuestIds.size === 0) return;
    await jsonFetch(API.assign(partyId), { method: 'POST', body: JSON.stringify({ guestIds: Array.from(selectedGuestIds) }) });
    setSelectedGuestIds(new Set());
    await loadAll();
  }
  async function unassignSelected() {
    if (selectedGuestIds.size === 0) return;
    await jsonFetch(API.unassign, { method: 'POST', body: JSON.stringify({ guestIds: Array.from(selectedGuestIds) }) });
    setSelectedGuestIds(new Set());
    await loadAll();
  }
  async function uploadCSV(file) {
    const fd = new FormData();
    fd.append('file', file);
    setUploadBusy(true);
    try {
      await jsonFetch(API.uploadCsv, { method: 'POST', body: fd });
      await loadAll();
      alert('Upload complete');
    } catch (e) {
      alert(e.message || 'Upload failed');
    } finally {
      setUploadBusy(false);
    }
  }
  function toggleSelect(guestId) {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(guestId)) next.delete(guestId); else next.add(guestId);
      return next;
    });
  }

  // ---------- TanStack: columns + table ----------
  const columnHelper = createColumnHelper();
  const columns = useMemo(() => [
    {
      id: 'select',
      header: () => 'Sel',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedGuestIds.has(row.original.id)}
          onChange={() => toggleSelect(row.original.id)}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 48,
    },
    columnHelper.accessor(
      row => (row.displayName || (row.title ? `${row.title} ${row.firstName} ${row.lastName}` : `${row.firstName} ${row.lastName}`)),
      {
        id: 'name',
        header: 'Name',
        sortingFn: 'alphanumeric',
        cell: info => (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-xs text-gray-600">{info.row.original.phone || '—'}</div>
          </div>
        ),
      }
    ),
    columnHelper.accessor('partyLabel', {
      header: 'Party',
      cell: info => info.getValue() || '—',
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue() || '—',
      sortingFn: 'alphanumeric',
    }),

    columnHelper.accessor('attending', {
      header: 'Attending',
      cell: info => (info.getValue() === null ? '—' : info.getValue() ? 'Yes' : 'No'),
      sortingFn: (rowA, rowB, colId) => {
        const a = rowA.getValue(colId); const b = rowB.getValue(colId);
        const score = v => (v === true ? 2 : v === false ? 1 : 0);
        return score(a) - score(b);
      },
    }),
    columnHelper.accessor('plusOne', {
      header: '+1',
      cell: info => {
        const g = info.row.original;
        return g.plusOne ? (g.plusOneName ? `Yes (${g.plusOneName})` : 'Yes') : 'No';
      },
      sortingFn: 'basic',
    }),
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => startEdit(row.original)}
            className="px-2 py-1 rounded border border-gray-600 text-xs hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => deleteGuest(row.original.id)}
            className="px-2 py-1 rounded border border-red-600 text-xs text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [selectedGuestIds]);

  // global filter: include title too
  const globalFilterFn = (row, columnId, filterValue) => {
    const q = String(filterValue || '').normalize('NFKD').toLowerCase().trim();
    if (!q) return true;
    const g = row.original;
    const hay = `${g.title || ''} ${g.firstName} ${g.lastName} ${g.displayName || ''} ${g.email || ''} ${g.partyLabel || ''}`.toLowerCase();
    return hay.includes(q);
  };

  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);

  // Build members map (partyId -> guests[])
  const membersByPartyId = useMemo(() => {
    const map = new Map();
    for (const g of guests) {
      if (!g.partyId) continue;
      if (!map.has(g.partyId)) map.set(g.partyId, []);
      map.get(g.partyId).push(g);
    }
    return map;
  }, [guests]);

  // Optional party filter for the Guests table
  const filteredGuests = useMemo(() => {
    if (activePartyId == null) return guests;
    return guests.filter(g => g.partyId === activePartyId);
  }, [guests, activePartyId]);

  const table = useReactTable({
    data: filteredGuests,
    columns,
    state: {
      sorting,
      globalFilter: q,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQ,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: false,
  });

  // inline editor state
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  function startEdit(g) {
    setEditId(g.id);
    setForm({
      title: g.title ?? '',
      firstName: g.firstName,
      lastName: g.lastName,
      email: g.email ?? '',
      phone: g.phone ?? '',
      attending: g.attending,
      plusOne: g.plusOne,
      plusOneName: g.plusOneName ?? '',
      dietary: g.dietary ?? '',
      message: g.message ?? '',
      partyId: g.partyId ?? null,
    });
  }
  async function saveEdit() {
    if (editId == null) return;
    await updateGuest(editId, form);
    setEditId(null);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white text-gray-900">
      <h1 className="text-2xl font-semibold">Guests & Parties Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="Total Guests" value={counts.total} />
        <Stat title="Attending" value={counts.attending} />
        <Stat title="Plus Ones Allowed" value={counts.withPlusOne} />
        <Stat title="Unassigned" value={counts.unassigned} />
      </div>

      {/* Top bar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2">
          <button onClick={loadAll} className="px-3 py-2 rounded bg-gray-900 text-white hover:bg-black">Refresh</button>
          <button onClick={() => setCreatingParty(true)} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ New Party</button>
          <button onClick={() => setCreatingGuest(true)} className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">+ New Guest</button>
          <CSVUpload onUpload={uploadCSV} busy={uploadBusy} />
          {activePartyId != null && (
            <button onClick={() => setActivePartyId(null)} className="px-3 py-2 rounded border border-gray-600 hover:bg-gray-100">
              Clear party filter
            </button>
          )}
        </div>
        <input
          className="border border-gray-400 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
          placeholder="Search name/email/party…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-gray-300 bg-white shadow-sm lg:col-span-1">
          <div className="p-4 flex items-center justify-between bg-gray-100 border-b border-gray-300 rounded-t-lg">
            <div className="font-semibold">Parties</div>
            <button onClick={() => setCreatingParty(true)} className="text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ New</button>
          </div>
          <div className="overflow-auto">
            {parties.map((p) => (
              <PartyRow
                key={p.id}
                party={p}
                members={membersByPartyId.get(p.id) ?? []}
                onUpdate={updateParty}
                onDelete={deleteParty}
                onAssign={() => assignSelectedToParty(p.id)}
                onFilter={() => setActivePartyId(p.id)}
                onClearFilter={() => setActivePartyId(null)}
                isActive={activePartyId === p.id}
                selectedCount={selectedGuestIds.size}
              />
            ))}
            {parties.length === 0 && <div className="p-4 text-sm text-gray-600">No parties yet.</div>}
          </div>
        </div>

        <div className="rounded-lg border border-gray-300 bg-white shadow-sm lg:col-span-2">
          <div className="p-4 flex items-center justify-between bg-gray-100 border-b border-gray-300 rounded-t-lg">
            <div className="font-semibold">
              Guests {activePartyId != null && (
                <span className="ml-2 text-xs px-2 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  filtered by party #{activePartyId}
                </span>
              )}
            </div>
            <button
              disabled={selectedGuestIds.size === 0}
              onClick={unassignSelected}
              className="text-sm px-3 py-2 rounded border border-gray-600 disabled:opacity-60 hover:bg-gray-100"
            >
              Unassign Selected
            </button>
          </div>

          {/* TanStack Table */}
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white sticky top-0">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          className={`p-2 text-left ${canSort ? 'cursor-pointer select-none' : ''}`}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          title={canSort ? 'Click to sort' : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort ? (
                            <span className="ml-1">{sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''}</span>
                          ) : null}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  const isEditingThisRow = row.original.id === editId;
                  return (
                    <React.Fragment key={row.id}>
                      <tr className="border-t border-gray-200 hover:bg-gray-100">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-2 align-top border-t border-gray-200">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>

                      {isEditingThisRow && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="p-4 border-t border-gray-300">
                            <div className="font-medium mb-2">Edit Guest</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                className="border border-gray-400 rounded px-2 py-1"
                                placeholder="Title (Mr, Ms, Dr…)"
                                value={form.title || ''}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                              />
                              <input
                                className="border border-gray-400 rounded px-2 py-1"
                                placeholder="First name"
                                value={form.firstName || ''}
                                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                              />
                              <input
                                className="border border-gray-400 rounded px-2 py-1"
                                placeholder="Last name"
                                value={form.lastName || ''}
                                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                              />
                              <input
                                className="border border-gray-400 rounded px-2 py-1"
                                placeholder="Email"
                                value={form.email || ''}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                              />
                              <input
                                className="border border-gray-400 rounded px-2 py-1"
                                placeholder="Phone"
                                value={form.phone || ''}
                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                              />
                              <select
                                className="border border-gray-400 rounded px-2 py-1"
                                value={String(form.attending)}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    attending:
                                      e.target.value === 'true' ? true
                                        : e.target.value === 'false' ? false
                                        : null
                                  }))
                                }
                              >
                                <option value="null">Attending? —</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
                              <select
                                className="border border-gray-400 rounded px-2 py-1"
                                value={String(form.plusOne)}
                                onChange={(e) => setForm((f) => ({ ...f, plusOne: e.target.value === 'true' }))}
                              >
                                <option value="false">Plus One: No</option>
                                <option value="true">Plus One: Yes</option>
                              </select>
                              <input
                                className="border border-gray-400 rounded px-2 py-1 md:col-span-3"
                                placeholder="Plus one name"
                                value={form.plusOneName || ''}
                                onChange={(e) => setForm((f) => ({ ...f, plusOneName: e.target.value }))}
                              />
                              <input
                                className="border border-gray-400 rounded px-2 py-1 md:col-span-3"
                                placeholder="Dietary"
                                value={form.dietary || ''}
                                onChange={(e) => setForm((f) => ({ ...f, dietary: e.target.value }))}
                              />
                              <textarea
                                className="border border-gray-400 rounded px-2 py-1 md:col-span-3"
                                placeholder="Message"
                                value={form.message || ''}
                                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                              />
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button onClick={saveEdit} className="px-3 py-2 rounded bg-gray-900 text-white hover:bg-black">
                                Save
                              </button>
                              <button onClick={() => setEditId(null)} className="px-3 py-2 rounded border border-gray-600 hover:bg-gray-100">
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {table.getRowModel().rows.length === 0 && (
                  <tr><td colSpan={columns.length} className="p-4 text-center text-gray-600">No guests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {creatingParty && (
        <PartyModal
          onClose={() => setCreatingParty(false)}
          onSave={async (payload) => { await addParty(payload); setCreatingParty(false); }}
        />
      )}
      {creatingGuest && (
        <GuestModal
          parties={parties}
          onClose={() => setCreatingGuest(false)}
          onSave={async (payload) => { await addGuest(payload); setCreatingGuest(false); }}
        />
      )}

      {loading && <div className="fixed bottom-4 right-4 text-sm px-3 py-2 bg-gray-900 text-white rounded">Loading…</div>}
    </div>
  );
}

function PartyRow({
  party,
  members = [],
  onUpdate,
  onDelete,
  onAssign,
  selectedCount,
  onFilter,
  onClearFilter,
  isActive,
}) {
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    label: party.label ?? '',
    inviteCode: party.inviteCode ?? '',
    notes: party.notes ?? ''
  });

  const normalize = (v) => {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s === '' ? null : s;
  };

  const handleSave = async () => {
    const payload = {
      label: normalize(form.label),
      inviteCode: normalize(form.inviteCode),
      notes: normalize(form.notes)
    };
    await onUpdate(party.id, payload);
    setEditing(false);
  };

  return (
    <div className="p-3">
      {editing ? (
        <div className="space-y-2">
          <input className="w-full border border-gray-400 rounded px-2 py-1"
                 placeholder="Label"
                 value={form.label}
                 onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          <input className="w-full border border-gray-400 rounded px-2 py-1"
                 placeholder="Invite code"
                 value={form.inviteCode}
                 onChange={(e) => setForm((f) => ({ ...f, inviteCode: e.target.value }))} />
          <textarea className="w-full border border-gray-400 rounded px-2 py-1"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleSave}
                    className="px-3 py-2 rounded bg-gray-900 text-white hover:bg-black">Save</button>
            <button onClick={() => setEditing(false)}
                    className="px-3 py-2 rounded border border-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full text-left"
            title="Click to toggle members"
          >
            <div className="font-medium flex items-center justify-between">
              <span>{party.label ?? '(no label)'}</span>
              <span className="text-xs text-gray-600">
                {members.length} member{members.length === 1 ? '' : 's'} {open ? '▴' : '▾'}
              </span>
            </div>
          </button>
          <div className="text-xs text-gray-600">Code: {party.inviteCode ?? '—'}</div>
          {party.notes && <div className="text-xs text-gray-600">{party.notes}</div>}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(true)}
                    className="text-sm px-3 py-1 rounded border border-gray-600 hover:bg-gray-100">Edit</button>
            <button onClick={() => onDelete(party.id)}
                    className="text-sm px-3 py-1 rounded border border-red-600 text-red-700 hover:bg-red-50">Delete</button>
            <button disabled={selectedCount === 0} onClick={onAssign}
                    className="text-sm px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-60 hover:bg-emerald-700">
              Assign {selectedCount ? `(${selectedCount})` : ''}
            </button>
            {!isActive ? (
              <button
                onClick={onFilter}
                className="text-sm px-3 py-1 rounded border border-blue-600 text-blue-700 hover:bg-blue-50"
                title="Filter Guests table to this party"
              >
                Filter Guests
              </button>
            ) : (
              <button
                onClick={onClearFilter}
                className="text-sm px-3 py-1 rounded border border-gray-600 hover:bg-gray-100"
                title="Clear Guests table filter"
              >
                Clear filter
              </button>
            )}
          </div>

          {open && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              {members.length === 0 ? (
                <div className="text-xs text-gray-600">No members yet.</div>
              ) : (
                <ul className="space-y-1">
                  {members.map(m => (
                    <li key={m.id} className="text-sm flex items-center justify-between">
                      <span>
                        {m.displayName
                          || (m.title ? `${m.title} ${m.firstName} ${m.lastName}` : `${m.firstName} ${m.lastName}`)}
                        {m.plusOne ? (m.plusOneName ? ` • +1 (${m.plusOneName})` : ' • +1') : ''}
                      </span>
                      <span className="text-xs text-gray-600">
                        {m.attending === true ? 'Attending'
                          : m.attending === false ? 'Not attending'
                          : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CSVUpload({ onUpload, busy }) {
  const [file, setFile] = useState(null);
  return (
    <div className="flex items-center gap-2">
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
      <button disabled={!file || busy} onClick={() => file && onUpload(file)} className="px-3 py-2 rounded bg-purple-700 text-white disabled:opacity-60 hover:bg-purple-800">
        {busy ? 'Uploading…' : 'Upload CSV'}
      </button>
    </div>
  );
}

function PartyModal({ onClose, onSave }) {
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal onClose={onClose} title="Create Party">
      <div className="space-y-2">
        <input className="w-full border border-gray-400 rounded px-2 py-1" placeholder="Label (e.g. Nimako Family)" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input className="w-full border border-gray-400 rounded px-2 py-1" placeholder="Invite code (optional)" value={code} onChange={(e) => setCode(e.target.value)} />
        <textarea className="w-full border border-gray-400 rounded px-2 py-1" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <button className="px-3 py-2 rounded border border-gray-600 hover:bg-gray-100" onClick={onClose}>Cancel</button>
        <button className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700" disabled={busy}
          onClick={async () => { setBusy(true); await onSave({ label, inviteCode: code || undefined, notes: notes || undefined }); setBusy(false); }}>
          Create
        </button>
      </div>
    </Modal>
  );
}

function GuestModal({ parties, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [partyId, setPartyId] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal onClose={onClose} title="Create Guest">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input className="border border-gray-400 rounded px-2 py-1" placeholder="Title (Mr, Ms, Dr…)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border border-gray-400 rounded px-2 py-1" placeholder="First name" value={firstName} onChange={(e) => setFirst(e.target.value)} />
        <input className="border border-gray-400 rounded px-2 py-1" placeholder="Last name" value={lastName} onChange={(e) => setLast(e.target.value)} />
        <input className="border border-gray-400 rounded px-2 py-1 md:col-span-2" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="border border-gray-400 rounded px-2 py-1 md:col-span-2" value={partyId === '' ? '' : String(partyId)} onChange={(e) => setPartyId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">No party (unassigned)</option>
          {parties.map((p) => (<option key={p.id} value={p.id}>{p.label ?? `Party ${p.id}`}</option>))}
        </select>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <button className="px-3 py-2 rounded border border-gray-600 hover:bg-gray-100" onClick={onClose}>Cancel</button>
        <button className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60 hover:bg-green-700" disabled={(!firstName && !lastName) || busy}
          onClick={async () => { setBusy(true); await onSave({ title: title || null, firstName: firstName || null, lastName: lastName || null, email: email || null, partyId: partyId === '' ? null : Number(partyId) }); setBusy(false); }}>
          Create
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children, title, onClose }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl rounded-lg bg-white shadow-xl border border-gray-300">
        <div className="p-4 border-b border-gray-300 bg-gray-100 flex items-center justify-between rounded-t-lg">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded border border-gray-600 hover:bg-gray-100">Close</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="text-gray-600 text-xs uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
