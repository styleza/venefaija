from time import sleep
from w1thermsensor import W1ThermSensor
import sqlite3

INTERVAL=10

sensor = W1ThermSensor()

conn = sqlite3.connect('database/database.db')
c = conn.cursor()


while True:
	temp = sensor.get_temperature()
	print temp
	sleep(INTERVAL)
	c.execute("INSERT INTO temp_records (temp) VALUES ("+str(temp)+")")
	conn.commit()

