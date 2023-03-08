const express = require('express')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3030
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
    const { txt, pageIdx = 0 } = req.query
    const filterBy = {
        txt,
        pageIdx,
    }

    bugService
        .query(filterBy)
        .then((bugs) => res.send(bugs))
        .catch((err) => res.status(500).send('Cannot get bugs'))
})

app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
  
    const bug = req.body
    bug.owner = loggedinUser
    bugService
        .save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(401).send('Cannot save bug'))
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')
    // const { loginToken } = req.cookies
    // console.log('nicki', loginToken)
    // if (!loginToken) return res.status(401).send('please login')

    const bug = req.body
    bugService
        .save(bug, loggedinUser)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(401).send('Cannot save bug'))
})

app.get('/api/bug/data', (req, res) => {
    bugService.getBugsData().then((data) => {
        console.log(data)
        res.send(data)
    })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    var visitedBugs = req.cookies.visitedBugs || '[]'
    var bugsIds = JSON.parse(visitedBugs)
    if (bugsIds.length >= 3) return res.status(401).send('Wait for a bit')
    if (!bugsIds.includes(bugId)) bugsIds.push(bugId)
    visitedBugs = JSON.stringify(bugsIds)
    // console.log(visitedBugs)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
    bugService
        .getById(bugId)
        .then((bug) => res.send(bug))
        .catch((err) => res.status(500).send('Cannot get bug'))
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Can`t delete bug')
  
    bugService
        .remove(bugId, loggedinUser)
        .then(() => res.send('Removed!'))
        .catch((err) => res.status(500).send('Cannot remove bug'))
})

app.post('/api/login', (req, res) => {
    const {username, password} = req.body
    const credentials = {
        username,
        password,
    }
    userService.checkLogin(credentials).then((user) => {
        if (user) {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        } else res.status(401).send('Invalid credentials')
    })
})

app.post('/api/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.post('/api/signup', (req, res) => {
    const {fullname, username, password} = req.body
    const signupInfo = {
        fullname,
        username,
        password,
    }
    userService.signup(signupInfo).then((user) => {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    })
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => res.send(users))
        .catch((err) => res.status(500).send('Cannot get users'))
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params  
    userService
        .remove(userId)
        .then(() => res.send('Removed!'))
        .catch((err) => res.status(500).send('Cannot remove user'))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService
        .getById(userId)
        .then((user) => res.send(user))
        .catch((err) => res.status(500).send('Cannot get user'))
})

app.listen(port, () => {
    console.log(`Server live at: ${port}`)
})
