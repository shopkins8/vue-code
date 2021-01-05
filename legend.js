Vue.component('syoslegend', {
    props: ['legends', 'viewerCount', 'seatMaps'],
    template: `<div id="syosLegend" class="row syos-legend collapse show">
        <div class="col">
            <ul class="list-inline float-left syos-legend-list">
                <li v-for="(legend,text) in legends" class="list-inline-item">
                    <span v-if="!legend.custom_icon || legend.custom_icon === '0'" :class="text" class="dot" :style="'background-color:' + legend.seat_code_color"></span>
                    <span v-else :class="legend.custom_icon" class="dot has-icon" :style="'background-color:' + legend.seat_code_color"></span>
                    {{legend.seat_code_title}}
                </li>
            </ul>
            <ul v-show="!this.hideThreshold" class="list-inline float-right hidden-mobile">
                <li v-if="viewerCount" class="list-inline-item current-viewers">Current Viewers: {{ viewerCount }}</li>
            </ul>
        </div>
    </div>`,
});
