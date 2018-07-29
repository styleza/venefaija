import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
import Adafruit_ADS1x15
from time import sleep
import math
import sqlite3


PIN=18
GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BCM) # Use physical pin numbering
GPIO.setup(PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Set pin 10 to be an input pin and set initial value to be pulled low (off)


count = 0
radius_cm = 9.0		# Radius of the anemometer
interval = 10		# How often to report speed
samplecount = 10	# how many samples should we take in interval
ADJUSTMENT = 1.18	# Adjustment for weight of cups
CM_IN_A_KM = 100000.0
SECS_IN_AN_HOUR = 3600

adc = Adafruit_ADS1x15.ADS1015(address=0x48, busnum=1)
# Choose a gain of 1 for reading voltages from 0 to 4.09V.
# Or pick a different gain to change the range of voltages that are read:
#  - 2/3 = +/-6.144V
#  -   1 = +/-4.096V
#  -   2 = +/-2.048V
#  -   4 = +/-1.024V
#  -   8 = +/-0.512V
#  -  16 = +/-0.256V
# See table 3 in the ADS1015/ADS1115 datasheet for more info on gain.
GAIN = 1
READ_PIN=3 # What ADC pin should we read

LOOKUP_TABLE=[
        {'direction': 0, 'data': 1516},
        {'direction': 22.5, 'data': 1328},
        {'direction': 45, 'data': 1423},
        {'direction': 67.5, 'data': 1128},
        {'direction': 90, 'data': 1261},
        {'direction': 112.5, 'data': 655},
        {'direction': 135, 'data': 744},
        {'direction': 157.5, 'data': 137},
        {'direction': 180, 'data': 151},
        {'direction': 202.5, 'data': 107},
        {'direction': 225, 'data': 298},
        {'direction': 247.5, 'data': 204},
        {'direction': 270, 'data': 463},
        {'direction': 292.5, 'data': 395},
        {'direction': 315, 'data': 1015},
        {'direction': 337.5, 'data': 965}
]

def calculate_speed(time_sec):
    global count
    circumference_cm = (2 * math.pi) * radius_cm
    rotations = count / 2.0

    dist_km = (circumference_cm * rotations) / CM_IN_A_KM

    km_per_sec = dist_km / time_sec
    km_per_hour = km_per_sec * SECS_IN_AN_HOUR

    return km_per_hour * ADJUSTMENT

def spin(negger):
    global count
    count = count + 1


def get_direction():
	global READ_PIN,GAIN,LOOKUP_TABLE
	value = adc.read_adc(READ_PIN, gain=GAIN)
	direction_data = [x for x in LOOKUP_TABLE if x['data']-5 < value and x['data']+5 > value]
	if(len(direction_data) != 1):
		return False
	return direction_data[0]['direction']

def most_common(lst):
	return max(set(lst), key=lst.count)

def mean(lst):
	return float(sum(lst)) / max(len(lst), 1)

GPIO.add_event_detect(PIN,GPIO.RISING,callback=spin)



while True:
    count = 0
    dir = []
    speed = []
    for i in range(0, samplecount):
        dir.append(get_direction())
        sleep(interval / samplecount)
        speed.append(calculate_speed(interval / samplecount))
        count = 0
    direction = most_common(dir)
    real_speed = mean(speed)
    print "Direction",direction,"Raw",dir
    print "Speed",real_speed,"Raw",speed

