/*
 * Bandwidth Monitor class monitors the bandwidth/throughput 
 * It keeps track of past throughput history
 * It records segment level throughhput 
 * Future work - Record chunk level throughput as well 
*/


class BandwidthMonitor{
    constructor(){
        /*
        Initialize the Bandwidth Monitor
        - bandwidth: Integer
            The latest calculated bandwidth in bytes/sec
        - bandwidthHistory: List<bandwidth>
            The bandwidth history List with index 0 being the latest bandwidth and last index being the oldest bandwidth 
        */ 
        this.bandwidth = null // bytes/sec
        this.bandwidthHistory = [];
    }

    updateBandwidth = (bytesTransferred, duration) => {
        /*
        Update the bandwidth 
        ----params-----
        - bytesTransferred: Integer
            The bytes transferred in the transfer 
        - duration - Integer
            The duration of the transfer in msec
        */
        const throughput = parseInt(bytesTransferred * 1000 / duration) // bytes/sec  
        this.bandwidth = throughput;
        this.bandwidthHistory.unshift(throughput);
    }

}

module.exports = BandwidthMonitor;

