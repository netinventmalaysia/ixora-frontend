import { ColumnDef } from '@tanstack/react-table';

export type DummyUser = {
    name: string;
    email: string;
    role: string;
};

export const userColumns: ColumnDef<DummyUser>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
];

export const userData: DummyUser[] = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer' },
    { name: 'Emily Brown', email: 'emily@example.com', role: 'Admin' },
    { name: 'Sarah Connor', email: 'sarah@example.com', role: 'Editor' },
    { name: 'Kyle Reese', email: 'kyle@example.com', role: 'Viewer' },
];
