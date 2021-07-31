/*
The scheduler coordinates the download of segments
*/

const sleep = require("sleep-promise");
const Http = require("./http");

class Scheduler{
    constructor(downloadManager, bandwidthMonitor, urls){
         /*
        Initialize the Scheduler
        - downloadManager: Instance of DownloadManager class 
        - bandwidthMonitor: Instance of BandwidthMonitor class
            Configuration options for the node downloader helper class 
        - urls: List<String>
            The list of urls to be downloaded 
        - schedulerRunning: Boolean
            Is the schedular running
        _ index: Integer
            What segment index is being downloaded 
        */
        this.downloadManager = downloadManager;   
        this.bandwidthMonitor = bandwidthMonitor;     
        this.schedulerRunning = false;
        this.segments = urls;
        this.index = 0;
    }

    start = async () => {
        this.schedulerRunning = true;
        this.updatePlayback();
        while (this.schedulerRunning){ 
            let url = this.segments[this.index];
            let downloadResponse = await this.downloadManager.startDownload(url);            
            if(downloadResponse === 'fail'){
                console.log('download failed');
            }
            const currentBandwidth = this.bandwidthMonitor.bandwidth; 
            try{
                const serverResponse = await Http.sendFeedback(currentBandwidth);
                console.log(serverResponse)
                this.index+=1;
                if(this.index >= this.segments.length){
                    break;
                }
            }
            catch(error){
                console.log('Error sending data to backend');
                break;
            }
        }
        this.stop();
    }

    updatePlayback = async () => {
        while(this.schedulerRunning){
            await sleep(200);
            console.log('again');
        }
    }

    forceStop = () => {
        this.stop();
    }

    stop = () => {
        this.schedulerRunning = false;
        console.log('Finished');
    }

}

module.exports = Scheduler;