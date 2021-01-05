Vue.component('loading', {
    props: ['loadingMessage', 'loadingClassOverride'],
    template: `<div :class="loadingClassOverride" class="syos-loading text-center p-5 ">
                <p class="heading-5 syos-loading-heading">{{ loadingMessage || "Retrieving performance data.  Please wait.  This may take a few moments."}}</p>
                <div class="spinner">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
            </div>`,
});