import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
from time import sleep
import math
import sqlite3


PIN=18
GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BCM) # Use physical pin numbering
GPIO.setup(PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Set pin 10 to be an input pin and set initial value to be pulled low (off)


count = 0
radius_cm = 9.0		# Radius of the anemometer
interval = 5		# How often to report speed
ADJUSTMENT = 1.18	# Adjustment for weight of cups
CM_IN_A_KM = 100000.0
SECS_IN_AN_HOUR = 3600

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
    print "ngger"
    count = count + 1

GPIO.add_event_detect(PIN,GPIO.RISING,callback=spin)

conn = sqlite3.connect('../database/database.db')
c = conn.cursor()


while True:
    count = 0
    sleep(interval)
    print calculate_speed(interval)
   
