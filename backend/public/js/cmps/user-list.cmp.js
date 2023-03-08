import userPreview from './user-preview.cmp.js'

export default {
    props: ['users', 'bugs'],
    template: `
    <button @click="isListShow = !isListShow">Show user list</button>
        <section v-if="users" v-if="isListShow" className="user-list">                    
            <user-preview v-for="user in users" :user="user" :bugs="bugs" :key="user._id" @removeUser="removeUser" />
            <!-- <user-preview v-for="user in users" :user="user" :bugs="bugs" :key="user._id" @removeUser="$emit('removeUser', $event)" /> -->
        </section>
    `,
    data() {
        return {
            isListShow: false,
        }
    },
    created() {
        console.log(this.users);
    },
    methods: {
        removeUser(userId) {
            this.$emit('removeUser', userId)
        },
    },
    computed: {},
    unmounted() {},
    components: {
        userPreview,
      },
    
}
