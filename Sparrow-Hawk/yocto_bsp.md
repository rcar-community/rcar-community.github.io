---
layout: default
title: Sparrow Hawk - Yocto BSP | R-Car Community Board
style: common
breadcrumb_parent: Sparrow Hawk
breadcrumb_parent_url: /Sparrow-Hawk/index.html

breadcrumb_current: Yocto BSP
breadcrumb_current_url: /Sparrow-Hawk/yocto_bsp.html
---

Contents
{: .contents}
0. Table of Content
{:toc}
{: .contents}

## Introduction

This is the Yocto BSP page for Sparrow Hawk.

## Software Version List

|Software                   |Version|
|---------------------------|-------|
|Yocto Project              |5.0.14 |
|Linux kernel               |6.12.58|
|U-Boot                     |2025.10|
|Arm Trusted Firmware       |2.14.0 |

## How to Startup

If you want to quickly start, please start [3.1.1. Quick preparation: download binary](#quick-preparation-download-binary).

If you want to normally start, please start [3.1.2. Normal preparation: build source code](#normal-preparation-build-source-code).

### Preparation of the software

#### Quick preparation: download binary

Note:
* minimal: only the minimum packages required to boot the device.
* weston: minimal package + packages for building a GUI environment, including Wayland/Weston.

&nbsp;

1. Download binary from GitHub
Please download [core-image-weston-sparrow-hawk.rootfs.wic.gz](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2025-11-27/core-image-weston-sparrow-hawk.rootfs.wic.gz) and [ipl-burning.zip](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2025-11-27/ipl-burning.zip). If you want to use minimum package, please download [core-image-minimal-sparrow-hawk.rootfs.wic.gz](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2025-11-28/core-image-minimal-sparrow-hawk.rootfs.wic.gz) instead of core-image-weston-sparrow-hawk.rootfs.wic.gz.
{:start="1"}

2. Unzip download zip file
```bash
unzip ipl-burning.zip
```
Next, jump to [3.2. How to flash](#how-to-flash).
{:start="2"}

#### Normal preparation: build source code

```bash
git clone https://github.com/rcar-community/meta-sparrow-hawk -b scarthgap
cd meta-sparrow-hawk
./build.sh
```
Next, jump to [3.2. How to flash](#how-to-flash).

### How to flash

#### Flashing loader

Run script in ipl-burning directory(Linux: run.sh, Windows: run.bat). If using Linux host PC, please install python3 and pip command on your system before running the script and close other console which uses serial port of the board before executing the script.

Note:
* This script use serial device /dev/ttyUSB* in Linux. But, it cannot be accessed from user without previledged right by default settings. Please use sudo command or add current user into dialout group.

Note:
* Please change the Mode Switch(=SW2) according to the ipl-burning(run.sh or run.bat).

#### Flashing OS image into SD card

**Linux case**
```bash
gzip -cd core-image-minimal-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
```
or
```bash
gzip -cd core-image-weston-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
```
Note:
* You can check minimal or weston when you use "core-image-xxxx-sparrow-hawk.rootfs.wic.gz" of file name in [3.1.1 Quick preparation: download binary](#quick-preparation-download-binary) or [3.1.2 Normal preparation: build source code](#normal-preparation-build-source-code).

**Windows case**
1. Extract gzip image using 7zip or similer software.
2. Flash extracted image into SD card using Etcher, win disk imager, and so on.

### How to boot

1. Insert the SD card into CN1 which is bottom of the board.
2. Open terminal application and open serial device.
3. Press SW1 to power on the board.
4. After booting U-Boot, please press any key while showing "Hit any key to stop autoboot:" to enter U-Boot shell.
5. Input following command into U-Boot shell and press enter key.
```bash
env default -a; boot
```
6. If command and environment is correct, Linux kernel log will output.

If you want to boot OS image automatically when power on the board, please run following to setup autoboot. Run following command:

```bash
env default -a
saveenv
```
After that, OS image boots automatically when power on the board.

## How to Check Functions

### Software support list

| Function                              | Status(minamal) | Status(weston) |
|---------------------------------------|-----------------|----------------|
| [CAN](#can)                           | Supported       | Supported      |
| Ethernet                              | Supported       | Supported      |
| [Audio(Output/Input)](#audio)         | Supported       | Supported      |
| Display Port                          | Supported       | Supported      |
| [GPIO](#gpio)                         | Supported       | Supported      |
| [I2C](#i2c)                           | Supported       | Supported      |
| JTAG                                  | Supported       | Supported      |
| USB3.0                                | Not supported   | Not supported  |
| [UART](#uart)                         | Supported       | Supported      |
| [Thermal](#thermal)                   | Supported       | Supported      |
| M.2                                   | Not supported   | Not supported  |
| [Pi Camera](#pi-camera)               | Supported       | Supported      |
| [Pi Display](#pi-display)             | Supported       | Supported      |
| PCIe Endpoint                         | Not supported   | Not supported  |
| [Pi Active Cooler](#pi-active-cooler) | Supported       | Supported      |
| GPU                                   | Not supported   | Supported      |
| AI Accelerator                        | Not supported   | Not supported  |
| Desktop(GUI)                          | Not supported   | Supported      |

Note:
* You can check minimal or weston. When you use "core-image-xxxx-sparrow-hawk.rootfs.wic.gz" of file name in [3.2.2 Flashing OS image into SD card](#flashing-os-image-into-sd-card):

Note:
* "Supported": Function scceeded in the simple test as below.
* "Not supported": Function isn't supported.

### CAN

Loop back
1. Connect the following pins of CONN2: Connect Pin1(CAN1L) - Pin2(CAN0L) and Pin5(CAN1H) - Pin6(CAN0H)

* ![Pi Display]({{ '/images/CAN.webp' | relative_url }})

2. Execute following commands on Linux:
```bash
ip link set can0 up type can restart-ms 100 bitrate 1000000 dbitrate 5000000 fd on
ip link set can1 up type can restart-ms 100 bitrate 1000000 dbitrate 5000000 fd on
candump can0 &
cangen can1 -I i -L i -D i -f -n 16
killall candump
candump can1 &
cangen can0 -I i -L i -D i -f -n 16
killall candump
```
{:start="2"}

### Audio

1. Connect headset/earphone/Speaker to CONN3.
2. (if possible) Connect audio output like a smartphone to CONN4.
3. Setup(Mix Aux in and Headset mic and setup audio output via CONN3)
```bash
amixer set "Headphone" 40%
amixer set "Headphone" on
amixer set "Mixout Left DAC Left" on
amixer set "Mixout Right DAC Right" on
amixer set "Aux" on
amixer set "Aux" 80%
amixer set "Mixin PGA" on
amixer set "Mixin PGA" 50%
amixer set "ADC" on
amixer set "ADC" 80%
amixer set "Mixin Left Aux Left" on
amixer set "Mixin Right Aux Right" on
amixer set "Mic 1" on
amixer set "Mic 1" 80%
amixer set "Mixin Left Mic 1" on
amixer set "Mixin Right Mic 1" on
```
4. Test function
   1. Recording and Playback test(5sec)
      ```bash
      arecord -D hw:0,0 -t wav -d 5 -c 2 -r 48000 -f S16_LE | aplay
      ```
   2. Only Playback test
      ```bash
      speaker-test -c 2 -t wav -W /usr/share/sounds/alsa/
      ```

### GPIO

Toggle GP2\_12(Pin11 on Pin Header)
1. Connect LED or Oscilloscope to the board
2. Execute following command
   ```bash
   python3 /usr/bin/example-apps/toggle_gpio_GP2_12.py
   ```

For more examples, please see also [https://github.com/brgl/libgpiod/raw/refs/heads/master/bi
ndings/python/examples](https://github.com/brgl/libgpiod/raw/refs/heads/master/bindings/python/examples)

### I2C

* Detect I2C device
  ```bash
  i2cdetect -r <i2c device num(ex.3)>
  ```
  Note: i2c device num: 3 and 4 is located in Pin header.

Please search i2c-tools to use other commands(i2cdump, i2cget, i2cset, i2ctransfer).

### UART

Loop back
1. Connect UART TX and RX(pin 8 and pin 10) on PinHeader.

* ![Pi Display]({{ '/images/UART.webp' | relative_url }})

2. Execute following commands:
```bash
stty -F /dev/ttySC2 -echo
cat /dev/ttySC2 &
echo Hello > /dev/ttySC2
```
{:start="2"}

### Thermal

* Check SoC temperature
  ```bash
  cat /sys/class/thermal/thermal_zone*/temp
  # ex.) 55000 # (Unit is millicelsius => 55.000 °C)
  ```
* Thermal throttling

  | CA76 core temp | function                   |
  |----------------|----------------------------|
  | ~ 68°C         | Normal operation           |
  | 68 ~ 100 °C    | CPU clock is limited       |
  | 100 °C         | System is shutdown forcely |

* Measurement point

  | zone          | Measurement point |
  |---------------|-------------------|
  | thermal_zone0 | CR52              |
  | thermal_zone1 | CNN               |
  | thermal_zone2 | CA76              |
  | thermal_zone3 | DDR               |

### Pi Camera

**Note:**
* **Currently, Raspberry Pi Camera V2 and Raspberry Pi Camera V3 is only supported.**

Note:
* You can check minimal or weston. When you use "core-image-xxxx-sparrow-hawk.rootfs.wic.gz" of file name in [3.2.2 Flashing OS image into SD card](#flashing-os-image-into-sd-card):

Note:
* The Raspberry Pi Camera v3 is currently under development on mainline Linux and libcamera,
so at this stage the image may appear dark and features such as auto-focus are not yet suppor
ted. In addition, recognition may occasionally fail.

&nbsp;

1. Connect Raspberry Pi Camera V2 and/or Raspberry Pi Camera V3 to J1 and/or J2 connector.
   * The board connector has 22 pin so that you need to prepare pitch convert cable.
   * ex.) Raspberry Pi Official Accesary [https://www.raspberrypi.com/products/camera-cable/](https://www.raspberrypi.com/products/camera-cable/)
2. Setup for using camera
   * Change bootcmd variable on U-Boot shell as follows:
   ```plaintext
   setenv bootcmd "load mmc 0:1 0x58000000 /boot/fitImage && bootm {CONFIG}"
   ```
   * Cobination of connected cameras

     | J1 | J2 | CONFIG                                 |
     |----|----|----------------------------------------|
     | V2 | -  | 0x58000000#default#j1-imx219           |
     | -  | V2 | 0x58000000#default#j2-imx219           |
     | V2 | V2 | 0x58000000#default#j1-imx219#j2-imx219 |
     | V3 | -  | 0x58000000#default#j1-imx708           |
     | -  | V3 | 0x58000000#default#j2-imx708           |
     | V3 | V3 | 0x58000000#default#j1-imx708#j2-imx708 |
     | V2 | V3 | 0x58000000#default#j1-imx219#j2-imx708 |
     | V3 | V2 | 0x58000000#default#j1-imx708#j2-imx219 |

     This table shows the results when connecting the Raspberry Pi Camera V2 and Raspberry Pi Camera V3 to either J1 or J2, and to both J1 and J2.


3. Check camera device is recognized

   **Raspberry Pi Camera V2**
   ```bash
   root@sparrow-hawk:~# cam -l
   (snip)
   Available cameras:
   1: External camera 'imx219' (/base/soc/i2c@e6508000/cam@10)   // J1
   2: External camera 'imx219' (/base/soc/i2c@e6510000/cam@10)   // J2
   ```

   **Raspberry Pi Camera V3**
   ```bash
   root@sparrow-hawk:~# cam -l
   (snip)
   Available cameras:
   1: External camera 'imx708' (/base/soc/i2c@e6508000/sensor@1a)   // J1
   2: External camera 'imx708' (/base/soc/i2c@e6510000/sensor@1a)   // J2
   ```

4. Test camera
   1. Display Output(Need to connect Display)

      **minimal: Raspberry Pi Camera V2 and Raspberry Pi Camera V3(J1 or J2)**
      ```bash
      cam -c 1 -C -D
      ```

      **minimal: Raspberry Pi Camera V2 and Raspberry Pi Camera V3(J1 and J2)**
      ```bash
      cam -c 1 -C -D
      cam -c 2 -C -D
      ```
      If you connect Raspberry Pi Touch Display:
      ```bash
      root@sparrow-hawk:~# ls /sys/class/drm/
      card0  card0-DP-1  card0-DSI-1  card0-Writeback-1  card0-Writeback-2  version
      root@sparrow-hawk:~# cam -c 1 -C -DDP-1
      ```

      **weston: Raspberry Pi Camera V2(J1 or J2)**
      ```bash
      gst-launch-1.0 libcamerasrc ! video/x-raw,format=NV16,width=1920,height=1080 ! videoconvert ! waylandsink
      ```
      or
      ```bash
      gst-launch-1.0 libcamerasrc ! video/x-raw,format=NV16,width=640,height=480 ! videoconvert ! waylandsink
      ```

      **weston: Raspberry Pi Camera V2(J1 and J2)**
      ```bash
      gst-launch-1.0 libcamerasrc camera-name="/base/soc/i2c@e6508000/cam@10" ! video/x-raw,format=NV16,width=640,height=480 ! videoconvert ! waylandsink
      gst-launch-1.0 libcamerasrc camera-name="/base/soc/i2c@e6510000/cam@10" ! video/x-raw,format=NV16,width=640,height=480 ! videoconvert ! waylandsink
      ```

      **weston: Raspberry Pi Camera V3(J1 or J2)**
      ```bash
      gst-launch-1.0 libcamerasrc ! videoconvert ! waylandsink
      ```

      **weston: Raspberry Pi Camera V3(J1 and J2)**
      ```bash
      gst-launch-1.0 libcamerasrc camera-name="/base/soc/i2c@e6508000/sensor@1a" ! videoconvert ! waylandsink
      gst-launch-1.0 libcamerasrc camera-name="/base/soc/i2c@e6510000/sensor@1a" ! videoconvert ! waylandsink
      ```

   2. Using camshark(Need to connect Network and Linux PC)
      * Please execute following command on Linux PC.
         ```bash
         sudo apt install pipx
         pipx install git+https://gitlab.freedesktop.org/camera/camshark.git
         camshark root@<sparrow_hawk_ip_address>
         ```

### Pi Display

**Note:**
* **Please perform the following "1. Setup" without connecting the AC adapter to the board (USB1).**

**Note:**
* **There is a risk of damaging the board or the display, so please connect them with great care.**

&nbsp;

1. Setup
   * Connect Raspberry Pi Touch Display 2 cable to the J4 connector.
   * Connect the Power (red wire) to pin 2 of CN7 and the Ground (black wire) to pin 6 of CN7.
   * ![Pi Display]({{ '/images/PiDisplay.jpg' | relative_url }})
2. Change bootcmd variable on U-Boot shell as follows:

   **5 inch**
   ```plaintext
   setenv bootcmd "load mmc 0:1 0x58000000 /boot/fitImage && bootm 0x58000000#default#rpi-display-2-5in"
   ```
   **7 inch**
   ```plaintext
   setenv bootcmd "load mmc 0:1 0x58000000 /boot/fitImage && bootm 0x58000000#default#rpi-display-2-7in"
   ```
3. Display will work correctly after changing above.

### Pi Active Cooler

Manual control of fan speed<br>
```bash
echo 2 > /sys/class/hwmon/hwmon4/pwm1_enable
echo 150 > /sys/class/hwmon/hwmon4/pwm1
```
\#1 ~ 255 is acceptable but low speeds are not recommended from thermal perspective.

## Tips

1. How to flash sdcard without removing the card from the board.
   * Preparation: TFTP server on your host PC and network connection between board and your host PC. And copy the gzipped image file into tftp server root.
      * ex.) /tftp/core-image-minimal-sparrow-hawk.rootfs.wic.gz
   * Execute following command on u-boot shell:
      * Note:
         * After this operation, all data is erased on the SD card which is inserted in the board.

      ```bash
      setenv ethaddr
      setenv serverip
      setenv ipaddr
      tftp ${loadaddr} <image file with gzipped> && gzwrite mmc 0 ${loadaddr} ${filesize}
      ```

      * ex.) tftp ${loadaddr} core-image-minimal-sparrow-hawk.rootfs.wic.gz && gzwrite mmc 0 ${loadaddr} ${filesize}
{:start="1"}

2. How to expand the rootfs
   * Please run “expand-rootfs.sh” script on your board. Rootfs is expanded to use whole storage.
{:start="2"}

## Known Issues & Restrictions

1. PCIe module outputs error log that firmware is not found in boot process. We are preparing the PCIe firmware, then please ignore it and please wait a moment.
   ```plaintext
   [    2.629357] pcie-rcar-gen4 e65d0000.pcie: Failed to load firmware (rcar_gen4_pcie.bin): -22
   ```

## Support

FAQ: [https://github.com/orgs/rcar-community/discussions/categories/faq](https://github.com/orgs/rcar-community/discussions/categories/faq)

Q&A Forum: [https://github.com/orgs/rcar-community/discussions/categories/q-a](https://github.com/orgs/rcar-community/discussions/categories/q-a)
