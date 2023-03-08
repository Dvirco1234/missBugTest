'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
    template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <button @click="onSetPage(-1)">Prev</button>
        <button @click="onSetPage(1)">Next</button>
    </section>
    `,
    data() {
        return {
            bugs: null,
            filterBy: {
                txt: '',
                pageIdx: 0,
            },
        }
    },
    created() {
        this.loadBugs()
    },
    methods: {
        loadBugs(filterBy) {
            bugService.query(filterBy).then((bugs) => {
                this.bugs = bugs
            })
        },
        setFilterBy(filterBy) {
            this.filterBy = filterBy
            this.loadBugs(filterBy)
        },
        removeBug(bugId) {
            bugService.remove(bugId).then(() => this.loadBugs())
        },
        onSetPage(diff) {
            this.filterBy.pageIdx += diff
            bugService.getBugsData().then(({ totalPages }) => {
                console.log(this.filterBy.pageIdx)
                if (this.filterBy.pageIdx > totalPages ) this.filterBy.pageIdx = 0
                else if (this.filterBy.pageIdx < 0) this.filterBy.pageIdx = totalPages 
                this.loadBugs(this.filterBy)
            })
        },
        getAllBugs() {
            bugService.queryAll()
        },
    },
    computed: {},
    components: {
        bugList,
        bugFilter,
    },
}
