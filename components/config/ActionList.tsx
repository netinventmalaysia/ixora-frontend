export const RegistrationApplicationActions = [
    {
        label: 'Edit',
        onClick: (item : any) => console.log('Edit', item),
    },
    {
        label: 'Withdraw',
        onClick: (item : any) => console.log(`Withdraw ${item.name}`),
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

export const MySkbActions = [
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
    {
        label: 'Withdraw',
        onClick: (item : any) => alert(`Withdraw ${item.name}`),
        danger: true,
    }
]