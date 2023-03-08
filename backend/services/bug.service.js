const fs = require('fs')
const bugs = require('../data/bug.json')
const PAGE_SIZE = 10

module.exports = {
    query,
    save,
    getById,
    remove,
    getBugsData,
}

function getBugsData() {
    const data = {
      totalPages: Math.floor(bugs.length / PAGE_SIZE),
      totalBugs: bugs.length,
      pageSize: PAGE_SIZE,
    }
    console.log(data);
    return Promise.resolve(data)
  }
  
function query({pageIdx, txt = '' }) {
	const regex = new RegExp(txt, 'i')
	let filteredBugs = bugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))

    const startIdx = pageIdx * PAGE_SIZE 
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)

	return Promise.resolve(filteredBugs)
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[idx] = bug

        if(bugs[idx].owner._id !== loggedinUser._id) {
            if (!loggedinUser.isAdmin) return Promise.reject('Not your bug')
        }
    } else {
        bug._id = _makeId()
        bug.createdAt = Date.now(),
        bugs.push(bug)
    }
    return _saveBugsToFile()
        .then(() => bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such bug')

    if (bugs[idx]?.owner._id !== loggedinUser._id) {
        if (!loggedinUser.isAdmin) return Promise.reject('Not your bug')
    }    
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function _makeId(length=5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for(var i=0; i < length; i++)  {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(bugs, null, 2)
        fs.writeFile('./data/bug.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}