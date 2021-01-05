Vue.component('syos-header', {
    props: ['title', 'venueDescription', 'seatsMessage', 'legends', 'dates', 'viewerCount', 'perfnum', 'datePickerLabel', 'appliedPromoCode', 'seatMaps', 'overviewBack', 'overviewLabel', 'seatLabel', 'backButtonLabel'],
    template: `<div class="modal-header">
                <div class="container-fluid">
                    <div class="row sct-production-description" :class="{hiddenmobile: this.overviewBack}">
                        <div class="col-lg-6 modal-header-left-col">
                            <h4 class="modal-title">{{ title }}</h4>
                            <p class="modal-subtitle"> {{ venueDescription }}</p>
                        </div>
                        <date-picker @reloadSYOS="reloadSYOS" :datePickerLabel="datePickerLabel" :dates="dates" :perfnum="perfnum"></date-picker><br/>
                    </div>
                    <div class="row bg-dark">
                        <div class="label-container">
                            <div class="label-text">
                                <p v-if="seatLabel && this.overviewBack" class="d-md-block hidden-mobile">{{seatLabel}}</p>
                                <p v-if="overviewLabel && !this.overviewBack" class="d-md-block hidden-mobile">{{overviewLabel}}</p>
                                <button v-if="this.overviewBack" data-label="Back Button" class="btn btn-primary back-button" @click="overviewReset"><i class="fas fa-arrow-left"></i> {{backButtonLabel || "Back"}}</button>
                            </div>
                            
                            <div v-if="!this.overviewBack" class="promo-container">
                                <div v-if="appliedPromoCode">
                                    <p>{{ appliedPromoCode }}<sup><i id="remove-promo" data-label="Remove Promo" class="far fa-times-circle" @click="removePromo"></i></sup></p>
                                </div>
                                <button v-if="!appliedPromoCode" class="btn btn-primary promo-button" @click="enterPromo">Have a promo code?</button>
                            </div>
                            
                        </div>
                    </div>
                    <syoslegend :legends="legends" :seatMaps="seatMaps" :viewerCount="viewerCount"></syoslegend>
                </div>
            </div>`,
    methods: {
        enterPromo() {
            this.$emit('enterPromo');
        },

        overviewReset() {
            this.$emit('resetOverview');
        },

        removePromo() {
            this.$emit('removePromo');
        },

        reloadSYOS(value) {
            this.perfnum = value;
            this.$emit('reloadSYOS', this.perfnum);
        }
    },
});