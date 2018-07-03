import time

# Import the ADS1x15 module.
import Adafruit_ADS1x15

adc = Adafruit_ADS1x15.ADS1015()

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
READ_PIN=3
READ_TIME=5

LOOKUP_TABLE=[
        {'direction': 0, 'data': 1599},
        {'direction': 22.5, 'data': 1522},
        {'direction': 45, 'data': 1562},
        {'direction': 67.5, 'data': 1426},
        {'direction': 90, 'data': 1492},
        {'direction': 112.5, 'data': 1092},
        {'direction': 135, 'data': 1171},
        {'direction': 157.5, 'data': 350},
        {'direction': 180, 'data': 382},
        {'direction': 202.5, 'data': 283},
        {'direction': 225, 'data': 655},
        {'direction': 247.5, 'data': 490},
        {'direction': 270, 'data': 889},
        {'direction': 292.5, 'data': 799},
        {'direction': 315, 'data': 1362},
        {'direction': 337.5, 'data': 1331}
]

while True:
    value = adc.read_adc(READ_PIN, gain=GAIN)
    direction_data = [x for x in LOOKUP_TABLE if x['data']-5 < value and x['data']+5 > value]
    if(len(direction_data) != 1):
      print "ERRROR"
      continue
    direction = direction_data[0]['direction']
    print "DIR",direction,"VAL",value
    time.sleep(READ_TIME)

