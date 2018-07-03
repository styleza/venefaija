import gps
import sqlite3

# Listen on port 2947 (gpsd) of localhost
session = gps.gps("localhost", "2947")
session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)


while True:
	try:
		report = session.next()
		# Wait for a 'TPV' report and display the current time
		# To see all report data, uncomment the line below
		# print report
		if report['class'] == 'TPV':
			speed=0
			lon=0
			lat=0
			elevation=0
			heading=0
			
			if hasattr(report, 'speed'):
				speed=report.speed
			if hasattr(report, 'lon'):
				lon=report.lon
			if hasattr(report, 'lat'):
				lat=report.lat
			if hasattr(report, 'alt'):
				elevation=report.alt
			if hasattr(report, 'track'):
				heading=report.track
                        print "(%f, %f, %f, %f, %f)" % (speed, lon, lat, elevation, heading)
	except KeyError:
		pass
	except KeyboardInterrupt:
		quit()
	except StopIteration:
		session = None
		print "GPSD has terminated"
