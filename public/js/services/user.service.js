export const userService = {
    login,
    logout,
    signup,
    getLoggedInUser,
    query,
    remove,
    getById,
}

const STORAGE_KEY = 'loggedinUser'

function login(credentials) {
    return axios
        .post('/api/login', credentials)
        .then((res) => res.data)
        .then((user) => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
        })
}

function signup(signupInfo) {
    return axios
        .post('/api/signup', signupInfo)
        .then((res) => res.data)
        .then((user) => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
        })
}

function logout() {
    // sessionStorage.removeItem(STORAGE_KEY)
    // return axios.post('/api/logout')
    return axios.post(`/api/logout`).then(() => {
        sessionStorage.removeItem(STORAGE_KEY)
    })
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}

function query() {
    return axios.get('/api/user').then((res) => res.data)
}

function remove(userId) {
    return axios.delete('/api/user/' + userId)
        .then((res) => res.data)
}

function getById(userId) {
    return axios.get('/api/user/' + userId)
        .then((res) => res.data)
}
