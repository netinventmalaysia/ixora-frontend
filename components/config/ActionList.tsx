export const RegistrationApplicationActions = [
    {
        label: 'Edit',
        onClick: (item : any) => console.log('Edit', item),
    },
    {
        label: 'Withdraw',
        onClick: (item : any) => alert(`Withdraw ${item.name}`),
    },
];


export const BillingActions = [
    {
        label: 'View',
        onClick: (item : any) => console.log('View', item),
    },
    {
        label: 'Download',
        onClick: (item : any) => alert(`Download ${item.name}`),
    },
    {
        label: 'Pay',
        onClick: (item : any) => alert(`Pay ${item.name}`),
    },
]