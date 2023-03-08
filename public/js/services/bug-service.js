import { eventBus } from './eventBus-service.js'

export const bugService = {
    query,
    getById,
    getEmptyBug,
    save,
    remove,
    getBugsData,
}

const API = 'api/bug/'

function query(filterBy) {
    return axios.get(API, { params: filterBy }).then((res) => res.data)
}

function getById(bugId) {
    return axios.get(API + bugId).then((res) => res.data)
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        severity: '',
    }
}

function remove(bugId) {
    return axios
        .delete(API + bugId)
        .then((res) => res.data)
        .catch((err) => {
            if (err.response.status === 401) {
                eventBus.emit('show-msg', {
                    txt: 'Please login if you want to delete bug!',
                    type: 'error',
                })
            }
        })
}

function save(bug) {
    if (bug._id)
        return axios
            .put(API + bug._id, bug)
            .then((res) => res.data)
            .then(() =>
                eventBus.emit('show-msg', {
                    txt: 'Bug saved successfully',
                    type: 'success',
                })
            )
            .catch((err) => {
                if (err.response.status === 401) {
                    eventBus.emit('show-msg', {
                        txt: 'Please edit only your bugs!',
                        type: 'error',
                    })
                }
            })
    else return axios.post(API, bug).then((res) => res.data)
}

function getBugsData() {
    return axios.get(API + 'data').then((res) => res.data)
}
