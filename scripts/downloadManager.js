/*
 *Download manager class manages the download of individual segments 
 *It downloads one segment at a time and when the download completes it notifies the bandwidth monitor 
*/

const { DownloaderHelper } = require('node-downloader-helper');

class DownloadManager{
    constructor(destination, bandwidthMonitor, options, updateProgressInterval){
        /*
        Initialize the Download Manager
        - destination: String
            The absolute path where the segment should be downloaded 
        - bandwidthMonitor: Instance of BandwidthMonitor class
        - options: Object
            Configuration options for the node downloader helper class 
        - updateProgressInterval: Integer
            The update time for monitoring the download progress in msec
        - downloadHistory: List<Objects> 
            List of download data objects. Each data object contains the segment name and the timestamps - start time, end time
        - isBusy: Boolean
            Is the Download Manager busy 
        - downloadStartTime: DateTime 
            when the download started 
        - downloadEndTime: DateTime 
            when the download finished 
        */
        this.destination = destination;
        this.options = options;
        this.bandwidthMonitor = bandwidthMonitor;
        this.updateProgressInterval = updateProgressInterval;
        this.downloadHistory = [];
        this.isBusy = false;
        this.downloadStartTime = null;
        this.downloadEndTime = null; 
    }

    
    startDownload = async (url) => {
        console.log('Download: ' + url);
        this.isBusy = true;
        const dl = new DownloaderHelper(url, this.destination, this.options);
        let startTime = new Date(); //for updating the progress fo download 
        dl
        .once('download', (downloadInfo) => {
            startTime = new Date();
            this.downloadStartTime = new Date();
            console.log('Download Initialized');
        })
        .on('download', downloadInfo => {
            this.fileName = downloadInfo.fileName.toString();
            this.fileSize = parseInt(downloadInfo.totalSize);
            console.log('Download Begins: ',
            {
                name: this.fileName,
                total: this.fileSize
            });
        })
        .on('end', downloadInfo => {
            this.downloadEndTime = new Date();
            const duration = this.downloadEndTime - this.downloadStartTime;
            console.log('Download Completed: ', downloadInfo);
            const bytesDownloaded = parseInt(downloadInfo.downloadedSize);
            //update the bandwidth 
            this.bandwidthMonitor.updateBandwidth(bytesDownloaded , duration);
            this.finishDownload();
        })
        .on('error', err => console.error('An error occured', err))
        .on('retry', (attempt, opts) => {
            console.log(
                'Retry Attempt:', attempt + '/' + opts.maxRetries,
                'Starts in:', opts.delay / 1000, 'secs'
            );
        })
        .on('stateChanged', state => console.log('State: ', state))
        .on('renamed', filePaths => console.log('File Renamed to: ', filePaths.fileName))
        .on('progress', stats => {
            const progress = stats.progress.toFixed(1);
            const speed = (stats.speed);
            const downloaded = (stats.downloaded);
            const total = (stats.total);
            const currentTime = new Date();
            const elaspsedTime = currentTime - startTime;
            if (elaspsedTime > this.updateProgressInterval) {
                startTime = currentTime;
                console.log(`${speed}/s - ${progress}% [${downloaded}/${total}]`);
                //Future - Data can be sent to the bandwidth monitor 
            }
        });
        try{
            await dl.start();
        }
        catch(e){
            console.log('Error Ooccured while downloadin:' + url);
        }
    }

    finishDownload = () => {
        this.isBusy = false;
    }

}

module.exports = DownloadManager