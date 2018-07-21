#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

lockfilelocation=/tmp/process_lock_
function start_process_and_lock {
	local processID=$1
	local processEXE=$2
	eval $2 &
	echo $! > $lockfilelocation$processID
}

function archive_db {
	local db_from="database/database.db"
	local db_to="database/database_`date +%Y%m%d%H%M`.db"
	log "Archiving db..."
	mv $db_from $db_to
	sqlite3 $db_from < database/init.sql
	log "DB archived as "$db_to
}

function start_windmeter {
	start_process_and_lock windmeter "python datareader/windmeter.py"
}

function start_gpslogger {
	start_process_and_lock gpslogger "python datareader/gpslogger.py"
}

function start_tempmeter {
	log "tempmeter not implemented"
}
function start_chartserver {
	start_process_and_lock chartserver "CHARTS_PATH=chartserver/charts/ node chartserver/index.js"
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
	echo $logstring >> logs/monitor.log
}

last_uptime_check=`cat $lockfilelocation"archive"`

if [ ! -e $lockfilelocation"archive" ] || [ "$last_uptime_check" !=  "`uptime -s`" ] ; then
	archive_db
	uptime -s > $lockfilelocation"archive"
fi


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

if [ $(is_process_running chartserver) -eq 0 ]; then
        log "Stargin chartserver"
        start_chartserver
else
        log "chartserver running"
fi

