// let PREFIX = 'http://taxonomy.postech.ac.kr:8787'
let PREFIX = 'http://10.10.30.91:8787'

export async function deleteAssignResult(dataId) {
    const url = PREFIX + `/jobs/${dataId}`
    return fetch(url, {
        method: 'DELETE'
    })
}

export async function getAssignResult() {
    const url = PREFIX + `/list`
    return fetch(url)
        .then(res => res.json())
}

export async function appendJob(data) {
    const url = PREFIX + `/jobs`
    const formData = new FormData()
    formData.append('taskname', data.taskname)
    formData.append('primerseq', data.primerseq)
    formData.append('matchoption', data.match_option)
    formData.append('taxalg', data.taxalg)
    formData.append('rdpdb', data.rdpdb)
    formData.append('conflevel', data.conflevel)
    formData.append('trlen', data.trlen)
    formData.append('filepaths', data.filepaths)
    return fetch(url, {
        method: 'POST',
        body: formData,
    })
}

export const uploaderUrl = PREFIX + `/upload`
export const downloadUrl = PREFIX + `/download`