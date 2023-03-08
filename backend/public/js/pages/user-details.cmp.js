import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import userList from '../cmps/user-list.cmp.js'

export default {
    template: `
    <section>
        <user-list v-if="user.isAdmin" v-if="users" :users="users" :bugs="bugs" @removeUser="removeUser"/>
        <router-link to="/bug">back</router-link>
        <h1>{{user.fullname}}</h1>
        <bug-list v-if="bugs" :bugs="userBugs"/>
        <!-- <pre>{{userBugs}}</pre> -->
    </section>
    `,
    data() {
        return {
            user: null,
            bugs: null,
            filterBy: {
                txt: '',
                pageIdx: 0,
            },
            users:null,
        }
    },
    created() {
        this.user = userService.getLoggedInUser()
        const { userId } = this.$route.params
        if (userId) {
            userService.getById(userId)
                .then((user) => {this.user = user})
        }
        this.loadBugs()
        this.loadUsers()
    },
    methods: {
        loadBugs() {
            bugService.query(this.filterBy).then((bugs) => {
                this.bugs = bugs
            })
        },
        loadUsers() {
            userService.query().then((users) => {
                this.users = users
            })
        },
        removeUser(userId) {
            console.log('userId:', userId)
            userService.remove(userId).then(() => this.loadUsers())
        }
    },
    computed: {
        userBugs() {
            if(this.user.isAdmin) return this.bugs
            return this.bugs.filter(bug => bug.owner._id === this.user._id)
        }
    },
    components: {
        bugList,
        userList,
    },
    unmounted() {},
}
