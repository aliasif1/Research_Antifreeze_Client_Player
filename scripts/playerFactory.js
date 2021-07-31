/*
*The player factory configues the dash playerand returns the dash player
*/

const path = require('path');
const BandwidthMonitor = require('./bandwidthMonitor');
const DownloadManager = require('./downloadManager');
const {initialBitrate} = require('./config');
const Scheduler = require('./scheduler');

function playerFactory(){
    //set up the bandwidth monitor
    let bandwidthMonitor = new BandwidthMonitor();
    //set up the download manager 
    const destination = path.join(__dirname, '../', 'downloads');
    const updateProgressInterval = 200; //msec 
    const options = {};
    let downloadManager = new DownloadManager(destination, bandwidthMonitor, options, updateProgressInterval);
    const urls = [
        'http://199.116.235.101:5000/videos/bugs_bunny_2sec_1080p.mp4',
        'http://199.116.235.101:5000/videos/bugs_bunny_2sec_1080p.mp4',
        // 'http://199.116.235.101:5000/videos/bugs_bunny_2sec_1080p.mp4',
        // 'http://199.116.235.101:5000/videos/bugs_bunny_2sec_1080p.mp4',
        // 'http://199.116.235.101:5000/videos/bugs_bunny_2sec_1080p.mp4',
    ];
    let scheduler = new Scheduler(downloadManager, bandwidthMonitor, urls);
    return scheduler;
}

module.exports = playerFactory;




