---
layout: default
title: Sparrow Hawk - Yocto BSP | R-Car Community Board
style: common
breadcrumb_parent: Sparrow Hawk
breadcrumb_parent_url: /Sparrow-Hawk/

breadcrumb_current: Yocto BSP
breadcrumb_current_url: /Sparrow-Hawk/BSP/yocto_bsp.html
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
|Yocto Project              |5.0.15 |
|Linux kernel               |6.12.66|
|U-Boot                     |2026.01|
|Arm Trusted Firmware       |2.14.0 |

## How to Startup

If you want to quickly start, please start [3.1.1. Quick preparation: download binary](#quick-preparation-download-binary).

If you want to normally start, please start [3.1.2. Normal preparation: build source code](#normal-preparation-build-source-code).

### Preparation of the software

#### Quick preparation: download binary

Download binary from GitHub
* BSP(either of the following BSP)
   * In case of BSP: [core-image-minimal-sparrow-hawk.rootfs.wic.gz](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2026-02-03/core-image-minimal-sparrow-hawk.rootfs.wic.gz)
   * In case of BSP + 3D Graphics: [core-image-weston-sparrow-hawk.rootfs.wic.gz](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2026-02-03/core-image-weston-sparrow-hawk.rootfs.wic.gz)

Next, jump to [3.2. How to flash](#how-to-flash).

#### Normal preparation: build source code

```bash
git clone https://github.com/rcar-community/meta-sparrow-hawk -b scarthgap
cd meta-sparrow-hawk
```
**In case of BSP:**
```bash
./build.sh
```

**In case of BSP + 3D Graphics:**
```bash
./build.sh --weston
```

Next, jump to [3.2. How to flash](#how-to-flash).

### How to flash

#### Flashing OS image into microSD card

* Linux case
   * **In case of BSP:**
     ```bash
     gzip -cd core-image-minimal-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
     ```
   * **In case of BSP + 3D Graphics**
     ```bash
     gzip -cd core-image-weston-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
     ```

* Windows case
1. Extract gzip image using 7zip or similer software.
2. Flash extracted image into microSD card using Etcher, win disk imager, and so on.

#### Flashing loader

Please update the loader (u-boot) using the loader file (flash.bin) included in the Yocto OS image (rootfs).

1. Insert microSD card prepared in Section 3.2.1 into microSD card slot (CN1), then power on the Sparrow Hawk board.
2. Update the QSPI memory from U-Boot as shown below, then reboot the system.
```plaintext
load mmc 0:1 ${loadaddr} flash.bin && sf probe && sf update ${loadaddr} 0 ${filesize} && reset
```

Note:
* If flashing fails and U-Boot no longer boots, please try the recovery procedure. Please see 4 of [Tips](/Sparrow-Hawk/index.html#tips) in Sparrow Hawk page.


### How to boot

1. Insert the SD card into CN1 which is bottom of the board.
2. Open terminal application and open serial device.
3. Press SW1 to power on the board.
4. After booting U-Boot, please press any key while showing "Hit any key to stop autoboot:" to enter U-Boot shell.
5. Input the following command into U-Boot shell and press enter key. If you connect camera and/or display, please choice the following button and input command.
{% include selector.html config="camera_bootcmd" data-mode="normal" %}
6. If command and environment is correct, Linux kernel log will output.
{:start="6"}
7. Log in to "sparrow-hawk login:" as root.
{:start="7"}

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
| [USB3.0](#usb30)                      | Supported       | Supported      |
| [UART](#uart)                         | Supported       | Supported      |
| [Thermal](#thermal)                   | Supported       | Supported      |
| [NVMe M.2 SSD](#nvme-m2-ssd)          | Supported       | Supported      |
| [Pi Camera](#pi-camera)               | Supported       | Supported      |
| [Pi Display](#pi-display)             | Supported       | Supported      |
| PCIe Endpoint                         | Not supported   | Not supported  |
| [Pi Active Cooler](#pi-active-cooler) | Supported       | Supported      |
| GPU                                   | Not supported   | Supported      |
| AI Accelerator                        | Not supported   | Not supported  |
| Desktop(GUI)                          | Not supported   | Supported      |

Note:
* "Supported": Function scceeded in the simple test as below.
* "Not supported": Function isn't supported.

### CAN

Loop back
1. Connect the following pins of CONN2: Connect Pin1(CAN1L) - Pin2(CAN0L) and Pin5(CAN1H) - Pin6(CAN0H)

* ![CAN]({{ '/images/CAN.webp' | relative_url }})

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

* Audio connector
   * ![Audio connector]({{ '/images/audio_connector.webp' | relative_url }})
   * Sparrow Hawk has two audio input ports. These signals are mixed on the IC and therefore handled as a single-channel input on the board.
* Hardware setup
   * Connect headset/earphone/Speaker to CONN3.
   * (if possible) Connect audio output like a smartphone to CONN4.
      * Even if you don't connect an audio output to CONN4, you can test.
* Software setup
   * Setup(Mix Aux in and Headset mic and setup audio output via CONN3)
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
* Test function
   1. Only Playback test (3 times) [CONN3]
      ```bash
      speaker-test -c 2 -l 3 -t wav -W /usr/share/sounds/alsa/
      ```
   * ![Playback]({{ '/images/playback.webp' | relative_url }})
   2. Only Recording test (5sec) [CONN3 or CONN4 or ‘CONN3 and CONN4’]
      ```bash
      arecord -D hw:0,0 -t wav -d 5 -c 2 -r 48000 -f S16_LE > audio.wav
      ```
   * ![Recording]({{ '/images/recording.webp' | relative_url }})
   3. Recording and Playback test (5sec) [CONN3 or ‘CONN3+CONN4’]
      ```bash
      arecord -D hw:0,0 -t wav -d 5 -c 2 -r 48000 -f S16_LE | aplay
      ```
   * ![Recording and Playback]({{ '/images/recording_playback.webp' | relative_url }})

### GPIO

Toggle GP2\_12(Pin11 on Pin Header)
1. Connect LED or Oscilloscope to the board
   * ex) LED
   * ![LED]({{ '/images/LED.webp' | relative_url }})
      * Please install a resistor to prevent damage to the LED. In the Connection image, it is used a 1kΩ resistor.
2. Execute following command
   ```bash
   python3 /usr/bin/example-apps/toggle_gpio_GP2_12.py
   ```

For more examples, please see also [https://github.com/brgl/libgpiod/raw/refs/heads/master/bindings/python/examples](https://github.com/brgl/libgpiod/raw/refs/heads/master/bindings/python/examples)

### I2C

* Detect I2C device
  ```bash
  i2cdetect -y -r 3
  i2cdetect -y -r 4
  ```
  Since I2C bus numbers 3 and 4 are assigned to the External IO, execute the above command.

   * I2C pin assignment
   * ![I2C pin]({{ '/images/I2C_pin.webp' | relative_url }})

* As an example, output result using Argon FAN HAT
  ```bash
  root@sparrow-hawk:~# i2cdetect -y -r 3
       0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
  00:                         -- -- -- -- -- -- -- --
  10: -- -- -- -- -- -- -- -- -- -- 1a -- -- -- -- --
  20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  70: -- -- -- -- -- -- -- --
  root@sparrow-hawk:~# i2cdetect -y -r 4
       0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
  00:                         -- -- -- -- -- -- -- --
  10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  50: 50 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  70: -- -- -- -- -- -- -- --
  ```
   * Argon FAN HAT: [https://argon40.com/en-jp/products/argon-fan-hat](https://argon40.com/en-jp/products/argon-fan-hat)

* Please search i2c-tools to use other commands(i2cdump, i2cget, i2cset, i2ctransfer).

### USB3.0

* With the power turned on, connect it to any available USB6 port. If “SuperSpeed” is displayed, the test is successful.

   * Output example(the upper USB6 port)
     ```plaintext
     [   74.051911] usb 2-3: new SuperSpeed USB device number 2 using xhci-pci-renesas
     [   74.078718] usb-storage 2-3:1.0: USB Mass Storage device detected
     [   74.080680] scsi host0: usb-storage 2-3:1.0
     [   75.104448] scsi 0:0:0:0: Direct-Access     SanDisk  Ultra Fit        1.00 PQ: 0 ANSI: 6
     [   75.117190] sd 0:0:0:0: [sda] 60088320 512-byte logical blocks: (30.8 GB/28.7 GiB)
     [   75.120450] sd 0:0:0:0: [sda] Write Protect is off
     [   75.122794] sd 0:0:0:0: [sda] Write cache: disabled, read cache: enabled, doesn't support DPO or FUA
     [   75.176866]  sda: sda1
     [   75.177754] sd 0:0:0:0: [sda] Attached SCSI removable disk
     ```

   * Output example(the lower USB6 port)
     ```plaintext
     [  167.907865] usb 2-4: new SuperSpeed USB device number 3 using xhci-pci-renesas
     [  167.939390] usb-storage 2-4:1.0: USB Mass Storage device detected
     [  167.940850] scsi host0: usb-storage 2-4:1.0
     [  168.960666] scsi 0:0:0:0: Direct-Access     SanDisk  Ultra Fit        1.00 PQ: 0 ANSI: 6
     [  168.967661] sd 0:0:0:0: [sda] 60088320 512-byte logical blocks: (30.8 GB/28.7 GiB)
     [  168.971146] sd 0:0:0:0: [sda] Write Protect is off
     [  168.973359] sd 0:0:0:0: [sda] Write cache: disabled, read cache: enabled, doesn't support DPO or FUA
     [  169.026988]  sda: sda1
     [  169.027913] sd 0:0:0:0: [sda] Attached SCSI removable disk
     ```

### UART

Loop back
1. Connect UART TX and RX(pin 8 and pin 10) on PinHeader.

* ![UART]({{ '/images/UART.webp' | relative_url }})

2. Execute following commands:
```bash
stty -F /dev/ttySC2 -echo
cat /dev/ttySC2 &
echo Hello > /dev/ttySC2 && sleep 1
killall cat
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

### NVMe M.2 SSD

**Note:**
* **SATA M.2 SSD is not supported.**

&nbsp;

* Insert the NVMe into CN5 before powering on.
* The NVMe used for this test is the Samsung 970 EVO Plus.
  ```bash
  dmesg | grep nvme
  ```

   * Output example
     ```plaintext
     root@sparrow-hawk:~# dmesg | grep nvme
     [    4.738931] nvme nvme0: pci function 0000:01:00.0
     [    4.741086] nvme 0000:01:00.0: enabling device (0000 -> 0002)
     [    4.745462] nvme nvme0: missing or invalid SUBNQN field.
     [    4.747759] nvme nvme0: D3 entry latency set to 8 seconds
     [    4.769123] nvme nvme0: 4/0/0 default/read/poll queues
     [    4.783049]  nvme0n1: p1
     ```

### Pi Camera

**Note:**
* **Currently, Raspberry Pi Camera V2 and Raspberry Pi Camera V3 is only supported.**

Note:
* The Raspberry Pi Camera v3 is currently under development on mainline Linux and libcamera,
so at this stage the image may appear dark and features such as auto-focus are not yet suppor
ted. In addition, recognition may occasionally fail.

&nbsp;

1. Connect Raspberry Pi Camera V2 and/or Raspberry Pi Camera V3 to J1 and/or J2 connector.
   * The board connector has 22 pin so that you need to prepare pitch convert cable.
   * When using the Raspberry Pi Camera V2, the following cable is required.
      * [https://www.raspberrypi.com/products/camera-cable/](https://www.raspberrypi.com/products/camera-cable/)
   * ![Camera cable]({{ '/images/camera_cable.webp' | relative_url }})
2. Change bootcmd variable on U-Boot shell referring 5 of [3.3. How to boot](#how-to-boot).
3. Test camera
   * [Camshark](https://gitlab.freedesktop.org/camera/camshark) test(Need to connect Network and Linux PC)
      * Camshark is a gui tool to work remotely with libcamera based cameras.
      * Network connection example
      * ![network connection]({{ '/images/network_connection.webp' | relative_url }})
      * Please confirm your Sparrow Hawk board IP address on Sparrow Hawk.
        ```bash
        ifconfig
        ```
        If you cannot find inet, please execute following command on Sparrow Hawk.
        ```bash
        ifconfig xxx <sparrow_hawk_ip_address>
        ```
        ex) ifconfig end0 192.168.10.2
      * Please execute following command on Linux PC.
        ```bash
        sudo apt install pipx
        pipx install git+https://gitlab.freedesktop.org/camera/camshark.git
        camshark root@<sparrow_hawk_ip_address>
        ```
        ex) camshark root@192.168.10.2
      * To switch the camera device when two cameras are connected, follow these steps.
      * ![Camshark]({{ '/images/Camshark.webp' | relative_url }})
   * On-board test(Need to connect Display)

{% include selector.html title="Command for minimal" config="camera_minimal" data-mode="minimal" %}

{% include selector.html title="Command for weston" config="camera_weston" data-mode="weston" %}

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
2. Change bootcmd variable on U-Boot shell referring 5 of [3.3. How to boot](#how-to-boot).
3. Display will work correctly after changing above.

### Pi Active Cooler

* Connect Raspberry Pi Active Cooler to the J3 connector.

* ![Pi Active Cooler]({{ '/images/PiActiveCooler.webp' | relative_url }})

   * Raspberry Pi Active Cooler: [https://www.raspberrypi.com/products/active-cooler/](https://www.raspberrypi.com/products/active-cooler/)

* The thermal pad is not aligned with the R-Car V4H Chip. Please reposition the thermal pad to match the location of the R-Car V4H Chip.

* ![thermal pad]({{ '/images/thermal_pad.webp' | relative_url }})

   * The thermal pad application method is one example, ensure it is applied to adhere to at least the R-Car V4H chip and DRAM.

* Manual control of fan speed<br>
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
   * Please run the following command on your board. Rootfs is expanded to use whole storage.
     ```bash
     sudo expand-rootfs.sh
     sudo reboot
     ```
{:start="2"}

## Support

FAQ: [https://github.com/orgs/rcar-community/discussions/categories/faq](https://github.com/orgs/rcar-community/discussions/categories/faq)

Q&A Forum: [https://github.com/orgs/rcar-community/discussions/categories/q-a](https://github.com/orgs/rcar-community/discussions/categories/q-a)

