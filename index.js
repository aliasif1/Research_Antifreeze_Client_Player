/*
************* Author - Asif Ali Mehmuda ******************* 
************* Email - asif.mehmuda9@gmail.com ******************* 
This repository contains a Asyncronous JS client source code to simulate a dash player.
*/

const path = require('path');
const {ArgumentParser} = require('argparse');
const playerFactory = require('./scripts/playerFactory');
const Http = require('./scripts/http');

// fetch command line arguments 
const parser = new ArgumentParser({
    description: 'Dash Client-Side Simulator'
})


parser.add_argument('-s', '--save', {help: 'Save the Downloaded Segments or discard them'})
const args = parser.parse_args();

//get the player and run it 
let player = playerFactory();

player.start();


