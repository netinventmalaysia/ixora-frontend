export type ProjectOwner = {
  name: string;
  email: string;
  role?: string;
  project?: string;
  imageUrl: string;
  href: string;
  lastSeen?: string | null;
  lastSeenDateTime?: string;
  status?: 'Pending' | 'Approved' | 'Rejected' ;
};

export const owner: ProjectOwner[] = [
  {
    name: 'Mable Tanner',
    email: 'mable.tanner@example.com',
    project: 'Project Apollo',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    status: 'Approved',
  },
  {
    name: 'George Harrison',
    email: 'geoge.harrison@example.com',
    project: 'Pipeline X',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    status: 'Pending',
  },
  {
    name: 'Rpaul McCartney',
    email: 'rpaul@example.com',
    project: 'Project Mercury',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: null,
    status: 'Pending',
  },
];
