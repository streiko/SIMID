const QUARTER_THE_SIZE = .25;
const THIRTY_FIVE_PERCENT = .35;
const HALF_THE_SIZE = .5;
const THREE_QUARTERS_THE_SIZE = .75;

/** This creative expands and collapses when the user hovers over the banner. */
class HoverNonLinear extends BaseSimidCreative {
    constructor() {
        super();

        this.initialDimensions_ = null;
        this.videoDimensionWidth_ = null;
        this.videoDimensionHeight_ = null;
    }

    /** @override */
    onInit(eventData) {
        super.onInit(eventData);
        this.initialDimensions_ = this.environmentData.creativeDimensions;
        this.videoDimensionHeight_ = this.environmentData.videoDimensions.height;
        this.videoDimensionWidth_ = this.environmentData.videoDimensions.width;
    }

    /** @override */
    onStart(eventData) {
        super.onStart(eventData);
        this.addActions_();
    }

    /**
     * Adds actions to different buttons available on the overlay.
     * @private
     */
    addActions_() {
        this.sendMessageOnClick_('close_ad', CreativeMessage.REQUEST_STOP);
        this.onHover_('content_container', 'mouseover');
        this.onMouseOut_('content_container', 'mouseout');
    }

    /**
     * Sends a SIMID message whenever an element is clicked.
     * @param {String} elementName The name of the element.
     * @param {String} message The message to send to the player.
     * @private
     */
    sendMessageOnClick_(elementName, message) {
        const sendMessageFunction = () => {this.simidProtocol.sendMessage(message);}
        document.getElementById(elementName).addEventListener('click', sendMessageFunction);
    }

    /**
     * Adds a hover event listener to the contents of the iframe that expands the iframe.
     * @param {String} elementName The name of the element.
     * @param {Event} event The event performed on the element.
     * @private
     */   
    onHover_(elementName, event) {
        const expandOnHoverFunction = () => {
            const newDimensions = {};
            let resizeParams = {};

            let desiredX;
            let desiredWidth;
            let desiredY;
            let desiredHeight;
            let fullCreativeWidth;
            let fullCreativeHeight;

            //Grow 50% on the left
            console.log(this.initialDimensions_.x);
            desiredX = this.initialDimensions_.x * .2;
            console.log(desiredX);
            //check to see if it should be .8 or .6
            console.log(this.initialDimensions_.width);
            desiredWidth = parseInt(this.initialDimensions_.width) + parseInt(this.initialDimensions_.x * 1.6);
            console.log(desiredWidth);

            //makes sure x offset fits in the player
            if (desiredX <= 0) {
                desiredX = 0;
                desiredWidth = this.initialDimensions_.width * 1.2;
            }
            if (desiredX > this.videoDimensionWidth_) {
                return;
            }

            //makes sure width fits in the player
            fullCreativeWidth = desiredX + desiredWidth;
            if (fullCreativeWidth > this.videoDimensionWidth_) {
                fullCreativeWidth = this.videoDimensionWidth_;
                desiredWidth = fullCreativeWidth - desiredX;
            }
            
            desiredY = this.initialDimensions_.y * .2;
            desiredHeight = parseInt(this.initialDimensions_.height) + parseInt(this.initialDimensions_.y * 1.6);

            //makes sure y offset fits in the player
            if (desiredY <= 0) {
                desiredY = 0;
                desiredHeight = this.initialDimensions_.height * 1.2;
            }
            if (desiredY > this.videoDimensionHeight_) {
                return;
            }

            //makes sure height fits in the player
            fullCreativeHeight = desiredY + desiredHeight;
            if (fullCreativeHeight > this.videoDimensionHeight_) {
                fullCreativeHeight = this.videoDimensionHeight_;
                desiredHeight = fullCreativeHeight - desiredY;
            }

            newDimensions.x = desiredX;
            newDimensions.y = desiredY;
            newDimensions.width = desiredWidth;
            newDimensions.height = desiredHeight;

            resizeParams = {
                creativeDimensions: newDimensions,
                videoDimensions: this.environmentData.videoDimensions,
            };
            
            this.requestResize(resizeParams);
        }
        document.getElementById(elementName).addEventListener(event, expandOnHoverFunction);
    }

    /**
     * Adds a mouse out event listener to the contents of the iframe that shrinks the iframe
     *  back to its original size.
     * @param {String} elementName The name of the element.
     * @param {Event} event The event performed on the element.
     * @private
     */  
    onMouseOut_(elementName, event) {
        const collpaseOnMouseOutFunction = () => {
            const restoreParams = {
                creativeDimensions: this.initialDimensions_,
                videoDimensions: this.environmentData.videoDimensions,
            };
        
            this.requestResize(restoreParams);
        }
        document.getElementById(elementName).addEventListener(event, collpaseOnMouseOutFunction);
    }
}