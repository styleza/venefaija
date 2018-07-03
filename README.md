# Venefaija

## Requirements
### Server requirements
* python
* npm
* sqlite


## Folder/module structure

### config
configuration files

### datareader
Reads data from sensors and puts it to database

There are also _debug.py files that can be run manually to see whether sensors are working or not

### api
REST api to fetch data

### frontend
UI program

### database
SQLLite database for datareader and api

## Setting up and running
### Raspberry PI setup
`sudo nano /boot/cmdline.txt`

And change

`dwc_otg.lpm_enable=0 console=ttyAMA0,115200 kgdboc=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait`

To

`dwc_otg.lpm_enable=0 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait`

Run

`sudo systemctl stop serial-getty@ttyAMA0.service`

`sudo systemctl disable serial-getty@ttyAMA0.service`

And make sure that getty is not running (using `ps aux | grep getty` for example)

Run

`sudo raspi-config`

Go to interfacing options and Enable I2C, 1-Wire
And disable Shell login but enable serial port hardware

Edit `sudo nano /boot/config.txt`

And add following lines to bottom

`dtparam=spi=on`

`dtoverlay=pi3-disable-bt`

`enable_uart=1`

`force_turbo=1`

More info at
https://learn.adafruit.com/adafruit-ultimate-gps-on-the-raspberry-pi?view=all#using-uart-instead-of-usb
https://www.modmypi.com/blog/ds18b20-one-wire-digital-temperature-sensor-and-the-raspberry-pi


### Database
Run in root directory of this project
`sqlite3 ./database/database.db` and in SQL console `.read ./database/init.sql`

### Data readers
You can run _debug.py files as follows: `python gpslogger_debug.py` or `python windmeter_debug.py`

To start the the constant data logging run monitor.sh

You should also add following line to the crontab to make sure that all data readers are constantly and always running
`* * * * * [folder]/venefaija/datareader/monitor.sh >> /var/log/monitor_venefaija.log 2>&1`

### Frontend
To install dependecies run `npm install`

To build the frontend run `npm run build`

To start development server run `npm run start`

### API
@TODO

## Raspberry PI setup
@TODO: image about connection schematics

