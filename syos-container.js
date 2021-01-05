Vue.component('syos-container',  {
    props: ['svgs', 'disablepricing', 'seatDataArray', 'max', 'perfnum', 'packageid', 'cartTotal', 'legends', 'holdCodes', 'facility', 'overviewBack', 'hoverColor', 'priceHover', 'constantColor', 'seatMapInfo', 'onlyHoldCodes', 'overviewSVG'],
    computed: {
        styleDescriptionOffset () {
            return `top: ${this.descriptionTop}px; left: ${this.descriptionLeft}px;`;
        },
        formattedPrice () {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            });

            return formatter.format(this.seatPrice);
        },
        cleanedFloorName () {
            let newName = this.floorName;
        },
        showHoverBox () {
            if(this.showHoverOption && !this.showOptions) {
                return true;
            }
            else {
                return false;
            }
        },
        focusClass () {
            if(this.seatMapInfo && this.activeSeatType) {
                return `focus-price-level-${this.activePriceLevel} focus-seat-type-${this.activeSeatType}`;
            }
            else {
                return `focus-price-level-${this.activePriceLevel}`;
            }
        },

        imageMapBackground () {
            return `background-image: url('${this.overviewMap}'); background-size: contain; background-position: center top; background-repeat: no-repeat; max-height: 100%; transition: background 1s;background-color:black;`;
        },

        imageMapViewbox () {
            return `0 0 ${this.overviewMapWidth} ${this.overviewMapHeight}`;
        },
    },
    watch: {
        overviewBack: function () {
            if(!this.overviewBack) {
                this.activeFloor = null;
            }
        }
    },
    template: `<div class="modal-wrapper">
                <div :class="{hidden: !this.showPreviewWindow}" class="image-preview">
                    <div class="image-container">
                        <i @click="closePreview()" class="fas fa-times-circle fa-2x close-button"></i>
                        <img class="photo-preview-image" :src="this.previewLink">
                        <p>{{this.previewText}}</p>
                    </div>
                </div>
                <div :class="{hidden: !this.showOptions}" class="seat-data seat-ticket-options" :style="styleDescriptionOffset">
                    <h6 class="sd-floor">Select a Seat Type</h6>
                        <table class="table table-borderless table-sm seat-selection">
                            <thead>
                                <tr>
                                    <th class="ss-row-heading">Row</th>
                                    <th class="ss-seat-heading">Seat</th>
                                    <th class="ss-type-heading">Zone</th>
                                    <th v-if="this.previewLink" class="text-center ss-row-heading">Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="ss-row">{{this.row}}</td>
                                    <td class="ss-seat">{{this.seatNumber}}</td>
                                    <td class="ss-section">{{this.zone}}</td>
                                    <td v-if="this.previewLink" class="text-center photo-preview"><i @click="showPreview()" data-label="Photo Preview" class="fas fa-camera"></i></td>
                                </tr>
                            </tbody>
                       </table>
                       <h6 v-if="this.seatInfo" class="sd-floor no-margin">{{this.seatInfo}}</h6>
                       <table v-if="this.infoAlertRow" class="w-100 table table-borderless table-sm alert_info_table mb-0">
                            <tbody>
                                <tr class="alert_info_row">
                                    <td>{{this.infoAlertRow}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="ticket-options">
                            <table class="table table-borderless table-sm seat-selection-details">
                               <thead class="sr-only">
                                    <tr v-for="price in seatPriceArray">
                                        <th class="ss-row-heading">{{price[2]}}</th>
                                        <th :class="{hidden: this.disablepricing}" class="ss-seat-heading ticket-options-price">{{price[1]}}</th>
                                        <th class="ss-type-heading">Select Button</th>
                                    </tr>
                               </thead>
                                <tbody>
                                    <tr v-for="price in seatPriceArray" :data-circle="this.circleID" :data-zone-name="this.zone" :data-section-name="this.section" :data-row="this.row" :data-seat="this.seatNumber" :data-type="this.seatType" :data-price="this.formattedPrice">
                                        <td>{{price[2]}}</td>
                                        <td>{{price[1]}}</td>
                                        <td>
                                            <button :data-seat-no="this.seatNumber" :data-price-type="price[1]" data-label="add-to-cart" class="add-to-cart float-right" @click="pushToCart(false, price[0], price[1], price[2])">Select</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                   </div>
                    <div :class="{hiddenBox: !this.showHoverBox}" id="seat-description" class="seat-data seat-description" :style="styleDescriptionOffset">
                        <h6 class="sd-floor">{{this.zone}}</h6>
                        <table class="table table-borderless table-sm">
                            <thead>
                                <tr>
                                    <th class="sd-row-heading">Row</th>
                                    <th class="sd-seat-heading">Seat</th>
                                    <th class="sd-type-heading seat-data-pricing">{{this.seatType}}</th>
                                </tr>
                           </thead>
                            <tbody>
                                <tr>
                                    <td class="sd-row">{{this.row}}</td>
                                    <td class="sd-seat">{{this.seatNumber}}</td>
                                    <td :class="{hidden: this.disablepricing}" class="sd-amount">{{this.formattedPrice}}</td>
                                </tr>
                                <tr class="alert_info_row" v-if="this.infoAlertRow"><td colspan="3">{{this.infoAlertRow}}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <ul v-if="this.noOverview" class="floor-selection" style="display: block;">
                        <li class="select-floor" v-for="(floor, idx) in svgs" @click="changeFloor(idx)">{{ floor.floor_name }}</li>
                    </ul>
                    <div v-show="this.activeFloor" class="controls-zoom">
                        <p @click="zoomIn"><i  data-label="Zoom In" role="button" class="fa fa-plus"></i></p>
                        <p @click="zoomOut"><i role="button" data-label="Zoom Out" class="fa fa-minus"></i></p>
                    </div>
                    <div :class="this.focusClass" class="container-fluid syos-container">
                        <div v-show="!this.activeFloor" v-if="this.overviewSVG" class="overview">
                            <div class="overview-wrapper hidden-mobile">
                                <div v-if="showOverviewStats" class="floorcontent">
                                    <h2>{{this.overviewFloor}}</h2>
                                    <div v-if="this.overviewFloorSeats > 0" class="floorcontent-wrapper">
                                        <div id="seating">{{this.overviewFloorSeats}} of {{this.overviewFloorSeatsMax}} seats available</div>
                                        <div v-if="this.overviewFloorSame" id="prices">Price: {{this.overviewFloorPriceLow}}</div>
                                        <div v-else id="prices">Price Range: {{this.overviewFloorPriceLow}} - {{this.overviewFloorPriceHigh}}</div>
                                    </div>
                                    <p v-if="this.overviewFloorSeats === 0" class="unavailable-seats">No seats available at this time.</p>
                                </div>
                                <div v-show="!this.activeFloor" v-html="this.overviewSVG" data-label="3D Overview Floor Switch" class="overview-svg hidden-mobile">
                                </div>
                            </div>
                            
                            <div v-show="!this.activeFloor" id="syos-overview-mobile" class="hidden-desktop">
                                <div class="mobile-floor-buttons">
                                <!-- FOR EACH FLOOR LOOP HERE ADD COLOR FOR THAT FLOOR -->
                                    <div v-for="(floor, idx) in allFloorsInfo">
                                        <a v-if="floor.available_count == '0'">
                                            <div :class="floor.floor_name" class="mobile-floor-button">
                                                <div class="svg-container" v-html="overviewSVG">
                                                </div>
                                                <div class="content-container">
                                                    <div :class="floor.floor_name">
                                                        <h2 id="floor-name-display">{{ floor.floor_name }}</h2>
                                                        <h2 class="unavailable-seats">No seats available at this time.</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        <a v-else @click="changeMobileOverviewFloor(floor.floor_name)" >
                                            <div :class="floor.floor_name" class="mobile-floor-button">
                                                <div class="svg-container" v-html="overviewSVG">
                                                </div>
                                                <div class="content-container">
                                                    <div :class="floor.floor_name">
                                                        <h2 id="floor-name-display">{{ floor.floor_name }}</h2>
                                                        <div id="seating"><span class="available-seats">{{floor.available_count}}</span> of <span class="total-seats">{{floor.total_count}}</span> seats available</div>
                                                        <div v-if="floor.sameMinMax" id="prices">Price: <span class="low">{{floor.price_min}}</span></div>
                                                        <div v-else id="prices">Price Range: <span class="low">{{floor.price_min}}</span> - <span class="high">{{floor.price_max}}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div v-show="!this.activeFloor" v-if="this.overviewMap" class="overview overview-map">
                            <div class="overview-wrapper hidden-mobile">
                                <div v-if="showOverviewStats" class="map-floor-stats">
                                    <h2>{{ this.overviewFloor }}</h2>
                                    <div v-if="this.overviewFloorSeats > 0">
                                        <p>
                                            <span id="seating">{{this.overviewFloorSeats}} of {{this.overviewFloorSeatsMax}} seats available</span>
                                            <span v-if="this.overviewFloorSame" id="prices">Price: {{this.overviewFloorPriceLow}}</span>
                                            <span v-else id="prices">Price Range: {{this.overviewFloorPriceLow}} - {{this.overviewFloorPriceHigh}}</span>
                                        </p>
                                    </div>
                                    <p v-if="this.overviewFloorSeats === 0" class="unavailable-seats">No seats available at this time.</p>
                                </div>
                                 
                                <div v-show="!this.activeFloor" class="interactive-map hidden-mobile">
                                    <div class="map-wrapper">
                                    
                                    <figure id="projectsvg">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :viewBox="this.imageMapViewbox" preserveAspectRatio="xMinYMin meet" :style="this.imageMapBackground" >
                                            <g class="hover_group" opacity="0">
                                                <a v-for="(floor, idx, num) in this.facility.overview" class="section-selection-area"  :data-floorSwitch="'floorsvg-' + num" :data-alt-tag="idx" >
                                                    <rect data-label="Section Selection Choose Floor" :x="floor.coords.x" :y="floor.coords.y" opacity="0.2" fill="#FFFFFF" :width="floor.coords.width" :height="floor.coords.height"></rect>
                                                </a>
                                            </g>
                                        
                                        </svg>
                                    </figure>
                                    </div>
                                </div>
                            </div>
                            
                            
                            
                            <div v-show="!this.activeFloor" id="syos-overview-mobile" class="hidden-desktop">
                                <div class="mobile-floor-buttons">
                                <!-- FOR EACH FLOOR LOOP HERE ADD COLOR FOR THAT FLOOR -->
                                    <div v-for="(floor, idx) in allFloorsInfo" data-label="Mobile Floor Switch Button">
                                        <a v-if="floor.available_count == '0'" data-label="Mobile Floor Switch Button">
                                            <div :class="floor.floor_name" class="mobile-floor-button" data-label="Mobile Floor Switch Button">
                                                <div class="svg-container">
                                                    <img :src="floor.mobile">
                                                </div>
                                                <div class="content-container">
                                                    <div :class="floor.floor_name">
                                                        <h2 id="floor-name-display">{{ floor.floor_name }}</h2>
                                                        <h2 class="unavailable-seats">No seats available at this time.</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        <a v-else @click="changeMobileOverviewFloor(floor.floor_name)" >
                                            <div :class="floor.floor_name" class="mobile-floor-button">
                                                <div class="svg-container">
                                                    <img :src="floor.mobile">
                                                </div>
                                                <div class="content-container">
                                                    <div :class="floor.floor_name">
                                                        <h2 id="floor-name-display">{{ floor.floor_name }}</h2>
                                                        <div id="seating"><span class="available-seats">{{floor.available_count}}</span> of <span class="total-seats">{{floor.total_count}}</span> seats available</div>
                                                        <div v-if="floor.sameMinMax" id="prices">Price: <span class="low">{{floor.price_min}}</span></div>
                                                        <div v-else id="prices">Price Range: <span class="low">{{floor.price_min}}</span> - <span class="high">{{floor.price_max}}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        
                                    </div>
                                    
                                </div>
                            </div>
                            
                            
                            
                            
                        </div>
                        
                        <div v-show="this.activeFloor" class="height-inherit">
                            <div v-for="(svg, idx) in svgs" v-html="svg.svg" :id="'floorsvg-' + idx" :class="activeFloor === idx+1 ? 'active-floor' : ''" class="floorsvg" :data-floor-id="idx+1" :data-floor-svg-id="svg.id">
                            </div>
                        </div>
                        
                    </div>
                </div>`,
    data() {
        return {
            activeFloor: null,
            row: null,
            pricing: null,
            seatNumber: null,
            seatDataNumber: null,
            circleID: null,
            zone: null,
            seatTypeId: null,
            infoAlertRow: null,
            seatPrice: null,
            seatType: null,
            seatPriceType: null,
            seatSection: null,
            seatInfo: null,
            descriptionTop: 0,
            descriptionLeft: 0,
            zoomSVGS: [],
            cartItem: {},
            showHoverOption: false,
            showOptions: false,
            initialLoad: 0,
            previewImages: [],
            previewLink: null,
            showPreviewWindow: false,
            noOverview: false,
            showOverviewStats: true,
            overviewFloorSeats: null,
            overviewFloorSeatsMax: 100,
            overviewFloorPriceLow: 0,
            overviewFloorPriceHigh: 100,
            overviewFloorSame: null,
            customIcons: {
                wheelchair: '<svg height="6" width="6" class="svg-inline--fa fa-wheelchair fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="pointer-events: none;"><path fill="currentColor" d="M496.101 385.669l14.227 28.663c3.929 7.915.697 17.516-7.218 21.445l-65.465 32.886c-16.049 7.967-35.556 1.194-43.189-15.055L331.679 320H192c-15.925 0-29.426-11.71-31.679-27.475C126.433 55.308 128.38 70.044 128 64c0-36.358 30.318-65.635 67.052-63.929 33.271 1.545 60.048 28.905 60.925 62.201.868 32.933-23.152 60.423-54.608 65.039l4.67 32.69H336c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16H215.182l4.572 32H352a32 32 0 0 1 28.962 18.392L438.477 396.8l36.178-18.349c7.915-3.929 17.517-.697 21.446 7.218zM311.358 352h-24.506c-7.788 54.204-54.528 96-110.852 96-61.757 0-112-50.243-112-112 0-41.505 22.694-77.809 56.324-97.156-3.712-25.965-6.844-47.86-9.488-66.333C45.956 198.464 0 261.963 0 336c0 97.047 78.953 176 176 176 71.87 0 133.806-43.308 161.11-105.192L311.358 352z"></path></svg>',
                universalAccess: '<svg height="6" width="6" class="svg-inline--fa fa-universal-access fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="pointer-events: none;"><path fill="currentColor" d="M256 48c114.953 0 208 93.029 208 208 0 114.953-93.029 208-208 208-114.953 0-208-93.029-208-208 0-114.953 93.029-208 208-208m0-40C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 56C149.961 64 64 149.961 64 256s85.961 192 192 192 192-85.961 192-192S362.039 64 256 64zm0 44c19.882 0 36 16.118 36 36s-16.118 36-36 36-36-16.118-36-36 16.118-36 36-36zm117.741 98.023c-28.712 6.779-55.511 12.748-82.14 15.807.851 101.023 12.306 123.052 25.037 155.621 3.617 9.26-.957 19.698-10.217 23.315-9.261 3.617-19.699-.957-23.316-10.217-8.705-22.308-17.086-40.636-22.261-78.549h-9.686c-5.167 37.851-13.534 56.208-22.262 78.549-3.615 9.255-14.05 13.836-23.315 10.217-9.26-3.617-13.834-14.056-10.217-23.315 12.713-32.541 24.185-54.541 25.037-155.621-26.629-3.058-53.428-9.027-82.141-15.807-8.6-2.031-13.926-10.648-11.895-19.249s10.647-13.926 19.249-11.895c96.686 22.829 124.283 22.783 220.775 0 8.599-2.03 17.218 3.294 19.249 11.895 2.029 8.601-3.297 17.219-11.897 19.249z"></path></svg>',
                signLanguage: '<svg height="6" width="6" class="svg-inline--fa fa-sign-language fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="pointer-events: none;"><path fill="currentColor" d="M91.434 483.987c-.307-16.018 13.109-29.129 29.13-29.129h62.293v-5.714H56.993c-16.021 0-29.437-13.111-29.13-29.129C28.16 404.491 40.835 392 56.428 392h126.429v-5.714H29.136c-16.021 0-29.437-13.111-29.13-29.129.297-15.522 12.973-28.013 28.566-28.013h154.286v-5.714H57.707c-16.021 0-29.437-13.111-29.13-29.129.297-15.522 12.973-28.013 28.566-28.013h168.566l-31.085-22.606c-12.762-9.281-15.583-27.149-6.302-39.912 9.281-12.761 27.15-15.582 39.912-6.302l123.361 89.715a34.287 34.287 0 0 1 14.12 27.728v141.136c0 15.91-10.946 29.73-26.433 33.374l-80.471 18.934a137.16 137.16 0 0 1-31.411 3.646H120c-15.593-.001-28.269-12.492-28.566-28.014zm73.249-225.701h36.423l-11.187-8.136c-18.579-13.511-20.313-40.887-3.17-56.536l-13.004-16.7c-9.843-12.641-28.43-15.171-40.88-5.088-12.065 9.771-14.133 27.447-4.553 39.75l36.371 46.71zm283.298-2.103l-5.003-152.452c-.518-15.771-13.722-28.136-29.493-27.619-15.773.518-28.137 13.722-27.619 29.493l1.262 38.415L283.565 11.019c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l76.889 98.745-4.509 3.511-94.79-121.734c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l94.443 121.288-4.509 3.511-77.675-99.754c-9.58-12.303-27.223-14.63-39.653-5.328-12.827 9.599-14.929 28.24-5.086 40.881l52.053 66.849c12.497-8.257 29.055-8.285 41.69.904l123.36 89.714c10.904 7.93 17.415 20.715 17.415 34.198v16.999l61.064-47.549a34.285 34.285 0 0 0 13.202-28.177z"></path></svg>',
                lowVision: '<svg height="6" width="6" class="svg-inline--fa fa-low-vision fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="pointer-events: none;"><path fill="currentColor" d="M569.344 231.631C512.96 135.949 407.81 72 288 72c-28.468 0-56.102 3.619-82.451 10.409L152.778 10.24c-7.601-10.858-22.564-13.5-33.423-5.9l-13.114 9.178c-10.86 7.601-13.502 22.566-5.9 33.426l43.131 58.395C89.449 131.73 40.228 174.683 6.682 231.581c-.01.017-.023.033-.034.05-8.765 14.875-8.964 33.528 0 48.739 38.5 65.332 99.742 115.862 172.859 141.349L55.316 244.302A272.194 272.194 0 0 1 83.61 208.39l119.4 170.58h.01l40.63 58.04a330.055 330.055 0 0 0 78.94 1.17l-189.98-271.4a277.628 277.628 0 0 1 38.777-21.563l251.836 356.544c7.601 10.858 22.564 13.499 33.423 5.9l13.114-9.178c10.86-7.601 13.502-22.567 5.9-33.426l-43.12-58.377-.007-.009c57.161-27.978 104.835-72.04 136.81-126.301a47.938 47.938 0 0 0 .001-48.739zM390.026 345.94l-19.066-27.23c24.682-32.567 27.711-76.353 8.8-111.68v.03c0 23.65-19.17 42.82-42.82 42.82-23.828 0-42.82-19.349-42.82-42.82 0-23.65 19.17-42.82 42.82-42.82h.03c-24.75-13.249-53.522-15.643-79.51-7.68l-19.068-27.237C253.758 123.306 270.488 120 288 120c75.162 0 136 60.826 136 136 0 34.504-12.833 65.975-33.974 89.94z"></path></svg>',
                deaf: '<svg height="6" width="6" class="svg-inline--fa fa-deaf fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="pointer-events: none;"><path fill="currentColor" d="M216 260c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-44.112 35.888-80 80-80s80 35.888 80 80c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-13.234-10.767-24-24-24s-24 10.766-24 24zm24-176c-97.047 0-176 78.953-176 176 0 15.464 12.536 28 28 28s28-12.536 28-28c0-66.168 53.832-120 120-120s120 53.832 120 120c0 75.164-71.009 70.311-71.997 143.622L288 404c0 28.673-23.327 52-52 52-15.464 0-28 12.536-28 28s12.536 28 28 28c59.475 0 107.876-48.328 108-107.774.595-34.428 72-48.24 72-144.226 0-97.047-78.953-176-176-176zm268.485-52.201L480.2 3.515c-4.687-4.686-12.284-4.686-16.971 0L376.2 90.544c-4.686 4.686-4.686 12.284 0 16.971l28.285 28.285c4.686 4.686 12.284 4.686 16.97 0l87.03-87.029c4.687-4.688 4.687-12.286 0-16.972zM168.97 314.745c-4.686-4.686-12.284-4.686-16.97 0L3.515 463.23c-4.686 4.686-4.686 12.284 0 16.971L31.8 508.485c4.687 4.686 12.284 4.686 16.971 0L197.256 360c4.686-4.686 4.686-12.284 0-16.971l-28.286-28.284z"></path></svg>',
                assistiveListeningSystems: '<svg height="6" width="6" class="svg-inline--fa fa-assistive-listening-systems fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="pointer-events: none;"><path fill="currentColor" d="M216 260c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-44.112 35.888-80 80-80s80 35.888 80 80c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-13.234-10.767-24-24-24s-24 10.766-24 24zm24-176c-97.047 0-176 78.953-176 176 0 15.464 12.536 28 28 28s28-12.536 28-28c0-66.168 53.832-120 120-120s120 53.832 120 120c0 75.164-71.009 70.311-71.997 143.622L288 404c0 28.673-23.327 52-52 52-15.464 0-28 12.536-28 28s12.536 28 28 28c59.475 0 107.876-48.328 108-107.774.595-34.428 72-48.24 72-144.226 0-97.047-78.953-176-176-176zm-80 236c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 448c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm480-187.993c0-1.518-.012-3.025-.045-4.531C510.076 140.525 436.157 38.47 327.994 1.511c-14.633-4.998-30.549 2.809-35.55 17.442-5 14.633 2.81 30.549 17.442 35.55 85.906 29.354 144.61 110.513 146.077 201.953l.003.188c.026 1.118.033 2.236.033 3.363 0 15.464 12.536 28 28 28s28.001-12.536 28.001-28zM152.971 439.029l-80-80L39.03 392.97l80 80 33.941-33.941z"></path></svg>',
                americanSignLanguageInterpreting: '<svg height="6" width="6" class="svg-inline--fa fa-american-sign-language-interpreting fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="pointer-events: none;"><path fill="currentColor" d="M290.547 189.039c-20.295-10.149-44.147-11.199-64.739-3.89 42.606 0 71.208 20.475 85.578 50.576 8.576 17.899-5.148 38.071-23.617 38.071 18.429 0 32.211 20.136 23.617 38.071-14.725 30.846-46.123 50.854-80.298 50.854-.557 0-94.471-8.615-94.471-8.615l-66.406 33.347c-9.384 4.693-19.815.379-23.895-7.781L1.86 290.747c-4.167-8.615-1.111-18.897 6.946-23.621l58.072-33.069L108 159.861c6.39-57.245 34.731-109.767 79.743-146.726 11.391-9.448 28.341-7.781 37.51 3.613 9.446 11.394 7.78 28.067-3.612 37.516-12.503 10.559-23.618 22.509-32.509 35.57 21.672-14.729 46.679-24.732 74.186-28.067 14.725-1.945 28.063 8.336 29.73 23.065 1.945 14.728-8.336 28.067-23.062 29.734-16.116 1.945-31.12 7.503-44.178 15.284 26.114-5.713 58.712-3.138 88.079 11.115 13.336 6.669 18.893 22.509 12.224 35.848-6.389 13.06-22.504 18.617-35.564 12.226zm-27.229 69.472c-6.112-12.505-18.338-20.286-32.231-20.286a35.46 35.46 0 0 0-35.565 35.57c0 21.428 17.808 35.57 35.565 35.57 13.893 0 26.119-7.781 32.231-20.286 4.446-9.449 13.614-15.006 23.339-15.284-9.725-.277-18.893-5.835-23.339-15.284zm374.821-37.237c4.168 8.615 1.111 18.897-6.946 23.621l-58.071 33.069L532 352.16c-6.39 57.245-34.731 109.767-79.743 146.726-10.932 9.112-27.799 8.144-37.51-3.613-9.446-11.394-7.78-28.067 3.613-37.516 12.503-10.559 23.617-22.509 32.508-35.57-21.672 14.729-46.679 24.732-74.186 28.067-10.021 2.506-27.552-5.643-29.73-23.065-1.945-14.728 8.336-28.067 23.062-29.734 16.116-1.946 31.12-7.503 44.178-15.284-26.114 5.713-58.712 3.138-88.079-11.115-13.336-6.669-18.893-22.509-12.224-35.848 6.389-13.061 22.505-18.619 35.565-12.227 20.295 10.149 44.147 11.199 64.739 3.89-42.606 0-71.208-20.475-85.578-50.576-8.576-17.899 5.148-38.071 23.617-38.071-18.429 0-32.211-20.136-23.617-38.071 14.033-29.396 44.039-50.887 81.966-50.854l92.803 8.615 66.406-33.347c9.408-4.704 19.828-.354 23.894 7.781l44.455 88.926zm-229.227-18.618c-13.893 0-26.119 7.781-32.231 20.286-4.446 9.449-13.614 15.006-23.339 15.284 9.725.278 18.893 5.836 23.339 15.284 6.112 12.505 18.338 20.286 32.231 20.286a35.46 35.46 0 0 0 35.565-35.57c0-21.429-17.808-35.57-35.565-35.57z"></path></svg>',
                blind: '<svg height="6" width="6" class="svg-inline--fa fa-blind fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="pointer-events: none;"><path fill="currentColor" d="M380.15 510.837a8 8 0 0 1-10.989-2.687l-125.33-206.427a31.923 31.923 0 0 0 12.958-9.485l126.048 207.608a8 8 0 0 1-2.687 10.991zM142.803 314.338l-32.54 89.485 36.12 88.285c6.693 16.36 25.377 24.192 41.733 17.501 16.357-6.692 24.193-25.376 17.501-41.734l-62.814-153.537zM96 88c24.301 0 44-19.699 44-44S120.301 0 96 0 52 19.699 52 44s19.699 44 44 44zm154.837 169.128l-120-152c-4.733-5.995-11.75-9.108-18.837-9.112V96H80v.026c-7.146.003-14.217 3.161-18.944 9.24L0 183.766v95.694c0 13.455 11.011 24.791 24.464 24.536C37.505 303.748 48 293.1 48 280v-79.766l16-20.571v140.698L9.927 469.055c-6.04 16.609 2.528 34.969 19.138 41.009 16.602 6.039 34.968-2.524 41.009-19.138L136 309.638V202.441l-31.406-39.816a4 4 0 1 1 6.269-4.971l102.3 129.217c9.145 11.584 24.368 11.339 33.708 3.965 10.41-8.216 12.159-23.334 3.966-33.708z"></path></svg>',
                audioDescription: '<svg height="6" width="6" class="svg-inline--fa fa-audio-description fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="pointer-events: none;"><path fill="currentColor" d="M162.925 238.709l8.822 30.655h-25.606l9.041-30.652c1.277-4.421 2.651-9.994 3.872-15.245 1.22 5.251 2.594 10.823 3.871 15.242zm166.474-32.099h-14.523v98.781h14.523c29.776 0 46.175-17.678 46.175-49.776 0-32.239-17.49-49.005-46.175-49.005zM512 112v288c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48zM245.459 336.139l-57.097-168A12.001 12.001 0 0 0 177 160h-35.894a12.001 12.001 0 0 0-11.362 8.139l-57.097 168C70.003 343.922 75.789 352 84.009 352h29.133a12 12 0 0 0 11.535-8.693l8.574-29.906h51.367l8.793 29.977A12 12 0 0 0 204.926 352h29.172c8.22 0 14.006-8.078 11.361-15.861zm184.701-80.525c0-58.977-37.919-95.614-98.96-95.614h-57.366c-6.627 0-12 5.373-12 12v168c0 6.627 5.373 12 12 12H331.2c61.041 0 98.96-36.933 98.96-96.386z"></path></svg>',
                dotCircle: '<svg height="6" width="6" class="svg-inline--fa fa-dot-circle fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z"/></svg>',
                square: '<svg height="6" width="6" class="svg-inline--fa fa-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"></path></svg>',
                star: '<svg  height="6" width="6"  class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>',
                lines: '<svg height="6" width="6" class="svg-inline--fa fa-grip-lines fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M496 288H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"></path></svg>',
            },
            priceLevels: null,
            activePriceLevel: 0,
            overviewSVGTEST: null,
            overviewMap: null,
            overviewMapHold: null,
            overviewMapHeight: null,
            overviewMapWidth: null,
            seatPriceArray: [],
            activeSeatType: null,
            allFloorsInfo: [],
        }
    },
    mounted () {
        document.getElementById('syos').addEventListener('click', (el) => {
            if(el.target.matches('.seat.available')) {
                this.showOptions = true;
            }
            else if(el.target.matches('.modal-wrapper')) {
                this.showOptions = true;
            }
            else if(el.target.matches('.section-selection-area rect')) {
                if(el.target.parentElement.classList.contains('disabled')) {
                    // do nothing because its disabled
                }
                else {
                    const switcherID = el.target.parentElement.getAttribute('data-alt-tag');
                    this.changeMobileOverviewFloor(switcherID);
                }
            }
            else {
                this.showOptions = false;
                let clicked = document.querySelectorAll('#syos .seat.clicked');
                this.activePriceLevel = 0;
                this.activeSeatType = null;
                this.seatInfo = null;
                if (clicked.length > 0) {
                    clicked = clicked[0];
                    clicked.classList.remove('clicked');
                    //this.previewLink = '';
                }
            }
        });
    },
    methods: {
        closePreview() {
            this.previewLink = null;
            this.showPreviewWindow = false;
            this.previewText = null;
        },

        mobileOverviewAvailable (count) {
            if(parseInt(count) > 0) {
                return true;
            }
            else {
                return false;
            }
        },

        assignPreview(seatZoneID) {
            // take zone ID and match it to the this.previewImages array, then get the URL and caption

            for (const [id, preview] of Object.entries(this.previewImages)) {
                if(preview.zoneID === seatZoneID) {
                    this.previewLink = preview.url;
                    this.previewText = preview.caption;
                }
            }
        },

        showPreview() {
            this.showPreviewWindow = true;
        },

        appendPreview() {
            for (const [id, preview] of Object.entries(this.previewImages)) {
                if(preview.caption !== '' && preview.url !== '') {
                    const seats = document.querySelectorAll('.floorsvg .available[data-section-id="' + preview.zoneID + '"]');
                    seats.forEach((seat) => {
                        seat.classList.add('has-preview');
                    });
                }
            }
        },

        closePromo() {
            this.showPromoWindow = false;
            this.previewText = null;
        },

        showPromo() {
            this.showPromoWindow = true;
        },

        changeFloor(floorNumber) {
            this.activeFloor = floorNumber +1;
            this.zoomSVGS[(this.activeFloor -1)].reset();
        },

        changeOverviewFloor(floorID) {
            // match floorID to mapping of floor names in admin panel
            let floorName = '';
            for (const [id, name] of Object.entries(this.facility.overview)) {
                if(floorID === name.svgID) {
                    floorName = id;
                }
            }
            this.svgs.forEach((svg, index) => {
                let tmpID = svg.floor_name;
                tmpID = tmpID.replace(/ /g, '');
                tmpID = tmpID.replace(/&/g, '');
                tmpID = tmpID.replace(/,/g, '');
                if(floorName === tmpID) {
                    this.activeFloor = index + 1;
                    this.zoomSVGS[index].reset();
                }
            });
            this.$emit('overviewChange');

        },

        changeMobileOverviewFloor(floorID) {
            let tmpFloor = floorID;
            tmpFloor = tmpFloor.replace(/ /g, '');
            tmpFloor = tmpFloor.replace(/&/g, '');

            this.svgs.forEach((svg, index) => {
                let tmpID = svg.floor_name;
                tmpID = tmpID.replace(/ /g, '');
                tmpID = tmpID.replace(/&/g, '');tmpID = tmpID.replace(/,/g, '');
                if(tmpFloor === tmpID) {
                    this.activeFloor = index + 1;
                    this.zoomSVGS[index].reset();
                }
            });
            this.$emit('overviewChange');

        },

        overviewFloorHover(floorID, isMap) {
            // get svg info on current floor prices & seating
            // match floorID to map from results
            let floorName = '';

            if(isMap) {
                this.allFloorsInfo.forEach((floor) => {
                    let tmpID = floor.floor_name;
                    tmpID = tmpID.replace(/ /g, '');
                    tmpID = tmpID.replace(/&/g, '');
                    tmpID = tmpID.replace(/,/g, '');
                    if(floorID === tmpID) {
                        this.overviewFloor = floor.floor_name;
                        if(floor.price_min === floor.price_max) {
                            this.overviewFloorSame = true;
                        }
                        this.overviewFloorPriceHigh = floor.price_max;
                        this.overviewFloorPriceLow = floor.price_min;
                        this.overviewFloorSeats = floor.available_count;
                        this.overviewFloorSeatsMax = floor.total_count;
                        this.updateMapBackground(floorID, true);
                    }
                });
            }
            else {
                for (const [id, name] of Object.entries(this.facility.overview)) {
                    if(floorID === name.svgID) {
                        floorName = id;
                    }
                }
                this.allFloorsInfo.forEach((floor) => {
                    let tmpID = floor.floor_name;
                    tmpID = tmpID.replace(/ /g, '');
                    tmpID = tmpID.replace(/&/g, '');
                    tmpID = tmpID.replace(/,/g, '');
                    if(floorName === tmpID) {
                        this.overviewFloor = floor.floor_name;
                        if(floor.price_min === floor.price_max) {
                            this.overviewFloorSame = true;
                        }
                        this.overviewFloorPriceHigh = floor.price_max;
                        this.overviewFloorPriceLow = floor.price_min;
                        this.overviewFloorSeats = floor.available_count;
                        this.overviewFloorSeatsMax = floor.total_count;
                    }
                });
            }
        },

        updateMapBackground(floorID, onHover) {
            if(onHover) {
                for (const [id, name] of Object.entries(this.facility.overview)) {
                    if(floorID === id) {
                        if(name.url) {
                            this.overviewMap = name.url;
                        }
                    }
                }
            }
            else {
                this.overviewMap = this.overviewMapHold;
            }
        },

        overviewFloorOffHover(floorID) {
            // get svg info on current floor prices & seating
            this.overviewFloorPriceHigh = null;
            this.overviewFloorPriceLow = null;
            this.overviewFloorSeats = null;
            this.overviewFloorSeatsMax = null;
            this.overviewFloor = null;
            this.overviewFloorSame = null;
            this.updateMapBackground(floorID);
        },

        zoomIn() {
            this.zoomSVGS[(this.activeFloor -1)].zoomIn();
        },

        zoomOut() {
            this.zoomSVGS[(this.activeFloor -1)].zoomOut();
        },

        initiateZoom() {
            let svgs = document.querySelectorAll('.floorsvg svg');
            if(window.matchMedia('max-width: 850px')) {
                svgs.forEach((svg) => {
                    let svgPanZoom = new SVGPanZoom(svg, {
                        eventMagnet: null,
                        zoom: {
                            factor: 0.1,
                            animationTime: 2000,
                            minZoom: this.zoomMin,
                            maxZoom: this.zoomMax,
                            fit: true,
                            center: true,
                            events: {
                                mouseWheel: true,
                                doubleClick: true,
                                pinch: true,
                                touch: true,
                            },
                        },
                    });
                    this.zoomSVGS.push(svgPanZoom);
                });
            } else {
                svgs.forEach((svg) => {
                    let svgPanZoom = new SVGPanZoom(svg, {
                        eventMagnet: null,
                        zoom: {
                            factor: 0.1,
                            minZoom: .5,
                            maxZoom: 2,
                            fit: true,
                            center: true,
                            events: {
                                mouseWheel: true,
                                doubleClick: true,
                                pinch: true,
                                touch: true,
                            },
                        },
                    });
                    this.zoomSVGS.push(svgPanZoom);
                });
            }


        },
        getPosition(seat, box) {
            let leftOffset = box.offsetWidth;
            let outerHeight = box.offsetHeight;
            leftOffset = leftOffset / 2;
            let svgPosition = document.querySelectorAll('#syos .active-floor svg');
            svgPosition = svgPosition[0];
            this.descriptionTop = seat.getBoundingClientRect().top - svgPosition.getBoundingClientRect().top - outerHeight;
            this.descriptionLeft = seat.getBoundingClientRect().left - svgPosition.getBoundingClientRect().left - leftOffset;
        },
        updateHover(id) {
            let clicked = document.querySelectorAll('#syos .seat.clicked');
            if (clicked.length > 0) {
                // do nothing
            }
            else {
                this.showHoverOption = true;
                let seat = document.getElementById(id);
                seat.classList.add('circle-selected');
                this.row = seat.getAttribute('data-seat-row');
                this.pricing = seat.getAttribute('data-pricing').split('|');
                this.circleID = seat.id;
                this.seatPrice = this.pricing[1];
                this.seatType = this.pricing[2];
                this.seatPriceType = this.pricing[0];

                if(this.priceHover) {
                    let seatPriceLevel = seat.getAttribute('data-price-level');
                    this.activePriceLevel = seatPriceLevel;
                }
                this.seatTypeId = seat.getAttribute('data-seat-type-id');
                this.seatNumber = seat.getAttribute('data-seat-number');
                this.seatDataNumber = seat.getAttribute('data-seat-no')
                this.zone = seat.getAttribute('data-zone-description');
                this.infoAlertRow = '';
                let outerHeight = document.getElementById('seat-description');
                this.getPosition(seat, outerHeight);

                for (const [id, legend] of Object.entries(this.seatDataArray)) {
                    if(parseInt(this.seatTypeId) === parseInt(id)) {
                        this.infoAlertRow = legend.label;
                        return this.infoAlertRow
                    }
                }

            }
        },

        hoverOut(id) {
            let seat = document.getElementById(id);
            seat.classList.remove('circle-selected');
            this.showHoverOption = false;
            if(this.priceHover) {
                this.activePriceLevel = 0;
            }
        },

        updateClick(id) {
            let clicked = document.querySelectorAll('#syos .seat.clicked');
            if (clicked.length > 0) {
                clicked = clicked[0];
                clicked.classList.remove('clicked');
            }
            // Check if seat has hold code message
            this.showOptions = true;
            const seat = document.getElementById(id);
            seat.classList.add('clicked');
            let seatPriceLevel = seat.getAttribute('data-price-level');
            let seatMessage = seat.getAttribute('data-priceTypeMessage');
            const seatZone = seat.getAttribute('data-section-id');
            this.seatInfo = seat.getAttribute('data-seat-info');
            this.activePriceLevel = seatPriceLevel;

            this.row = seat.getAttribute('data-seat-row');
            //this.pricing = seat.getAttribute('data-pricing').split('|');
            this.circleID = seat.id;
            if(seat.classList.contains('has-preview')) {
                this.assignPreview(seatZone);
            }
            this.seatPriceArray = [];

            let tmpseatPriceArray = seat.getAttribute('data-pricing').split('~');

            if(tmpseatPriceArray.length === 0) {
                let tmpPricing = seat.getAttribute('data-pricing');
                tmpseatPriceArray.push(tmpPricing);
            }



            tmpseatPriceArray.forEach((priceObject) => {
                // create object of this.seatPriceArray for each thing, split on the Pipe
                let tmpSplit =  priceObject.split('|');
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                });

                tmpSplit[1] = formatter.format(tmpSplit[1]);
                this.seatPriceArray.push(tmpSplit);

            });

            this.seatTypeId = seat.getAttribute('data-seat-type-id');
            this.seatNumber = seat.getAttribute('data-seat-number');
            this.zone = seat.getAttribute('data-zone-description');
            this.infoAlertRow = '';
            let seatTicketOptions = document.querySelectorAll('#syos .seat-ticket-options');
            seatTicketOptions = seatTicketOptions[0];
            this.getPosition(seat, seatTicketOptions);

            for (const [id, legend] of Object.entries(this.seatDataArray)) {
                if(parseInt(this.seatTypeId) === parseInt(id)) {
                    this.infoAlertRow = legend.label;
                    return this.infoAlertRow
                }
            }
        },
        applyHolds() {
            if(this.onlyHoldCodes) {
                this.onlyHoldCodes.forEach((code) => {
                    const onlyHoldQuery = document.querySelectorAll('.floorsvg .held[data-hold-code-id="' + code + '"]');
                    onlyHoldQuery.forEach((seat) => {
                        seat.classList.add('available');
                    });
                });
            }

            if(this.holdCodes) {
                this.holdCodes.forEach((item) => {
                    if(item.ids) {
                        item.ids.forEach((id) => {
                            let seats = document.querySelectorAll('.floorsvg .held[data-hold-code-id="' + id + '"]');
                            if(item.price_type_specific) {
                                if(item.display_standard) {

                                }
                                else {
                                    seats.forEach((seat) => {
                                        seat.setAttribute('style', 'fill: ' + item.color +' !important;');
                                    });
                                }
                            }
                            else {
                                if(item.display_standard) {
                                    console.log('should be standard no price type specific');
                                    seats.forEach((seat) => {
                                        seat.classList.add('available');
                                    });
                                }
                                else {
                                    seats.forEach((seat) => {
                                        seat.classList.add('available');
                                        seat.setAttribute('style', 'fill: ' + item.color +' !important;');
                                    });
                                }
                            }

                        });
                    }

                    if(item.custom_message) {
                        item.ids.forEach((id) => {
                            const query = '[data-hold-code-id="' + id + '"]';
                            let seats = document.querySelectorAll(query);
                            seats.forEach((seat) => {
                                if (seat.getAttribute('data-pricing') === id) {
                                    // do nothing because this is enabled
                                }
                                else {
                                    seat.setAttribute('data-priceTypeMessage', item.custom_message);
                                }
                            });

                        });
                    }
                    if(item.custom_icon !== "0") {
                        item.ids.forEach((id) => {
                            const query = '[data-hold-code-id="' + id + '"]';
                            let seats = document.querySelectorAll(query);
                            seats.forEach((seat) => {
                                this.applyIcon(seat, item.custom_icon);
                            });
                        });

                        if(item.add_to_legend === "1") {
                            const legendClass = item.custom_icon;
                            const legendItem = document.getElementsByClassName(legendClass);
                            this.applyLegendIcon(legendItem[0], item.custom_icon);
                        }
                    }
                });
            }
        },

        applyPreviews(previewList) {
            for (const [floor, previews] of Object.entries(previewList)) {
                for (const [name, preview] of Object.entries(previews)) {
                    // create array of objects needing caption, zoneID, url
                    let newPreviewImage = {
                        zoneID: name,
                        caption: preview.caption,
                        url: preview.url
                    };

                    this.previewImages.push(newPreviewImage);
                }

            }
            this.appendPreview();
        },

        applyIcon(seat, icon) {
            const svg = this.customIcons[icon];
            let xCoord = seat.getAttribute('cx');
            let yCoord = seat.getAttribute('cy');
            xCoord = xCoord - 3;
            yCoord = yCoord - 3;
            seat.insertAdjacentHTML('afterend', svg);
            seat.nextSibling.setAttribute('x', xCoord);
            seat.nextSibling.setAttribute('y', yCoord);
        },

        applyLegendIcon(dot, icon) {
            const svg = this.customIcons[icon];
            dot.innerHTML = svg;
            dot.firstElementChild.style.cssText = "height: 14px;width:14px;";
        },

        applyPriceLevels() {

            for (const [id, level] of Object.entries(this.priceLevels)) {

                // find anything that has the price level of id
                // create CSS classes for each price level unless the color is #000000
                // or just add the fill: rgba(level.color, .7) to any circle with that price level attribute

                let priceLevelStylesheet = document.createElement('style');
                let priceLevelStyles = '';
                if(level.color === "#000000") {
                    // ignore, its the default
                }
                else {
                    let rgbColor = this.convertHex(level.color);
                    if(this.priceHover) {
                        priceLevelStyles = priceLevelStyles + '.focus-price-level-'+ id +' .floorsvg .available[data-price-level="' + id + '"]{fill:rgba('+ rgbColor +',.4) !important; transition: fill .2s ease;} .focus-price-level-'+ id +' .floorsvg .available[data-price-level="' + id + '"]:hover{fill:rgba('+ rgbColor +',1) !important; transition: fill .2s ease;}';
                    }
                    if(this.constantColor) {
                        priceLevelStyles = priceLevelStyles + '.floorsvg .available[data-price-level="' + id + '"]{fill:rgba('+ rgbColor +',.4) !important; transition: fill .2s ease;}';
                    }
                    else {
                        priceLevelStyles = priceLevelStyles + '.focus-price-level-'+ id +' .floorsvg .available[data-price-level="' + id + '"]{fill:rgba('+ rgbColor +',.4) !important; transition: fill .2s ease;} .focus-price-level-'+ id +' .floorsvg .available[data-price-level="' + id + '"]{fill:rgba('+ rgbColor +',1) !important; transition: fill .2s ease;}';
                    }
                }
                priceLevelStylesheet.innerHTML = priceLevelStyles;
                document.body.appendChild(priceLevelStylesheet);
            }
        },

        convertHex(hex){
            hex = hex.replace('#','');
            const r = parseInt(hex.substring(0,2), 16);
            const g = parseInt(hex.substring(2,4), 16);
            const b = parseInt(hex.substring(4,6), 16);

            const result = r+','+g+','+b;
            return result;
        },

        focusSeatType(id) {
            this.activeSeatType = id;
        },

        pushToCart(bypass, type, price, typeName) {
            const seat = document.getElementById(this.circleID);
            if(seat.classList.contains('user-selected-seat')) {
                // Can't add the same seat again buddy
            }
            else if(seat.getAttribute('data-priceTypeMessage') && (!bypass) ) {
                // trigger window here with message from seat.
                const holdMessage = seat.getAttribute('data-priceTypeMessage');
                seat.classList.add('user-selected-seat');
                this.cartItem = {
                    priceType:  type,
                    seatType: typeName,
                    seatNumber: this.seatDataNumber,
                    seatRowNumber: this.seatNumber,
                    price: price,
                    formattedPrice: price,
                    perfNo: this.perfnum,
                    zoneName: this.zone,
                    row: this.row,
                    circle: this.circleID,
                    packageId: this.packageid,
                    messaging: this.infoAlertRow,
                }
                this.$emit('showMessage', holdMessage, this.cartItem);
            }
            else {
                if(this.cartTotal < this.max) {

                    seat.classList.add('user-selected-seat');
                    this.cartItem = {
                        priceType:  type,
                        seatType: typeName,
                        seatNumber: this.seatDataNumber,
                        seatRowNumber: this.seatNumber,
                        price: price,
                        formattedPrice: price,
                        perfNo: this.perfnum,
                        zoneName: this.zone,
                        row: this.row,
                        circle: this.circleID,
                        packageId: this.packageid,
                        messaging: this.infoAlertRow,
                    }
                    this.$emit('addToCart', this.cartItem);
                }
                else {
                    // throw up error because you're at the maximum
                    console.log('you at maximum');

                    if(this.max === undefined) {
                        console.log('no maximum');
                        seat.classList.add('user-selected-seat');
                        this.cartItem = {
                            priceType:  type,
                            seatType: typeName,
                            seatNumber: this.seatDataNumber,
                            seatRowNumber: this.seatNumber,
                            price: price,
                            formattedPrice: price,
                            perfNo: this.perfnum,
                            zoneName: this.zone,
                            row: this.row,
                            circle: this.circleID,
                            packageId: this.packageid,
                            messaging: this.infoAlertRow,
                        }
                        this.$emit('addToCart', this.cartItem);
                    }
                }
            }
        },

        formatPrice (price) {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            });

            return formatter.format(price);
        },
    },
    updated: async function () {
        await this.$nextTick;

        if(this.initialLoad === 0) {

            const holds = document.querySelectorAll('.floorsvg .available.held');
            holds.forEach(seat => {
                seat.classList.remove('available');
            });

            // run through hold codes and enable any seats that match
            if(this.holdCodes || this.onlyHoldCodes) {
                this.applyHolds();
            }

            await this.$nextTick;
            const floors = document.querySelectorAll('[id^="floorsvg-"]');
            floors.forEach((floor) => {
                floorAvailableCount = floor.getElementsByClassName('available').length;
                const floorCompareId = floor.getAttribute('data-floor-svg-id');
                let tmpFloorName;
                let tmpPriceMax;
                let tmpPriceMin;
                let tmpTotalCount;
                let tmpMobile;
                let sameMinMax;

                this.svgs.forEach((svg) => {
                    if(parseInt(floorCompareId) === parseInt(svg.id)) {
                        tmpFloorName = svg.floor_name;
                        tmpPriceMax = this.formatPrice(svg.price_max);
                        tmpPriceMin = this.formatPrice(svg.price_min);
                        tmpTotalCount = svg.total_count;

                        if(tmpPriceMax === tmpPriceMin) {
                            sameMinMax = true;
                        }

                        if(this.facility.overviewMap) {
                            for (const [name, info] of Object.entries(this.facility.overview)) {
                                let tmpID = svg.floor_name;
                                tmpID = tmpID.replace(/ /g, '');
                                tmpID = tmpID.replace(/&/g, '');
                                tmpID = tmpID.replace(/,/g, '');
                                if(name === tmpID) {
                                    tmpMobile = info.url;
                                }
                            }
                        }
                    }
                });


                let floorInfo = {
                    floor_name: tmpFloorName,
                    price_max: tmpPriceMax,
                    price_min: tmpPriceMin,
                    total_count: tmpTotalCount,
                    mobile: tmpMobile,
                    available_count: floorAvailableCount,
                    sameMinMax : sameMinMax,
                };
                this.allFloorsInfo.push(floorInfo);
            });



            // add event listener for click of any seats that have the seat type matching whtas in the seat map
            if(this.seatMapInfo) {
                let seatTypeStylesheet = document.createElement('style');
                let seatTypeStyles = '';

                this.seatMapInfo.forEach((seatCodes) => {
                    seatCodes.ids.forEach((id) => {
                        if(!seatCodes.display_standard) {
                            seatTypeStyles = seatTypeStyles + '.floorsvg .available[data-seat-type-id="' + id + '"]{fill:'+ seatCodes.color +' !important; transition: fill .2s ease;}';
                        }
                        const seats = document.querySelectorAll('.floorsvg .available[data-seat-type-id="' + id + '"]');
                        seats.forEach((seat) => {
                            seat.setAttribute('data-seat-info', seatCodes.label);
                            seat.addEventListener('click', (el) => {
                                this.focusSeatType(id);
                            });
                        });
                    });
                });
                seatTypeStylesheet.innerHTML = seatTypeStyles;
                document.body.appendChild(seatTypeStylesheet);
            }



            const seats = document.querySelectorAll('.floorsvg .available');
            seats.forEach(seat => {
                seat.addEventListener('click',(el) => {
                    const tmpseatID = seat.id;
                    this.updateClick(tmpseatID);
                });
                seat.addEventListener('mouseover',() => {
                    const tmpseatID = seat.id;
                    this.updateHover(tmpseatID);
                });
                seat.addEventListener('mouseout',() => {
                    const tmpseatID = seat.id;
                    this.hoverOut(tmpseatID);
                });

            });


            this.initialLoad = 1;
            this.initiateZoom();
            await this.$nextTick;
            if(this.facility) {
                if(this.facility.price_levels) {
                    this.priceLevels = this.facility.price_levels;
                    this.applyPriceLevels();
                }
                if(this.facility.photo_preview) {
                    this.applyPreviews(this.facility.photo_preview);
                }
                if(this.facility.overview) {
                    if(this.overviewSVG) {
                        await this.$nextTick;
                        this.allFloorsInfo.forEach((floor) => {
                            if(floor.available_count === 0) {
                                console.log('none available');
                                let tmpID = floor.floor_name;
                                tmpID = tmpID.replace(/ /g, '');
                                tmpID = tmpID.replace(/&/g, '');
                                tmpID = tmpID.replace(/,/g, '');
                                for (const [id, name] of Object.entries(this.facility.overview)) {
                                    if(tmpID === id) {
                                        document.getElementById(name.svgID).classList.add('disabled');
                                    }
                                }
                            }
                        });

                        const floors = document.querySelectorAll('.overview-svg svg > g');
                        floors.forEach(floor => {
                            if(floor.id === "stage") {
                                // do nothing because its just the stage and we dont have anything with this right now
                            }
                            if(floor.id === "Stage") {
                                // do nothing because its just the stage and we dont have anything with this right now
                            }
                            if(floor.classList.contains('disabled')) {
                                // no click listener
                                floor.addEventListener('mouseover', () => {
                                    this.overviewFloorHover(floor.id);
                                });
                                floor.addEventListener('mouseout', () => {
                                    this.overviewFloorOffHover(floor.id);

                                });
                            }
                            else {
                                floor.addEventListener('click', () => {
                                    this.changeOverviewFloor(floor.id);
                                });
                                floor.addEventListener('mouseover', () => {
                                    this.overviewFloorHover(floor.id);
                                });
                                floor.addEventListener('mouseout', () => {
                                    this.overviewFloorOffHover(floor.id);

                                });
                            }
                        });

                    }
                    else if(this.facility.overviewMap) {
                        this.overviewMap = this.facility.overviewMap;
                        this.overviewMapHold = this.facility.overviewMap;
                        this.overviewMapHeight = this.facility.overviewMapHeight;
                        this.overviewMapWidth = this.facility.overviewMapWidth;
                        await this.$nextTick;

                        for (const [id, name] of Object.entries(this.facility.overview)) {
                            this.allFloorsInfo.forEach((floor) => {
                                if(floor.available_count === 0) {
                                    console.log('none available');
                                    let tmpID = floor.floor_name;
                                    tmpID = tmpID.replace(/ /g, '');
                                    tmpID = tmpID.replace(/&/g, '');
                                    tmpID = tmpID.replace(/,/g, '');
                                    if(tmpID === id) {
                                        document.querySelectorAll('.section-selection-area[data-alt-tag='+ id + ']')[0].classList.add('disabled');
                                    }
                                }
                            });
                        }

                        const floors = document.querySelectorAll('.interactive-map svg .hover_group a');
                        floors.forEach(floor => {
                            const altTag = floor.getAttribute('data-alt-tag');
                            floor.addEventListener('mouseover', () => {
                                this.overviewFloorHover(altTag, 1);
                            });
                            floor.addEventListener('mouseout', () => {
                                this.overviewFloorOffHover(altTag);
                            });
                        });
                    }
                    else {
                        this.noOverview = true;
                        this.activeFloor = 1;
                    }
                }
                else {
                    this.noOverview = true;
                    this.activeFloor = 1;
                }
            }

        }
    },
});



