export type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  href: string;
  lastSeen?: string | null;
  lastSeenDateTime?: string;
};

export const people: Person[] = [
  {
    id: 1,
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Administrator',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 2,
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Checker',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 3,
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Maker',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: null,
  },
];
