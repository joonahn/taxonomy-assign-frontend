export const primerseq_option = [{
        key: 'Archaea',
        text: 'Archaea',
        value: 'arc'
    },
    {
        key: 'Bacteria',
        text: 'Bacteria',
        value: 'bac'
    },
    {
        key: 'Prokaryotes',
        text: 'Prokaryotes',
        value: 'pro'
    }
]

export const taxalg_options = [{
        key: 'RDP',
        text: 'RDP',
        value: 'rdp'
    },
    {
        key: 'BLAST',
        text: 'BLAST',
        value: 'blast'
    },
    {
        key: 'UCLUST',
        text: 'UCLUST',
        value: 'uclust'
    },
]

export const rdpdb_options = [{
        key: 'greengenes',
        text: 'greengenes',
        value: 'greengenes'
    },
    {
        key: 'silva',
        text: 'silva',
        value: 'silva'
    },
    {
        key: 'unite',
        text: 'unite',
        value: 'unite'
    },
]

export const conflevel_options = [{
        key: '0.9',
        text: '0.9',
        value: '0.9'
    },
    {
        key: '0.8',
        text: '0.8',
        value: '0.8'
    },
    {
        key: '0.7',
        text: '0.7',
        value: '0.7'
    },
    {
        key: '0.6',
        text: '0.6',
        value: '0.6'
    },
    {
        key: '0.5',
        text: '0.5',
        value: '0.5'
    },
    {
        key: '0.4',
        text: '0.4',
        value: '0.4'
    },
    {
        key: '0.3',
        text: '0.3',
        value: '0.3'
    },
    {
        key: '0.2',
        text: '0.2',
        value: '0.2'
    },
    {
        key: '0.1',
        text: '0.1',
        value: '0.1'
    },
]

export const trlen_options = [{
        id: 'nt',
        value: '-1',
        text: 'Not truncate'
    },
    {
        id: '200',
        value: '200',
        text: '200bp'
    },
    {
        id: '250',
        value: '250',
        text: '250bp'
    },
]

export const defaultTaxonomyOptions = {
    taskname: '',
    primerseq: 'bac',
    match_option: ["fwd"],
    taxalg: 'rdp',
    rdpdb: 'greengenes',
    conflevel: '0.2',
    trlen: '-1',
}