---
layout: default
title: Sparrow Hawk - Debian based BSP | R-Car Community Board
style: common
breadcrumb_parent: Sparrow Hawk
breadcrumb_parent_url: /Sparrow-Hawk/
 
breadcrumb_current: Debian based BSP
breadcrumb_current_url: /Sparrow-Hawk/BSP/debian_based_bsp.html
---

Contents
{: .contents}
0. Table of Content
{:toc}
{: .contents}

## Introduction

This is the Debian based BSP page for Sparrow Hawk.

## Software Version List

|Software                   |Version|
|---------------------------|-------|
|Debian                     |12     |
|Linux kernel               |6.12.58|
|U-Boot                     |2025.10|
|Arm Trusted Firmware       |2.14.0 |

## How to Startup

If you want to quickly start, please start [3.1.1. Quick preparation: download binary](#quick-preparation-download-binary).

If you want to normally start, please start [3.1.2. Normal preparation: build source code](#normal-preparation-build-source-code).

### Preparation of the software

#### Quick preparation: download binary

1. Download binary from GitHub
Please download [sparrow-hawk-debian-12-based-bsp.img.gz](https://github.com/rcar-community/kernel-apt-repository/releases/download/v2025-11-28/sparrow-hawk-debian-12-based-bsp.img.gz) and [ipl-burning.zip](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2025-11-27/ipl-burning.zip).
{:start="1"}

2. Unzip download zip file
```bash
unzip ipl-burning.zip
```
Next, jump to [3.2. How to flash](#how-to-flash).
{:start="2"}

#### Normal preparation: build source code

```bash
# You need to prepare docker envrionment on your Host PC
./build_image/build_with_docker_sparrow-hawk.sh <DEBIAN_VERSION>
ex.) ./build_image/build_with_docker_sparrow-hawk.sh 12
```
or
```bash
# Note: Build requirements can be confirmed from build_image/Dockerfile.
sudo ./build_image/build_debian_12_for_sparrow-hawk.sh <DEBIAN_VERSION>
ex.) sudo ./build_image/build_debian_12_for_sparrow-hawk.sh 12
```
Next, jump to [3.2. How to flash](#how-to-flash).

### How to flash

#### Flashing loader

Run script in ipl-burning directory(Linux: run.sh, Windows: run.bat). If using Linux host PC, please install python3 and pip command on your system before running the script and close other console which uses serial port of the board before executing the script.

Note:

This script use serial device /dev/ttyUSB* in Linux. But, it cannot be accessed from user wit
hout previledged right by default settings. Please use sudo command or add current user into
dialout group.
{: .indented-1 }

Note:

Please change the Mode Switch(=SW2) according to the ipl-burning(run.sh or run.bat).
{: .indented-1 }

#### Flashing OS image into SD card

**Linux case**
```bash
gzip -cd sparrow-hawk-debian-12-based-bsp.img.gz | sudo dd of=<device file> bs=1M status=progress && sync
```

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

| Function                              | Status        |
|---------------------------------------|---------------|
| [CAN](#can)                           | Supported     |
| Ethernet                              | Supported     |
| [Audio(Output/Input)](#audio)         | Supported     |
| Display Port                          | Supported     |
| [GPIO](#gpio)                         | Supported     |
| [I2C](#i2c)                           | Supported     |
| JTAG                                  | Supported     |
| USB3.0                                | Not supported |
| [UART](#uart)                         | Supported     |
| [Thermal](#thermal)                   | Supported     |
| M.2                                   | Not supported |
| [Pi Camera](#pi-camera)               | Supported     |
| [Pi Display](#pi-display)             | Supported     |
| PCIe Endpoint                         | Not supported |
| [Pi Active Cooler](#pi-active-cooler) | Supported     |
| GPU                                   | Not supported |
| AI Accelerator                        | Not supported |
| Desktop(GUI)                          | Not supported |

Note:

"Supported": Function scceeded in the simple test as below.<br>
"Not supported": Function isn't supported.<br>
{: .indented-1 }

### CAN

Loop back
1. Connect the following pins of CONN2: Connect Pin1(CAN1L) - Pin2(CAN0L) and Pin5(CAN1H) - Pin6(CAN0H)

![CAN]({{ '/images/CAN.webp' | relative_url }})
{: .indented-0 }

2. Execute following commands on Linux:
{:start="2"}
```bash
# Setup
sudo apt update
sudo apt install can-utils psmisc

# Test
sudo ip link set can0 up type can restart-ms 100 bitrate 1000000 dbitrate 5000000 fd on
sudo ip link set can1 up type can restart-ms 100 bitrate 1000000 dbitrate 5000000 fd on
sudo candump can0 &
sudo cangen can1 -I i -L i -D i -f -n 16
sudo killall candump
sudo candump can1 &
sudo cangen can0 -I i -L i -D i -f -n 16
sudo killall candump
```
{: .indented-0 }

### Audio

1. Connect headset/earphone/Speaker to CONN3.
2. (if possible) Connect audio output like a smartphone to CONN4.
3. Setup(Mix Aux in and Headset mic and setup audio output via CONN3)
```bash
sudo amixer set "Headphone" 40%
sudo amixer set "Headphone" on
sudo amixer set "Mixout Left DAC Left" on
sudo amixer set "Mixout Right DAC Right" on
sudo amixer set "Aux" on
sudo amixer set "Aux" 80%
sudo amixer set "Mixin PGA" on
sudo amixer set "Mixin PGA" 50%
sudo amixer set "ADC" on
sudo amixer set "ADC" 80%
sudo amixer set "Mixin Left Aux Left" on
sudo amixer set "Mixin Right Aux Right" on
sudo amixer set "Mic 1" on
sudo amixer set "Mic 1" 80%
sudo amixer set "Mixin Left Mic 1" on
sudo amixer set "Mixin Right Mic 1" on```
4. Test function
   1. Recording and Playback test(5sec)
      ```bash
      sudo arecord -D hw:0,0 -t wav -d 5 -c 2 -r 48000 -f S16_LE | sudo aplayi
      ```
   2. Only Playback test
      ```bash
      sudo speaker-test -c2i
      ```

### GPIO

Toggle GP2\_12(Pin11 on Pin Header)
1. Connect LED or Oscilloscope to the board
2. Execute following command
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv
   python3 -m venv .venv
   source .venv/bin/activate
   pip3 install gpiod
   wget https://raw.githubusercontent.com/rcar-community/meta-sparrow-hawk/refs/heads/scarthgap/recipes-examples/example-apps/files/toggle_gpio_GP2_12.py
   sudo .venv/bin/python3 toggle_gpio_GP2_12.py
   ```

For more examples, please see also [https://github.com/brgl/libgpiod/raw/refs/heads/master/bindings/python/examples](https://github.com/brgl/libgpiod/raw/refs/heads/master/bindings/python/examples)

### I2C

* Detect I2C device
  ```bash
  sudo apt update
  sudo apt install i2c-tools
  sudo i2c-detect -r 3
  sudo i2c-detect -r 4
  ```

Please search i2c-tools to use other commands(i2cdump, i2cget, i2cset, i2ctransfer).

### UART

Loop back
1. Connect UART TX and RX(pin 8 and pin 10) on PinHeader.

![UART]({{ '/images/UART.webp' | relative_url }})
{: .indented-0 }

2. Execute following commands:
```bash
sudo stty -F /dev/ttySC2 -echo
sudo cat /dev/ttySC2 &
echo Hello | sudo tee /dev/ttySC2
```
{:start="2"}

### Thermal

* Check SoC temperature
  ```bash
  sudo cat /sys/class/thermal/thermal_zone*/temp
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

**Note: Currently, Raspberry Pi Camera V2 and Raspberry Pi Camera V3 is only supported.**

1. Connect Raspberry Pi Camera V2 to J1 and/or J2 connector.
   * The board connector has 22 pin so that you need to prepare pitch convert cable.
   * ex.) Raspberry Pi Official Accesary [https://www.raspberrypi.com/products/camera-cable/](https://www.raspberrypi.com/products/camera-cable/)
2. Setup for using camera
   * Change bootcmd variable on U-Boot shell as follows:
   ```plaintext
   setenv bootcmd "load mmc 0:1 0x58000000 /boot/fitImage && bootm {CONFIG}"
   ```
   * Cobination of connected cameras

     | J1       | J2       | CONFIG(J1, J2: Raspberry Pi Camera V2) | CONFIG(J1, J2: Raspberry Pi Camera V3) | CONFIG(J1: V2, J2: V3)                 | CONFIG(J1: V3, J2: V2)                 |
     |----------|----------|----------------------------------------|----------------------------------------|----------------------------------------|
     | Conncted | -        | 0x58000000#default#j1-imx219           | 0x58000000#default#j1-imx708           | 0x58000000#default#j1-imx219           | 0x58000000#default#j1-imx708           |
     | -        | Conncted | 0x58000000#default#j2-imx219           | 0x58000000#default#j2-imx708           | 0x58000000#default#j1-imx708           | 0x58000000#default#j1-imx219           |
     | Conncted | Conncted | 0x58000000#default#j1-imx219#j2-imx219 | 0x58000000#default#j1-imx708#j2-imx708 | 0x58000000#default#j1-imx219#j2-imx708 | 0x58000000#default#j1-imx708#j2-imx219 |

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

      ```bash
      # build libcamera with R-Car V4H(sparrow-hawk) support
      git clone https://git.libcamera.org/libcamera/libcamera.git
      cd libcamera
      git checkout -B work b9fa6e0e61d3ea605fe4b1201ede5745cd5800e5
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0001-libcamera-ipa_manager-Create-IPA-by-name.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0002-ipa-ipa_module-Remove-pipelineName.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0003-ipa-meson.build-Remove-duplicated-variable.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0004-ipa-Allow-pipelines-to-have-differently-named-IPA.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0005-ipa-rkisp1-Add-settings-for-DreamChip-RPPX1-ISP.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0006-libcamera-pipeline-Add-R-Car-Gen4-ISP-pipeline.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0007-ipa-rkisp1-Add-basic-CCM-calibration-for-imx219.patch
      wget https://github.com/rcar-community/meta-sparrow-hawk/raw/refs/heads/scarthgap/recipes-multimedia/libcamera/files/0008-ipa-CameraSensorHelper-Add-CameraSensorHelperImx708.patch
      git config --global user.email "you@example.com"
      git config --global user.name "Your Name"
      git am *.patch
      sudo apt update
      sudo apt install meson build-essential ninja-build cmake libyaml-dev python3-yaml python3-ply python3-jinja2 libevent-dev pkg-config python3-dev python3-pybind11 libdrm-dev
      meson setup  --prefix=/usr/ -Dpipelines=rcar-gen4,rkisp1 -Dipas=rkisp1 -Dcam=enabled -Dpycamera=enabled -Dtest=false -Ddocumentation=disabled build
      sudo ninja -C build install

      # Run cam
      sudo cam -l

      # gstreamer
      cd libcamera
      sudo apt install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgstreamer-plugins-bad1.0-dev gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-gtk3 gstreamer1.0-qt5 gstreamer1.0-pulseaudio
      meson setup --reconfigure --prefix=/usr/ -Dpipelines=rcar-gen4,rkisp1 -Dipas=rkisp1 -Dcam=enabled -Dpycamera=enabled -Dtest=false -Ddocumentation=disabled -Dgstreamer=enabled build
      sudo ninja -C build install

      # Run gstreamer
      sudo gst-launch-1.0 libcamerasrc ! videoconvert ! kmssink driver-name=rcar-du

      # GUI install
      sudo apt install lxqt

      # qcam build
      cd libcamera
      sudo apt install qt6-base-dev
      meson setup --reconfigure --prefix=/usr/ -Dpipelines=rcar-gen4,rkisp1 -Dipas=rkisp1 -Dcam=enabled -Dpycamera=enabled -Dtest=false -Ddocumentation=disabled build
      sudo ninja -C build install

      # Run qcam
      sudo qcam
      ```

Note:

The Raspberry Pi Camera v3 is currently under development on mainline Linux and libcamera, so at this stage the image may appear dark and features such as auto-focus are not yet supported. In addition, recognition may occasionally fail.
{: .indented-1 }

### Pi Display

Note: Please perform the following "1. Setup" without connecting the AC adapter to the board (USB1).
{: .caution}
{: .indented-1 }

Note: There is a risk of damaging the board or the display, so please connect them with great care.
{: .caution}
{: .indented-1 }

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

Manual control of fan speed
```bash
echo 2 | sudo tee /sys/class/hwmon/hwmon4/pwm1_enable
echo 150 | sudo tee /sys/class/hwmon/hwmon4/pwm1
```
\#1 ~ 255 is acceptable but low speeds are not recommended from thermal perspective.

## Known Issues & Restrictions

1. PCIe module outputs error log that firmware is not found in boot process. We are preparing the PCIe firmware, then please ignore it and please wait a moment.
   ```plaintext
   [    2.629357] pcie-rcar-gen4 e65d0000.pcie: Failed to load firmware (rcar_gen4_pcie.bin): -22
   ```

## Support

FAQ: [https://github.com/orgs/rcar-community/discussions/categories/faq](https://github.com/orgs/rcar-community/discussions/categories/faq)

Q&A Forum: [https://github.com/orgs/rcar-community/discussions/categories/q-a](https://github.com/orgs/rcar-community/discussions/categories/q-a)
