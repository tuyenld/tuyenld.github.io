---
layout: post
title: Show me webcam project
categories:
- linux
comments: true
---

# RasPi

## Username

```bash
pi:raspberry
```



## Enable SSH

```bash
# vi /boot/wpa_supplicant.conf

ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US
 
network={
    ssid="openwrt"
    psk="tregiengchan"
    scan_ssid=1
}

# touch /boot/ssh

# vi /boot/config.txt

# Enable UART
enable_uart=1

```



# Showmewebcam

## Run manually

```bash
# Rebuild
make piwebcam-rebuild

### Second build ###
cd showmewebcam
BOARDNAME=raspberrypi0
BUILDROOT_DIR=../buildroot
# Pi Zero without Wi-Fi
target_defconfig=raspberrypi0_defconfig

BR2_EXTERNAL="$(pwd)" make O="$(pwd)/output/$BOARDNAME" -C "$BUILDROOT_DIR" "$target_defconfig"
make -C "output/$BOARDNAME" all
#----------------------------------------------------
# Run showmewebcam manually

# cat /boot/cmdline.txt 
root=/dev/mmcblk0p2 rootwait console=tty1 console=ttyAMA0,115200 rootfstype=squashfs ro modules-load=dwc2,libcomposite quiet

# cat /boot/config.txt 
gpu_mem_256=100
gpu_mem_512=100
gpu_mem_1024=100
dtoverlay=dwc2

# Make sure bcm2835-v4l2 is installed
# if not, you can't see /dev/video0
modprobe bcm2835-v4l2

/opt/uvc-webcam/uvc-gadget -l -p 21 -b 3 -u /dev/video1 -v /dev/video0
Usage: /opt/uvc-webcam/uvc-gadget [options]
Available options are
 -b value    Blink X times on startup (b/w 1 and 20 with led0 or GPIO pin if defined)
 -f device   Framebuffer device
 -h          Print this help screen and exit
 -l          Use onboard led0 for streaming status indication
 -n value    Number of Video buffers (b/w 2 and 32)
 -p value    GPIO pin number for streaming status indication
 -r value    Framerate for framebuffer (b/w 1 and 30)
 -u device   UVC Video Output device
 -v device   V4L2 Video Capture device
 -x          show fps information

#----------------------------------------------------
# Test Deep Learning
/opt/uvc-webcam/uvc-gadget -u /dev/video1 -f /dev/fb0


INFO: Framebuffer width:  640
INFO: Framebuffer height: 480

FB: Opening /dev/fb0 device
FB: Resolution: 640x480
FB: Bits per pixel: 32
FB: Line length: 2560
FB: Memory size: 1228800


#----------------------------------------------------

# image location
buildroot/images/rpi-firmware/

# change config
$ mount -o remount,rw /boot
$ vi  /boot/camera.txt
auto_exposure_bias=15
brightness=74
## OR
$ v4l2-ctl -d /dev/video0 -c auto_exposure_bias=15
$ v4l2-ctl -d /dev/video0 -c brightness=74

# gpu_mem_512=100
# cat /proc/meminfo|grep Mem
MemTotal:         405836 kB
MemFree:          365340 kB
MemAvailable:     377740 kB

#----------------------------------------------------
# Add custom bash
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/boot/rpi-fbcp/lib/

```

## Mount /boot manually ([ref](https://cellux.github.io/articles/diy-linux-with-buildroot-part-1/))

```bash
# mmcblk0p2: rootfs partition; mmcblk0p1: boot partition
mount /dev/mmcblk0p2 /mnt/sdcard/
cd /mnt/sdcard/
mkdir boot
vi etc/fstab
/dev/mmcblk0p1 /boot vfat defaults 0 0

umount /mnt/sdcard

# Mount image *.img
sudo mkdir /mnt/sdcard
sudo kpartx -a -v sdcard.img
sudo mount /dev/mapper/loop0p1 /mnt/sdcard/

## Unmount
sudo umount /mnt/sdcard
sudo kpartx -d sdcard.img
```



## v4l2grab

```bash
# ./v4l2grab --help
Usage: ./v4l2grab [options]

Options:
-d | --device name   Video device name [/dev/video0]
-h | --help          Print this message
-o | --output        Set JPEG output filename
-q | --quality       Set JPEG quality (0-100)

-m | --mmap          Use memory mapped buffers [default]
-r | --read          Use read() calls
-u | --userptr       Use application allocated buffers

-W | --width         Set image width
-H | --height        Set image height
-I | --interval      Set frame interval (fps) (-1 to skip)
-c | --continuous    Do continous capture, stop with SIGINT.
-v | --version       Print version

## mmap
/opt/uvc-webcam/v4l2grab -d /dev/video0 -o test_2592.jpg -W 2592 -H 1944
Output: test_2592.jpg > 2592x1944 > 139,8 kB 

## userptr
/opt/uvc-webcam/v4l2grab -u -d /dev/video0 -o test_2592.jpg -W 2592 -H 1944
>> /dev/video0 does not support user pointer i/o

# V4L2_PIX_FMT_YUV420 -> V4L2_PIX_FMT_MJPEG
./v4l2grab -d /dev/video0 -o test_2592.jpg -W 2592 -H 1944
libv4l2: error dequeuing buf: Resource temporarily unavailable

./v4l2grab -d /dev/video0 -o test_1440.jpg -W 1440 -H 1080
```



## coredump

```bash

$ cat /proc/sys/kernel/core_pattern
core
# >> The core dump is written in the current directory of the process 
# >> at the time of the crash.

# to enable core dumps
$ ulimit -c unlimited 

# where $pid is the process ID of the process. 
# That link will point to the current working directory of that process.
$ ls -l /proc/186/cwd 
lrwxrwxrwx    1 root     root             0 Feb  7 16:28 /proc/207/cwd -> /tmp


```

## Remount boot

```bash
mount -o remount,rw /boot
```


## dwc2


## uvc gadget

This wiki page shows you how to configure and use the linux UVC gadget driver. The user has 2 ways of configuring a UVC gadget: using the g_webcam kernel module and through configfs. Following you will find the the instructions for both methods. [^1]


## enabling configfs, example

```bash
Symbol: CONFIGFS_FS [=n]
Prompt: Userspace-driven configuration filesystem
  Defined at fs/configfs/Kconfig:1
  Depends on: SYSFS
  Location:
    -> Kernel configuration
      -> File systems
        -> Pseudo filesystems                                                                              
  Selected by: NETCONSOLE_DYNAMIC && NETDEVICES && NETCONSOLE && SYSFS && EXPERIMENTAL || DLM && EXPERIMENT

# First, verify your kernel has support for configfs.
$ fgrep configfs /proc/filesystems
nodev	configfs

```

```bash
# https://events.static.linuxfound.org/sites/events/files/slides/USB%20Gadget%20Configfs%20API_0.pdf

# >> Mounting USB Gadget ConfigFS
# mount [options] <source> <directory>
# -t --types <list>      limit the set of filesystem types
$ mount -t configfs none /sys/kernel/config
# check whether configfs was mounted
$ mount | grep configfs
configfs on /sys/kernel/config type configfs (rw,nosuid,nodev,noexec,relatime)
$ ls /sys/kernel/config
usb_gadget # If USB Gadget configfs support is enabled we’ll have a usb_gadget subdirectory present
$ cd usb_gadget

# >> Create 2xACM + ECM Gadget
# By creating the g1 directory, we’ve instantiated a new gadget device template to fill in
$ mkdir g1
$ cd g1
$ ls
UDC           bDeviceProtocol  bMaxPacketSize0  
bcdUSB   functions  idVendorbDeviceClass  
bDeviceSubClass  bcdDevice        configs  idProduct  strings

# Write in our vendor/product IDs
$ echo "0x1d6b" > idVendor
$ echo "0x0104" > idProduct

# Instantiate English language strings
# 0x409 ??
$ mkdir strings/0x409
$ ls strings/0x409/
manufacturer  product  serialnumber

# Write in our serial number, manufacturer, and product descriptor strings
$ echo "0123456789" > strings/0x409/serialnumber
$ echo "Foo Inc." > strings/0x409/manufacturer
$ echo "Bar Gadget" > strings/0x409/product

# Create function instances. 
# Note that multiple function instances of the same type 
# must have a unique extension
$ mkdir functions/acm.GS0
$ mkdir functions/acm.GS1
$ mkdir functions/ecm.usb0

# Create a configuration instance
$ mkdir configs/c.1
$ ls configs/c.1
MaxPower  bmAttributes  strings

# Create English language strings 
# and write in a description for this device configuration 
$ mkdir configs/c.1/strings/0x409
$ ls configs/c.1/strings/0x409/
configuration
$ echo "CDC 2xACM+ECM" > configs/c.1/strings/0x409/configuration

# Bind each of our function instances to this configuration
$ ln -s functions/acm.GS0 configs/c.1
$ ln -s functions/acm.GS1 configs/c.1
$ ln -s functions/ecm.usb0 configs/c.1

# Verify which UDC drivers are available
$ ls /sys/class/udc/
3f120000.usb
# Attach the created gadget device to our UDC driver.
$ echo "3f120000.usb" > UDC
```

----

## Sensor Modes [^2]

The Pi’s camera modules have a discrete set of modes that they can use to output data to the GPU. On the V1 module these are as follows:

| #    | Resolution | Aspect Ratio | Framerates      | Video | Image | FoV     | Binning |
| ---- | ---------- | ------------ | --------------- | ----- | ----- | ------- | ------- |
| 1    | 1920x1080  | 16:9         | 1 < fps <= 30   | x     |       | Partial | None    |
| 2    | 2592x1944  | 4:3          | 1 < fps <= 15   | x     | x     | Full    | None    |
| 3    | 2592x1944  | 4:3          | 1/6 <= fps <= 1 | x     | x     | Full    | None    |
| 4    | 1296x972   | 4:3          | 1 < fps <= 42   | x     |       | Full    | 2x2     |
| 5    | 1296x730   | 16:9         | 1 < fps <= 49   | x     |       | Full    | 2x2     |
| 6    | 640x480    | 4:3          | 42 < fps <= 60  | x     |       | Full    | 4x4     |
| 7    | 640x480    | 4:3          | 60 < fps <= 90  | x     |       | Full    | 4x4     |

On the V2 module, these are:

| #    | Resolution | Aspect Ratio | Framerates        | Video | Image | FoV     | Binning |
| ---- | ---------- | ------------ | ----------------- | ----- | ----- | ------- | ------- |
| 1    | 1920x1080  | 16:9         | 1/10 <= fps <= 30 | x     |       | Partial | None    |
| 2    | 3280x2464  | 4:3          | 1/10 <= fps <= 15 | x     | x     | Full    | None    |
| 3    | 3280x2464  | 4:3          | 1/10 <= fps <= 15 | x     | x     | Full    | None    |
| 4    | 1640x1232  | 4:3          | 1/10 <= fps <= 40 | x     |       | Full    | 2x2     |
| 5    | 1640x922   | 16:9         | 1/10 <= fps <= 40 | x     |       | Full    | 2x2     |
| 6    | 1280x720   | 16:9         | 40 < fps <= 90    | x     |       | Partial | 2x2     |
| 7    | 640x480    | 4:3          | 40 < fps <= 90    | x     |       | Partial | 2x2     |

HQ Camera

| Mode | Size                | Aspect Ratio | Frame rates | FOV     | Binning/Scaling |
| ---- | ------------------- | ------------ | ----------- | ------- | --------------- |
| 0    | automatic selection |              |             |         |                 |
| 1    | 2028x1080           | 169:90       | 0.1-50fps   | Partial | 2x2 binned      |
| 2    | 2028x1520           | 4:3          | 0.1-50fps   | Full    | 2x2 binned      |
| 3    | 4056x3040           | 4:3          | 0.005-10fps | Full    | None            |
| 4    | 1012x760            | 4:3          | 50.1-120fps | Full    | 4x4 Scaled      |

I should also explain why I called your  interpretation "wrong": the modes listed aren't the "supported  resolutions". In fact, if you try `v4l2-ctl --list-formats-ext` with the pi camera module's V4L2 driver loaded (`sudo modprobe bcm2835-v4l2`) you'll see it lists a load of modes with "Size: Stepwise 32x32 -  2592x1944 with step 2/2" (thats from a v1 module). That means it  supports literally any resolution from 32x32 up to 2592x1944 in steps of 2x2; the firmware will do its best to maximize FoV for the selected  res, but naturally there are limits to that ([ref](https://raspberrypi.stackexchange.com/a/58873))

## Debug

```bash
# Show log
journalctl --no-pager -u piwebcam.service

#-----------------------------------------
# Show version
$ cat /proc/cpuinfo
processor       : 0
model name      : ARMv6-compatible processor rev 7 (v6l)
BogoMIPS        : 697.95
Features        : half thumb fastmult vfp edsp java tls
CPU implementer : 0x41
CPU architecture: 7
CPU variant     : 0x0
CPU part        : 0xb76
CPU revision    : 7

Hardware        : BCM2835
Revision        : 900093
Serial          : 0000000069cf618c
Model           : Raspberry Pi Zero Rev 1

$ cat /proc/version
Linux version 4.19.113 (ldtuyen@pc) (gcc version 8.4.0 (Buildroot 2020.02.3)) #1 Fri Oct 2 22:32:09 +07 2020

#-----------------------------------------



#-----------------------------------------



#-----------------------------------------


#-----------------------------------------

```



## Copy, transfer file

```bash
# Recieve / send file throug serial
make lrzsz-rebuild
copy buildroot/output/target/usr/bin/sz, buildroot/output/target/usr/bin/rz TO /usr/bin

# zmodem     /usr/bin/sz -vv -b
## send file to remote
minicom Ctrl-A-s > zmodem

## recieve file from remote
# excute on remote, minicom will automatic save remove file in current dir
sz test_1440.jpg 

#--------------------------------------
https://gist.github.com/gbaman/50b6cca61dd1c3f88f41#file-howtootg-md
https://blog.gbaman.info/?p=699

# sudo dd if=/dev/zero of=/piusb.bin bs=512 count=2880
2880+0 records in                                                               
2880+0 records out                                                              
1474560 bytes (1.5 MB, 1.4 MiB) copied, 0.089888 s, 16.4 MB/s                                                              
# sudo mkdosfs /piusb.bin                      
mkfs.fat 4.1 (2017-01-24)                                                       
# sudo modprobe g_mass_storage file=/piusb.bin stall=0
# sudo modprobe g_mass_storage file=/dev/mmcblk0p1 stall=0
# sudo modprobe g_mass_storage file=/dev/mmcblk0p2 stall=0

# https://www.raspberrypi.org/forums/viewtopic.php?t=183938
# showmewebcam OR this work, not BOTH ????
modprobe g_multi file=/dev/mmcblk0p2 stall=0 host_addr=11:22:33:44:55:66 dev_addr=aa:bb:cc:dd:ee:ff

Remove USB Mass storage
# modprobe -r g_mass_storage
---
May be need, may be not
https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=293585
# insmod configfs.ko
# insmod libcomposite.ko
# insmod usb_f_mass_storage.ko
---

```



## Ether UP and USB Mass

```bash
#!/bin/sh

# https://www.isticktoit.net/?p=1383

CONFIG=/sys/kernel/config/usb_gadget/piwebcam
mkdir -p "$CONFIG"
cd "$CONFIG" || exit 1

echo 0x1d6b > idVendor # Linux Foundation
echo 0x0104 > idProduct # Multifunction Composite Gadget
echo 0x0100 > bcdDevice # v1.0.0
echo 0x0200 > bcdUSB # USB2
mkdir -p strings/0x409
echo "fedcba9876543210" > strings/0x409/serialnumber
echo "Tobias Girstmair" > strings/0x409/manufacturer
echo "iSticktoit.net USB Device" > strings/0x409/product
mkdir -p configs/c.1/strings/0x409
echo "Config 1: ECM network" > configs/c.1/strings/0x409/configuration
echo 250 > configs/c.1/MaxPower
# Add functions here
# see gadget configurations below
# End functions
udevadm settle -t 5 || :
ls /sys/class/udc > UDC

# Ethernet Adapter
#-------------------------------------------
# Add functions here
mkdir -p functions/ecm.usb0
# first byte of address must be even
HOST="48:6f:73:74:50:43" # "HostPC"
SELF="42:61:64:55:53:42" # "BadUSB"
echo $HOST > functions/ecm.usb0/host_addr
echo $SELF > functions/ecm.usb0/dev_addr
ln -s functions/ecm.usb0 configs/c.1/
# End functions
udevadm settle -t 5 || :
ls /sys/class/udc > UDC
#put this at the very end of the file:
ifconfig usb0 10.0.0.1 netmask 255.255.255.252 up
route add -net default gw 10.0.0.2

# USB Mass storage
#-------------------------------------------
# Add functions here
FILE=/dev/mmcblk0p2
# FILE=/home/pi/usbdisk.img
# mkdir -p ${FILE/img/d}
# mount -o loop,ro,offset=1048576 -t ext4 $FILE ${FILE/img/d} # FOR OLD WAY OF MAKING THE IMAGE
# mount -o loop,ro, -t vfat $FILE ${FILE/img/d} # FOR IMAGE CREATED WITH DD
mkdir -p functions/mass_storage.usb0
echo 0 > functions/mass_storage.usb0/stall
echo 1 >functions/mass_storage.usb0/lun.0/removable
echo 0 > functions/mass_storage.usb0/lun.0/cdrom
echo 0 > functions/mass_storage.usb0/lun.0/ro
echo 0 > functions/mass_storage.usb0/lun.0/nofua
echo $FILE > functions/mass_storage.usb0/lun.0/file
ln -s functions/mass_storage.usb0 configs/c.1/
# End functions
udevadm settle -t 5 || :
ls /sys/class/udc > UDC

# REMOVE USB Mass Storage
# rm configs/c.1/mass_storage.usb0
# rm -rf functions/mass_storage.usb0
```



```bash
modprobe g_ether host_addr=11:22:33:44:55:66 dev_addr=aa:bb:cc:dd:ee:ff

Remove USB Mass storage
# modprobe -r g_mass_storage

# ifconfig usb0 10.0.0.1 netmask 255.255.255.252 up
# route add -net default gw 10.0.0.2

https://github.com/wismna/HackPi

ip link add name br0 type bridge
ip link set dev br0 up
ip link set dev eth0 master br0
ip link set dev eth1 master br0

```

## rndis window

https://stackoverflow.com/a/12193427

Let me answer my own question, I have figured out this issue:
The RNDIS IAD interface must be the first and second of the composite device. Although the problem is solved, it still puzzles me.
Hope this note will help others encountering similar issues.


## ncm

https://www.reddit.com/r/JetsonNano/comments/dwno63/usb_driver_for_mac_os_catalina/

L4T's USB device mode implements a variety of different functions in parallel, so is what's known as a USB composite device. The Ethernet protocol that works with macOS (pre-Catalina) is known as USB CDC ECM (Communications Data Class Ethernet Control Model). macOS Catalina has replaced the driver for this protocol; it used to be a kernel-based driver but is now a user-space driver. Presumably Apple made significant code changes during this transition. Either way, the ECM driver in macOS Catalina no longer works with the configuration implemented by L4T/Jetson. Specifically, the ECM driver no longer works if the ECM function is part of a USB composite device, but does work if the ECM function is the the only function in the USB device. CDC NCM is an alternative Ethernet protocol. macOS Catalina's CDC NCM driver seems to work fine if the NCM function is part of a composite gadget. Thus, there are two ways to solve this issue:



## Example

```bash
# v4l2-ctl -l

User Controls

                     brightness 0x00980900 (int)    : min=0 max=100 step=1 default=50 value=50 flags=slider
                       contrast 0x00980901 (int)    : min=-100 max=100 step=1 default=0 value=-2 flags=slider
                     saturation 0x00980902 (int)    : min=-100 max=100 step=1 default=0 value=5 flags=slider
                    red_balance 0x0098090e (int)    : min=1 max=7999 step=1 default=1000 value=1000 flags=slider
                   blue_balance 0x0098090f (int)    : min=1 max=7999 step=1 default=1000 value=1000 flags=slider
                horizontal_flip 0x00980914 (bool)   : default=0 value=0
                  vertical_flip 0x00980915 (bool)   : default=0 value=0
           power_line_frequency 0x00980918 (menu)   : min=0 max=3 default=1 value=1
                      sharpness 0x0098091b (int)    : min=-100 max=100 step=1 default=0 value=20 flags=slider
                  color_effects 0x0098091f (menu)   : min=0 max=15 default=0 value=0
                         rotate 0x00980922 (int)    : min=0 max=360 step=90 default=0 value=0 flags=modify-layout
             color_effects_cbcr 0x0098092a (int)    : min=0 max=65535 step=1 default=32896 value=32896

Codec Controls

             video_bitrate_mode 0x009909ce (menu)   : min=0 max=1 default=0 value=0 flags=update
                  video_bitrate 0x009909cf (int)    : min=25000 max=25000000 step=25000 default=10000000 value=25000000
         repeat_sequence_header 0x009909e2 (bool)   : default=0 value=0
            h264_i_frame_period 0x00990a66 (int)    : min=0 max=2147483647 step=1 default=60 value=60
                     h264_level 0x00990a67 (menu)   : min=0 max=11 default=11 value=11
                   h264_profile 0x00990a6b (menu)   : min=0 max=4 default=4 value=4

Camera Controls

                  auto_exposure 0x009a0901 (menu)   : min=0 max=3 default=0 value=0
         exposure_time_absolute 0x009a0902 (int)    : min=1 max=10000 step=1 default=1000 value=1000
     exposure_dynamic_framerate 0x009a0903 (bool)   : default=0 value=0
             auto_exposure_bias 0x009a0913 (intmenu): min=0 max=24 default=12 value=12
      white_balance_auto_preset 0x009a0914 (menu)   : min=0 max=10 default=1 value=1
            image_stabilization 0x009a0916 (bool)   : default=0 value=0
                iso_sensitivity 0x009a0917 (intmenu): min=0 max=4 default=0 value=0
           iso_sensitivity_auto 0x009a0918 (menu)   : min=0 max=1 default=1 value=1
         exposure_metering_mode 0x009a0919 (menu)   : min=0 max=2 default=0 value=0
                     scene_mode 0x009a091a (menu)   : min=0 max=13 default=0 value=0

JPEG Compression Controls

            compression_quality 0x009d0903 (int)    : min=1 max=100 step=1 default=30 value=30
```



## Over HTTP

```bash
# BUILD

ldtuyen@pc:~/develop/showmewebcam/output/raspberrypi0/build/picam-web-634308c2a9077669d3f4b61f83b2aa8cd315bfd0$ 
/home/ldtuyen/develop/showmewebcam/output/raspberrypi0/host/bin/arm-buildroot-linux-gnueabihf-gcc -I/home/ldtuyen/develop/showmewebcam/output/raspberrypi0/host/arm-buildroot-linux-gnueabihf/sysroot/usr/include/ -g -W -Wall -Werror -Wno-unused-function  -L/home/ldtuyen/develop/showmewebcam/output/raspberrypi0/host/arm-buildroot-linux-gnueabihf/sysroot/usr/lib/  -o picam-web main.c -lmongoose

```



https://raspberrypi.stackexchange.com/a/42800

```python

#!/usr/bin/env python


from flask import Flask, render_template, Response
from camera import Camera

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
```



### RPi_Cam_Web_Interface

- https://github.com/silvanmelchior/RPi_Cam_Web_Interface

- [[question] How does RPi Cam Web Interface work?](https://github.com/silvanmelchior/RPi_Cam_Web_Interface/issues/432)



https://github.com/rmsalinas/raspicam

https://github.com/rpicopter/raspimjpeg

```bash
preview_path /dev/shm/mjpeg/cam.jpg

mkdir -p /var/www/media
mkdir -p /dev/shm/mjpeg
mknod /var/www/FIFO p
chmod 666 /var/www/FIFO

/usr/local/bin/raspimjpeg --config raspimjpeg.config -v &

```





### RaspiMJPEG

https://github.com/roberttidey/userland/tree/master/host_applications/linux/apps/raspicam



```

```



## Wireshark, usbmon

```bash
sudo modprobe usbmon
sudo setfacl -m u:$USER:r /dev/usbmon*

ldtuyen@pc:~$ lsusb | sort
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 003: ID 0080:a001  
Bus 001 Device 004: ID 067b:2303 Prolific Technology, Inc. PL2303 Serial Port
Bus 001 Device 006: ID 1d6b:0104 Linux Foundation Multifunction Composite Gadget
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 002 Device 002: ID 093a:2510 Pixart Imaging, Inc. Optical Mouse
Bus 002 Device 003: ID 04b4:0510 Cypress Semiconductor Corp. 
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 003 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub

>> Choose usbmon1 (Multifunction Composite Gadget)
>> Filter `usb.device_address == 6` (Bus 001 Device 006)

# USB performance/traffic monitor
sudo apt install usbtop
sudo modprobe usbmon 
sudo usbtop

## 1920x2160 
  Bus ID 1 (USB bus number 1)	To device	From device
  Device ID 1 :			0.00 kb/s	0.00 kb/s
  Device ID 2 :			0.00 kb/s	0.00 kb/s
  Device ID 3 :			0.00 kb/s	0.00 kb/s
  Device ID 4 :			0.00 kb/s	0.00 kb/s
  Device ID 36 :			141.73 kb/s	4001.42 kb/s

## 1920x1080;
	3866.57 kb/s
```



## Thu nhận ảnh từ camera sử dụng V4L2 trên Linux [^3]

OpenCV cung cấp các hàm cần thiết để thu nhận (capture) ảnh từ thiết bị usb camera, webcam. Các hàm này khá thuận tiện và dễ dàng sử dụng trong nhiều tình huống khác nhau. Tuy nhiên, khi phát triển ứng dụng làm việc với thiết bị video trên Linux (PC, Arm Linux), chúng ta còn có thể sử dụng các API mà hệ điều hành Linux cung cấp, đó là V4L2 (OpenCV hỗ trợ V4L2 thông qua lựa chọn khi biên dịch). Sử dụng các API của Linux tuy phức tạp hơn các hàm của OpenCV nhưng cũng có nhiều ưu điểm hơn (dễ xác định thiết bị camera muốn làm việc, khắc phục tình huống với các thiết bị camera mà hàm cvCaptureFromCAM của OpenCV cho ARM không mở được, trả về NULL)

Bài viết này hướng dẫn sử dụng các API cơ bản của V4L2 để làm việc với thiết bị camera trên Linux. Dữ liệu ảnh thu nhận được sẽ được chuyển đổi sang định dạng thích hợp của thư viện OpenCv để tiếp tục xử lý bằng các hàm, thuật toán của OpenCV.

**Giới thiệu V4L2**

V4L2 (Video for Linux 2) là phiên bản 2 của thư viện Video For Linux cung cấp các hàm API trên hệ điều hành Linux. Các tài liệu mô tả về các API này có thể tìm hiểu[ ở đây](http://linuxtv.org/downloads/v4l-dvb-apis/)

**Các bước chính để sử dụng V4L2 API**

**Bước 1. Open capture device (Mở thiết bị camera)**

Trên Linux, thiết bị camera (đã nhận driver tương thích) thường có tên file thiết bị dạng /dev/video0 (hoặc /dev/video1, 2, … tùy thuộc số thiết bị hoặc cổng usb kết nối)

Dùng hàm open() để mở file thiết bị với device file tương ứng

*int* *fd;*

*fd* *=* *open(**"/dev/video0"**, O_RDWR);*

**if** *(fd* *==* *-1**)*

*{*

  *// couldn't find capture device*

  *perror(**"Opening Video device"**);*

  **return** *1**;*

*}*

**Bước 2. Query Capture (Truy vấn thiết bị)**

Cần kiểm tra xem thiết bị được capture có sẵn sàng hay không. V4L2 không hỗ trợ một số loại thiết bị usb camera, khi đó sẽ phát sinh lỗi. Chúng ta sử dụng cấu trúc v4l2_capability và VIDIOC_QUERYCAP để truy vấn thiết bị. (chi tiết thêm[ ở đây](http://linuxtv.org/downloads/v4l-dvb-apis/vidioc-querycap.html#v4l2-capability))

**struct** *v4l2_capability caps* *=* *{**0**};*

**if** *(**-1* *==* *xioctl(fd, VIDIOC_QUERYCAP,* *&**caps))*

*{*

  *perror(**"Querying Capabilites"**);*

  **return** *1**;*

*}*

 Ở đây hàm xioctl là một “hàm đóng gói” (wrapper function) của hàm ioctl. Hàm ioctl có chức năng thao tác với các tham số của file thiết bị. (Chi tiết[ ở đây](http://man7.org/linux/man-pages/man2/ioctl.2.html))

 *#include <sys/ioctl.h>*

**static** *int* *xioctl**(**int* *fd,* *int* *request,* *void* ****arg)*

*{*

  *int* *r;*

​    **do** *r* *=* *ioctl (fd, request, arg);*

​    **while** *(**-1* *==* *r* *&&* *EINTR* *==* *errno);*

​    **return** *r;*

*}*

 **Bước 3. Image Format (Định dạng ảnh thu nhận)**

V4L2 cung cấp API để kiểm tra định dạng ảnh và không gian màu sử dụng mà thiết bị camera hỗ trợ và cung cấp. Cấu trúc v4l2_format được sử dụng để thay đổi định dạng ảnh

**struct** *v4l2_format fmt* *=* *{**0**};*

*fmt.type* *=* *V4L2_BUF_TYPE_VIDEO_CAPTURE;*

*fmt.fmt.pix.width* *=* *320**;*

*fmt.fmt.pix.height* *=* *240**;*

*fmt.fmt.pix.pixelformat* *=* *V4L2_PIX_FMT_MJPEG;*

*fmt.fmt.pix.field* *=* *V4L2_FIELD_NONE;*

 

**if** *(**-1* *==* *xioctl(fd, VIDIOC_S_FMT,* *&**fmt))*

*{*

  *perror(**"Setting Pixel Format"**);*

  **return** *1**;*

*}*

Trong trường hợp này, chúng ta thiết lập kích thước khung hình là 320x240 (width x height). Kiểm tra khuôn dạng dữ liệu mà camera hỗ trợ (MJPEG, YUV, …)

**Bước 4. Request Buffers**

Một buffer được sử dụng để chứa dữ liệu trao đổi bởi ứng dụng và driver thiết bị sử dụng phương pháp streaming I/O. Sử dụng cấu trúc v4l2_requestbuffers để cấp phát buffers này.

**struct** *v4l2_requestbuffers req* *=* *{**0**};*

*req.count* *=* *1**;*

*req.type* *=* *V4L2_BUF_TYPE_VIDEO_CAPTURE;*

*req.memory* *=* *V4L2_MEMORY_MMAP;*

**if** *(**-1* *==* *xioctl(fd, VIDIOC_REQBUFS,* *&**req))*

*{*

  *perror(**"Requesting Buffer"**);*

  **return** *1**;*

*}*

Hàm ioctl được sử dụng để khởi tạo một memory mapped (mmap)

**Bước 5. Query buffer**

Sau khi yêu cầu buffer từ thiết bị, chúng ta sẽ truy vấn đến buffer này để lấy dữ liệu thô (raw data)

**struct** *v4l2_buffer buf* *=* *{**0**};*

*buf.type* *=* *V4L2_BUF_TYPE_VIDEO_CAPTURE;*

*buf.memory* *=* *V4L2_MEMORY_MMAP;*

*buf.index* *=* *bufferindex;*

**if***(**-1* *==* *xioctl(fd, VIDIOC_QUERYBUF,* *&**buf))*

*{*

  *perror(**"Querying Buffer"**);*

  **return** *1**;*

*}*

 

*buffer* *=* *mmap (**NULL**, buf.length, PROT_READ* *|* *PROT_WRITE, MAP_SHARED, fd, buf.m.offset);*

**Bước 6. Capture Image**

Sau khi truy vấn buffer thành công, vấn đề còn lại là thu nhận một khung hình và lưu nó vào trong buffer.

**if***(**-1* *==* *xioctl(fd, VIDIOC_STREAMON,* *&**buf.type))*

*{*

  *perror(**"Start Capture"**);*

  **return** *1**;*

*}*

*fd_set fds;*

*FD_ZERO(**&**fds);*

*FD_SET(fd,* *&**fds);*

**struct** *timeval tv* *=* *{**0**};*

*tv.tv_sec* *=* *2**;*

*int* *r* *=* *select(fd**+1**,* *&**fds,* *NULL**,* *NULL**,* *&**tv);*

**if***(**-1* *==* *r)*

*{*

  *perror(**"Waiting for Frame"**);*

  **return** *1**;*

*}*

**if***(**-1* *==* *xioctl(fd, VIDIOC_DQBUF,* *&**buf))*

*{*

  *perror(**"Retrieving Frame"**);*

  **return** *1**;*

*}*

**Bước 7. Store data in OpenCV datatype**

Dữ liệu thu nhận được chuyển đổi sang cấu trúc ảnh của OpenCV, và lưu lại thành một file ảnh:

*CvMat cvmat* *=* *cvMat(**480**,* *640**, CV_8UC3, (**void*****)buffer);*

*IplImage* *** *img;*

*img* *=* *cvDecodeImage(**&**cvmat,* *1**);*

## Q&A

> uvc-gadget is Preview, or Video recording mode?

It is in 

> I-frame, P-frame  và B-frame 

- I-frame (intra frame): Frame gốc, các `interframe` (B-frame và P-frame) được tạo rai từ I-frame
- P-frame (predictive frame): được giải mã dựa trên P-frame hoặc I-frame trước đó 
- B-frame (bi-directional predictive frame): được giải mã dựa trên frame trước và sau nó

> FrameRate

Số frame xuất hiện trong 1s kể cả `intraframe` và `interframe`, đơn vị là FPS (frame per second)

> GOP ( Group of Picture) hoặc GOV ( Group of Video)

Tần suất xuất hiện của I-Frame hay là sau nhiêu frame thì xuất hiện `intraframe` 1 lần

Ví dụ : GOV=10,  FrameRate = 20 FPS

```txt
+-------------------------------------------------------------------------------+
| I | P | P | P | P | P | P | P | P | P | I | P | P | P | P | P | P | P | P | P |
+-------------------------------------------------------------------------------+
|                GOP = 10               |                GOP = 10               |
+-------------------------------------------------------------------------------+
|                                   20 FPS                                      |
+-------------------------------------------------------------------------------+
```

> I-Frame Interval

Bao lâu thì xuất hiện 1 Intraframe (keyframe), đơn vị là s (hoặc ns trong `struct uvc_streaming_control`)
`I-Frame Interval = GOP/FPS`, trong ví dụ trên là 0.5

Use `v4l2-ctl --set-ctrl=h264_i_frame_period=10` to set the intra-I-frame interval to 10 frames.

`dwDefaultFrameInterval (in 100ns units) = 10^7/FPS`

Ví dụ

```bash
# Pi Zero 1.3, v1 Camera 5MP, showmewebcam V1.40
$ v4l2-ctl -d /dev/video0 --list-formats-ex
ioctl: VIDIOC_ENUM_FMT
        Type: Video Capture

        [0]: 'YU12' (Planar YUV 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [1]: 'YUYV' (YUYV 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [2]: 'RGB3' (24-bit RGB 8-8-8)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [3]: 'JPEG' (JFIF JPEG, compressed)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [4]: 'H264' (H.264, compressed)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [5]: 'MJPG' (Motion-JPEG, compressed)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [6]: 'YVYU' (YVYU 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [7]: 'VYUY' (VYUY 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [8]: 'UYVY' (UYVY 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [9]: 'NV12' (Y/CbCr 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [10]: 'BGR3' (24-bit BGR 8-8-8)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [11]: 'YV12' (Planar YVU 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [12]: 'NV21' (Y/CrCb 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [13]: 'BGR4' (32-bit BGRA/X 8-8-8-8)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2

# Other output from https://github.com/Motion-Project/motion/issues/923#issuecomment-478052280
$ sudo v4l2-ctl -d /dev/video0 --list-formats-ex
ioctl: VIDIOC_ENUM_FMT
	Index       : 0
	Type        : Video Capture
	Pixel Format: 'MJPG' (compressed)
	Name        : Motion-JPEG
		Size: Discrete 1920x1080
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 1280x720
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 800x600
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 640x480
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 640x360
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 352x288
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 320x240
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 1920x1080
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)

	Index       : 1
	Type        : Video Capture
	Pixel Format: 'YUYV'
	Name        : YUYV 4:2:2
		Size: Discrete 640x480
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 800x600
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 640x360
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 352x288
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 320x240
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
		Size: Discrete 640x480
			Interval: Discrete 0.033s (30.000 fps)
			Interval: Discrete 0.040s (25.000 fps)
			Interval: Discrete 0.067s (15.000 fps)
```

> FoV và binning

FoV (Field of View): là góc nhìn của camera.
Binning là kỹ thuật ghép điểm sensor lại thành 1 điểm ảnh, vì thế độ phân giải của ảnh bị giảm đi bấy nhiêu lần. Ví dụ [^4]

![image-20201102095240964]({{ site.cloudinaryurl }}2020-10-26-show-me-webcam/image-20201102095240964.png)

Ví dụ về FoV [^2] với Raspberry Pi Camera v1 theo như thông số ở `Sensor mode`

![https://picamera.readthedocs.io/en/release-1.13/_images/sensor_area_1.png]({{ site.cloudinaryurl }}2020-10-26-show-me-webcam/sensor_area_1.png)



Tại sao V1 `Mode #5 (1296x730 16:9)` là Full FoV sao lại không Full hình như  `Mode #2 (2592x1944 4:3)` ? Vì nó chỉ đảm bảo Full theo chiều ngang thôi, tỷ lệ không tương thích với `width*height` gốc. ([xem thêm](https://github.com/waveform80/picamera/pull/214))

> Ảnh hưởng giữa command line `v4l2-ctl` và lập trình `ioctl (fd, VIDIOC_S_CTRL, &control)`

như nhau, thay đổi `ioctl (fd, VIDIOC_S_CTRL, &control)` -> thay đổi khi `v4l2-ctl` get lên.

> bpp: bit ber pixel

> dwMaxVideoFrameBufferSize

The field is also totally unrelated to USB bandwidth management, the maximum 
frame size value is only used to allocate the V4L2 buffers. [ref](https://www.mail-archive.com/linux-uvc-devel@lists.berlios.de/msg05595.html)

> /sys/kernel/config/usb_gadget/pi4/functions/uvc.usb0/streaming/mjpeg/m/1080p
>
> Làm thay đổi list resolution khi `v4l2-ctl -d /dev/video0 --list-formats-ex`

## Test camera

```bash
## Install luvcview
git clone https://github.com/ksv1986/luvcview
cd luvcview
sudo apt-get install libsdl2-dev
sudo make

# Or
wget http://archive.ubuntu.com/ubuntu/pool/universe/l/luvcview/luvcview_0.2.6-6_amd64.deb
sudo dpkg -i luvcview_0.2.6-6_amd64.deb


Check options           : ./luvcview -h
Preview 1920x1080@30fps : ./luvcview -d /dev/video0 -i 30 -s 1920x1080
                          ./luvcview -d /dev/video0 -i 30 -s 1920x1080 -o testVideo.mp4
           
ldtuyen@pc:~/develop$ luvcview --help
luvcview 0.2.6

usage: uvcview [-h -d -g -f -s -i -c -o -C -S -L -l -r]
-h   print this message
-d   /dev/videoX       use videoX device
-g   use read method for grab instead mmap
-w   disable SDL hardware accel.
-f   choose video format (YUYV/yuv, UYVY/uyvy and MJPG/jpg are valid, MJPG is default)
-i   fps           use specified frame rate
-s   widthxheight      use specified input size
-c   enable raw frame capturing for the first frame
-C   enable raw frame stream capturing from the start
-S   enable raw stream capturing from the start
-o   avifile  create avifile, default video.avi
-L   query valid video formats
-l   query valid controls and settings
-r   read and set control settings from luvcview.cfg (save/restore with F1/F2)

>>> DON'T USE this tool because of "Floating point exception"

## On host
$ sudo cat /var/log/messages | grep uvcvideo
kernel: [10207.190317] uvcvideo: Found UVC 1.00 device Show-me-webcam Pi Webcam (1d6b:0104)

$ lsusb |grep Gadget
Bus 001 Device 006: ID 1d6b:0104 Linux Foundation Multifunction Composite Gadget

$ lsusb -s 1d6b:0104 -v
Nothing here

#####
$ sudo apt install v4l-utils
$ v4l2-ctl --list-formats-ext -d /dev/video0
ioctl: VIDIOC_ENUM_FMT
	Type: Video Capture

	[0]: 'MJPG' (Motion-JPEG, compressed)
		Size: Discrete 1920x1080
			Interval: Discrete 0.033s (30.000 fps)

http://rawpixels.net/

#### VLC capture webcam
Media > Open Capture Device.

## 4k ??
https://superuser.com/q/1449252

```



Add `start_debug=1` to config.txt, and provide the output from `sudo vcdbg log assert` and `sudo vcdbg log msg`

vcdbg isn't going to give you anything that useful if you're debugging  the ARM side 3D stack as it only prints the logs from the VideoCore VPU.

```bash
raspistill -w 640 -h 480 -o 640_480_still.jpg
```

**MJPEG**

```bash
raspivid -fps 15 -w 2592 -h 1944 -cd MJPEG -o 2592_1944_raspivid.mjpg
raspivid -md 2 -fps 15 -w 2592 -h 1944 -cd MJPEG -o wibble.mjpg -t 10000 -b 25000000

vlc --demux=avformat wibble.mjpg
vlc --demux=avformat 2592_1944_raspivid.mjpg
>> OK


```



### List fomat support

```bash
# v4l2-ctl --list-formats 
ioctl: VIDIOC_ENUM_FMT
        Type: Video Capture

        [0]: 'YU12' (Planar YUV 4:2:0)
        [1]: 'YUYV' (YUYV 4:2:2)
        [2]: 'RGB3' (24-bit RGB 8-8-8)
        [3]: 'JPEG' (JFIF JPEG, compressed)
        [4]: 'H264' (H.264, compressed)
        [5]: 'MJPG' (Motion-JPEG, compressed)
        [6]: 'YVYU' (YVYU 4:2:2)
        [7]: 'VYUY' (VYUY 4:2:2)
        [8]: 'UYVY' (UYVY 4:2:2)
        [9]: 'NV12' (Y/CbCr 4:2:0)
        [10]: 'BGR3' (24-bit BGR 8-8-8)
        [11]: 'YV12' (Planar YVU 4:2:0)
        [12]: 'NV21' (Y/CrCb 4:2:0)
        [13]: 'BGR4' (32-bit BGRA/X 8-8-8-8)
        
# v4l2-ctl --list-formats-ex

## v1.3 Camera
ioctl: VIDIOC_ENUM_FMT
        Type: Video Capture

        [0]: 'YU12' (Planar YUV 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [1]: 'YUYV' (YUYV 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [2]: 'RGB3' (24-bit RGB 8-8-8)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [3]: 'JPEG' (JFIF JPEG, compressed)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [4]: 'H264' (H.264, compressed)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [5]: 'MJPG' (Motion-JPEG, compressed)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [6]: 'YVYU' (YVYU 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [7]: 'VYUY' (VYUY 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [8]: 'UYVY' (UYVY 4:2:2)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [9]: 'NV12' (Y/CbCr 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [10]: 'BGR3' (24-bit BGR 8-8-8)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [11]: 'YV12' (Planar YVU 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [12]: 'NV21' (Y/CrCb 4:2:0)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2
        [13]: 'BGR4' (32-bit BGRA/X 8-8-8-8)
                Size: Stepwise 32x32 - 2592x1944 with step 2/2

```



### List controls

```bash
pi@raspberrypi:~$ /usr/bin/v4l2-ctl -l

User Controls

                     brightness 0x00980900 (int)    : min=0 max=100 step=1 default=50 value=50 flags=slider
                       contrast 0x00980901 (int)    : min=-100 max=100 step=1 default=0 value=0 flags=slider
                     saturation 0x00980902 (int)    : min=-100 max=100 step=1 default=0 value=0 flags=slider
                    red_balance 0x0098090e (int)    : min=1 max=7999 step=1 default=1000 value=1000 flags=slider
                   blue_balance 0x0098090f (int)    : min=1 max=7999 step=1 default=1000 value=1000 flags=slider
                horizontal_flip 0x00980914 (bool)   : default=0 value=0
                  vertical_flip 0x00980915 (bool)   : default=0 value=0
           power_line_frequency 0x00980918 (menu)   : min=0 max=3 default=1 value=1
                      sharpness 0x0098091b (int)    : min=-100 max=100 step=1 default=0 value=0 flags=slider
                  color_effects 0x0098091f (menu)   : min=0 max=15 default=0 value=0
                         rotate 0x00980922 (int)    : min=0 max=360 step=90 default=0 value=0 flags=modify-layout
             color_effects_cbcr 0x0098092a (int)    : min=0 max=65535 step=1 default=32896 value=32896

Codec Controls

             video_bitrate_mode 0x009909ce (menu)   : min=0 max=1 default=0 value=0 flags=update
                  video_bitrate 0x009909cf (int)    : min=25000 max=25000000 step=25000 default=10000000 value=10000000
         repeat_sequence_header 0x009909e2 (bool)   : default=0 value=0
            h264_i_frame_period 0x00990a66 (int)    : min=0 max=2147483647 step=1 default=60 value=60
                     h264_level 0x00990a67 (menu)   : min=0 max=11 default=11 value=11
                   h264_profile 0x00990a6b (menu)   : min=0 max=4 default=4 value=4

Camera Controls

                  auto_exposure 0x009a0901 (menu)   : min=0 max=3 default=0 value=0
         exposure_time_absolute 0x009a0902 (int)    : min=1 max=10000 step=1 default=1000 value=1000
     exposure_dynamic_framerate 0x009a0903 (bool)   : default=0 value=0
             auto_exposure_bias 0x009a0913 (intmenu): min=0 max=24 default=12 value=12
      white_balance_auto_preset 0x009a0914 (menu)   : min=0 max=10 default=1 value=1
            image_stabilization 0x009a0916 (bool)   : default=0 value=0
                iso_sensitivity 0x009a0917 (intmenu): min=0 max=4 default=0 value=0
           iso_sensitivity_auto 0x009a0918 (menu)   : min=0 max=1 default=1 value=1
         exposure_metering_mode 0x009a0919 (menu)   : min=0 max=2 default=0 value=0
                     scene_mode 0x009a091a (menu)   : min=0 max=13 default=0 value=0

JPEG Compression Controls

            compression_quality 0x009d0903 (int)    : min=1 max=100 step=1 default=30 value=30

```



## To-do list

```cpp
#define WIDTH1  640
#define HEIGHT1 360

#define WIDTH2	1920
#define HEIGHT2 1080
>>>> Default resolution is 1280x720?
    -r <resolution> Select frame resolution:
                0 = 360p, VGA (640x360)
                1 = 720p, WXGA (1280x720)
```

--> `udev->height (UVC device`) xác đinh độ phân giải sẽ dùng trong `/sys/kernel/config/usb_gadget/pi4/functions/uvc.usb0/streaming/mjpeg/m/` (1440p, 1080p, etc ...). Get bằng cách `v4l2-ctl -d /dev/video0 --list-formats-ex`

--> `ioctl(dev->v4l2_fd, VIDIOC_S_FMT, fmt) (bao gồm fmt.fmt.pix.width`) xác định độ phân giải thực khi stream video

**Note**: Hai cấu hình này phải tương thích, nếu không, một số Video Viewer sẽ không chạy được (vd, udev là 1280x720, trong khi fmt là 1920x1080, VLC vẫn lên nhưng https://webcamera.io/ không lên)

[] USB_SPEED_SUPER ?? enough for 2k stream ??

```bash
udev->maxpkt = 1024;

https://github.com/showmewebcam/showmewebcam/issues/1
Answering my own question:
I had success on Mac OSx Mojave after setting ‘uvc-gadget‘ parameter ‘-s2’ to ‘-s1’.
Phhhhewww…

https://www.cctvcalculator.net/en/calculations/bandwidth-calculator/
1920x1080; 30 FPS; MJPEG -> 94.9 Mb/s <-> usbtop: 3866.57 kb/s
```

[] hangout

```bash
UVC: Unable to dequeue buffer 0: Resource temporarily unavailable (11).

[  160.997937] dwc2 20980000.usb: dwc2_hsotg_ep_stop_xfr: timeout GINTSTS.GOUTNAKEFF
[  161.007893] dwc2 20980000.usb: dwc2_hsotg_ep_stop_xfr: timeout DOEPCTL.EPDisable

##
/opt/uvc-webcam/uvc-gadget-test -f1 -s1 -u /dev/video1 -v /dev/video0 -r2 (1920x1080)
+ showmewebcam config

V4L2: Starting video stream.
UVC: Unable to dequeue buffer 0: Resource temporarily unavailable (11).
UVC: zzz dequeue buffer 1 (vbuf.index).
UVC: Starting video stream.

## ./uvc-gadget -f1 -s1 -u /dev/video1 -v /dev/video0 -o0 -r3
## MMAP
V4L2: VIDIOC_REQBUFS error Device or resource busy (16).
*** Ban goc neu chay -o0 thi cung bi loi ***
```



## Ref

[^1]: https://developer.ridgerun.com/wiki/index.php?title=How_to_use_the_UVC_gadget_driver_in_Linux
[^2]: https://picamera.readthedocs.io/en/release-1.13/fov.html#sensor-modes

[^3]: https://sites.google.com/site/embedded247/npcourse/impcourse/thu-nhan-anh-tu-camera-su-dung-v4l2-tren-linux

[^4]: http://cdn.sparkfun.com/datasheets/Dev/RaspberryPi/ov5647_full.pdf



### Other references

- [linux-uvc-devel — Linux UVC development SF](https://sourceforge.net/p/linux-uvc/mailman/linux-uvc-devel/)
- [[Linux-uvc-devel\] Has anybody implemented UVC bulk transfer on a device? Some doubts need clarification](https://www.mail-archive.com/search?l=linux-uvc-devel@lists.berlios.de&q=subject:"Re\%3A+\[Linux\-uvc\-devel\]+Has+anybody+implemented+UVC+bulk+transfer+on	a+device\%3F+Some+doubts+need+clarification."&o=newest)
- USB_Video_FAQ_1.1.pdf
- UVC 1.5 Class specification.pdf
- AN00127 -USB-Video-Class-Device-[readme]_2.0.2rc1.pdf
- [V4L2 camera overview + Debug - ST](https://wiki.st.com/stm32mpu/wiki/V4L2_camera_overview)
- [Linux camera driver 2 - UVC - China](https://www.programmersought.com/article/31321074958/) 
- 