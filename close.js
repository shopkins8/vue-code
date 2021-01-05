Vue.component('close', {
    template: `<button @click="close" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <i data-label="Close SYOS" class="fas fa-times"></i>
            </button>`,
    methods: {
       close () {
           const modal = document.getElementById('syos');
           modal.classList.add('hide');
           document.getElementsByTagName('body')[0].classList.add('destroy-vue');
           document.getElementsByTagName('body')[0].classList.remove('lock-scroll');
       },
    },
});