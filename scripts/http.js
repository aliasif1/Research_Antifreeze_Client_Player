const axios = require('axios');
/*
This script sends http requests
*/

class Http{
    static sendFeedback = async (bandwidth) => {
        const URL = 'http://localhost:4400/transcode/feedback';
        const data = {
            bandwidth,
        }
        try{
            const response = await axios.post(URL, data);
            return response.data;
        }
        catch(error){
            throw error;
        }
    }
}


module.exports = Http;