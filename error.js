Vue.component('error', {
    props: ['errorTitle', 'errorText', 'error', 'errorButton', 'errorButtonLocation', 'errorClassOverride'],
    template: `<div v-bind:class="errorClassOverride" class="syos-error text-center p-5 ">
                <close></close>
                <p class="heading-5">{{errorTitle || "There was an Error." }}</p>
                <p class="align-center alert alert-danger syos-error-message">{{errorText || "There was an error loading the select your own seat."}}</p>
                <div class="error-button" v-if="errorButton">
                <a :href="errorButtonLocation">{{errorButton}}</a></div>
        </div>`,
    mounted() {
        console.log(this.error);
    },
});
