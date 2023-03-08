'use strict'

import loginSignup from './login-signup.cmp.js'
// import userDetails from '../pages/user-details.cmp.js'

export default {
  template: `
        <header>
            <h1>Miss Bug</h1>    
            <!-- <user-details /> -->
            <router-link to="/user/profile"> User profile</router-link>
            <login-signup />
        </header>
    `,
    components: {
        loginSignup,
        // userDetails,
    },
    methods: {

    },
}
