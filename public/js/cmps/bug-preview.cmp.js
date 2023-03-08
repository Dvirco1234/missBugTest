'use strict'
import { userService } from '../services/user.service.js'

export default {
    props: ['bug'],
    template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link v-if="isMyBug" :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button :disabled="!isMyBug" @click="onRemove(bug._id)">X</button>
                <router-link :to="'/user/profile/' + bug.owner._id"> Creator: {{bug.owner.fullname}}</router-link>
              </article>
  `,
    data() {
        return {
            user: null,
        }
    },
    created() {
        this.user = userService.getLoggedInUser()
    },
    methods: {
        onRemove(bugId) {
            this.$emit('removeBug', bugId)
        },
    },
    computed: {
        isMyBug() {
            // const user = userService.getLoggedInUser()
            return this.bug.owner?._id === this.user?._id || this.user?.isAdmin
        },
    },
}
