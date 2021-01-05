Vue.component('date-picker', {
        props: ['dates', 'perfnum', 'datePickerLabel'],
        template: `<div class="col-lg-6 modal-header-right-col d-flex">
                    <div v-if="!dates.length" class="form-inline choose-a-date-form">
                    </div>
                    <div v-else class="form-inline choose-a-date-form">
                            <div class="form-group">
                                    <label for="choose-date" class="mr-sm-2">{{datePickerLabel || "Choose a Date"}}</label>
                                    <select id="choose-date" data-label="Change Date Dropdown" name="choose-date" v-model="perfnum" @change="reloadSYOS" class="form-control">
                                        <option v-for="date in dates" v-bind:value="date.perf_no" >{{date.datetime}}</option>
                                    </select>
                            </div>
                    </div>
                </div>`,
        methods: {
                reloadSYOS() {
                        this.$emit('reloadSYOS', this.perfnum);
                },
        },
});