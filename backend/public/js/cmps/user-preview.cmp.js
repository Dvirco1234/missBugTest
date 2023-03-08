export default {
    props: ['user', 'bugs'],
    template: `
        <article className="user-preview">
            <h4>{{user.fullname}}</h4>
            <div class="actions">
                <button @click="showDetails = !showDetails">Details</button>
            </div>
            <section v-if="showDetails">
                <pre>{{user}}</pre>
            </section>
            <button :disabled="isOwner" @click="onRemove(user._id)">X</button>
        </article>
    `,
    data() {
        return {
            showDetails: false,
        }
    },
    created() {},
    methods: {
        onRemove(userId) {
            this.$emit('removeUser', userId)
        }
    },
    computed: {
        isOwner() {
            return this.bugs.find(bug => bug.owner._id === this.user._id)
        }
    },
    unmounted() {},
}
