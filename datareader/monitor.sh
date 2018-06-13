#!/bin/bash

lockfilelocation=/tmp/process_lock_
function start_process_and_lock {
	local processID=$1
	local processEXE=$2
	eval $2 &
	echo $! > $lockfilelocation$processID
}

function start_windmeter {
	start_process_and_lock windmeter "python windmeter.py"
}

function start_gpslogger {
	log "gpslogger not implemented"
}

function start_tempmeter {
	log "tempmeter not implemented"
}

function is_process_running {
	local processID=$1
	if [ -e $lockfilelocation$processID ] && kill -0 `cat $lockfilelocation$processID`; then
		echo 1
	else
		echo 0
	fi
}

function log {
	local logstring="`date` $1"
	echo $logstring
	echo $logstring >> ../logs/monitor.log
}

if [ $(is_process_running windmeter) -eq 0 ]; then
	log "Stargin windmeter"
	start_windmeter
else
	log "Wind meter running"
fi

if [ $(is_process_running gpslogger) -eq 0 ]; then
        log "Stargin GPS logger"
        start_gpslogger
else
        log "GPS logger running"
fi

if [ $(is_process_running tempmeter) -eq 0 ]; then
        log "Stargin tempmeter"
        start_tempmeter
else
        log "Tempmeter running"
fi

