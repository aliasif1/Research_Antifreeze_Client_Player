/*
*Player is the Dash player class which coordinates the download of segmenst and updation of buffer
*/

const PlaybackStatus = require("../models/playbackStatus")

class Player{
    constructor(scheduler){
         /*
        Initialize the Download Manager
        - scheduler: Instance of Scheduler class
        - playerStatus: Instance of PlaybackStatus
            The current state of the player - IDLE, PLAYING, BUFFERING, FINISHED
        */
        this.scheduler = scheduler
        this.playerStatus = PlaybackStatus.IDLE;
    }

    //satrt the playback
    start = () => {
        this.scheduler.start()
    }
}

export default Player;

