import { userService } from '../services/user.service.js'

export default {
    template: `
    <section>
        <section v-if="user" class="user-info">
            <!-- <pre>{{user}}</pre> -->
            <button @click="logout">logout</button>   
        </section>
        <section v-else>
            <button @click="isNewUser = true">Signup</button> |
            <button @click="isNewUser = false">Login</button>
            <form v-if="!isNewUser" @submit.prevent="login">
                <h3>Login</h3>
                <label for="login-input">Username </label>
                <input type="text" id="login-input" v-model="credentials.username" placeholder="Enetr username">
                <label for="login-pass"> Password </label>
                <input type="password" id="login-pass" v-model="credentials.password" placeholder="Enetr password">
                <button>Login</button>
            </form>
            <form v-else @submit.prevent="signup">
                <h3>Signup</h3>
                <label for="signup-fullname">Fullname </label>
                <input type="text" id="signup-fullname" v-model="signupInfo.fullname" placeholder="Full name" />
                <label for="signup-username">Username </label>
                <input type="text" id="signup-username" v-model="signupInfo.username" placeholder="Username" />
                <label for="signup-password">Password </label>
                <input type="password" id="signup-password" v-model="signupInfo.password" placeholder="Password" />
                <button>Signup</button>
            </form>
        </section>
    </section>
    `,
    data() {
        return {
            user: null,
            credentials: {
                username: '',
                password: '',
            },
            signupInfo: {
                fullname: '',
                username: '',
                password: '',
            },
            isNewUser: false,
        }
    },
    created() {
        this.user = userService.getLoggedInUser()
    },
    methods: {
        login() {
            userService.login(this.credentials).then((user) => {
                this.user = user
                this.credentials = {
                    username: '',
                    password: '',
                }
            })
            .catch(err => {
                console.log('Cannot login', err)
            })
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                })
                .catch(err => {
                    console.log('Cannot logout', err)
                })
        },
        signup() {
            userService.signup(this.signupInfo)
                .then(user => {
                    this.user = user
                })
                .catch(err => {
                    console.log('Cannot signup', err)
                })
        },
    },
    computed: {},
    unmounted() {},
}
