from time import sleep
from w1thermsensor import W1ThermSensor

INTERVAL=10

sensor = W1ThermSensor()
while True:
	temp = sensor.get_temperature()
	print temp
	sleep(INTERVAL)
