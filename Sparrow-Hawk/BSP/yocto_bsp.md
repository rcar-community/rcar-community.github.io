---
layout: home
title: Sparrow Hawk - Yocto BSP | R-Car Community Board
style: common
breadcrumbs:
  - name: TOP
    url: /index.html
  - name: Sparrow Hawk
    url: /Sparrow-Hawk/index.html
  - name: Yocto BSP
    url: /Sparrow-Hawk/BSP/yocto_bsp.html
right_links: sh_right_links
page_type: Yocto
use_toc: true
---

## Introduction

This is the Yocto BSP page for Sparrow Hawk.

## Software Version List

|Software                   |Version|
|---------------------------|-------|
|Yocto Project              |5.0.20 |
|Linux kernel               |6.18.54|
|U-Boot                     |2026.10|
|Arm Trusted Firmware       |2.15.0 |

## How to Startup

Prepare the OS image by downloading it or by building it by yourself, then flash it to the boot device.

### Preparation of the software

{%- capture prepare_md -%}
<!-- variant 0 -->
Download the OS image from GitHub
* BSP(either of the following BSP)
   * In case of BSP: [core-image-minimal-sparrow-hawk.rootfs.wic.gz](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2026-10-16/core-image-minimal-sparrow-hawk.rootfs.wic.gz)
      * For Linux users, you can download the OS image using the following command.
      ```bash
      wget -c https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2026-10-16/core-image-minimal-sparrow-hawk.rootfs.wic.gz
      ```
   * In case of BSP + 3D Graphics: [core-image-weston-sparrow-hawk.rootfs.wic.gz](https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2026-10-16/core-image-weston-sparrow-hawk.rootfs.wic.gz)
      * For Linux users, you can download the OS image using the following command.
      ```bash
      wget -c https://github.com/rcar-community/meta-sparrow-hawk/releases/download/v2026-10-16/core-image-weston-sparrow-hawk.rootfs.wic.gz
      ```

---

<!-- variant 1 -->
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

The OS image is created in the following directory.
* In case of BSP: core-image-minimal-sparrow-hawk.rootfs.wic.gz
* In case of BSP + 3D Graphics: core-image-weston-sparrow-hawk.rootfs.wic.gz

```bash
ls ./build/build-sparrow-hawk/tmp/deploy/images/sparrow-hawk/
```
{%- endcapture -%}
{% include multi-tabs.html id="prepare-os-image"
                           labels="Download OS image|Build OS image"
                           contents=prepare_md %}

### Flashing OS image

Select the boot device.

{%- capture flash_md -%}
<!-- variant 0 -->
* Linux case
   * **In case of BSP:**
     ```bash
     gzip -cd core-image-minimal-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
     ```
     ex) gzip -cd core-image-minimal-sparrow-hawk.rootfs.wic.gz | sudo dd of=/dev/sdi bs=1M status=progress && sync
   * **In case of BSP + 3D Graphics**
     ```bash
     gzip -cd core-image-weston-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
     ```
     ex) gzip -cd core-image-weston-sparrow-hawk.rootfs.wic.gz | sudo dd of=/dev/sdi bs=1M status=progress && sync

* Windows case
   1. Extract gzip image using 7zip or similar software.
   2. Flash extracted image into microSD card using Etcher, win disk imager, and so on.

---

<!-- variant 1 -->
The image is written from a Linux host PC in the same way as the microSD card.

**Note:**
* **All data on the target device is erased. Please check the device file carefully before running the command.**
* **SATA M.2 SSD is not supported.**

&nbsp;

1. Connect the USB storage device or the NVMe M.2 SSD to the Linux host PC.
   * For the NVMe M.2 SSD, a USB-NVMe enclosure or an M.2 adapter is required.
2. Check the device file of the target device.
   ```bash
   lsblk
   ```
3. Write the OS image to the device.
   * **In case of BSP:**
     ```bash
     gzip -cd core-image-minimal-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
     ```
   * **In case of BSP + 3D Graphics**
     ```bash
     gzip -cd core-image-weston-sparrow-hawk.rootfs.wic.gz | sudo dd of=<device file> bs=1M status=progress && sync
     ```
4. Connect the device to Sparrow Hawk.
   * USB storage device: {% include hover-image.html text="USB6" img="/images/USB6.webp" %}
   * NVMe M.2 SSD: {% include hover-image.html text="CN5" img="/images/CN5.webp" %} (insert it before powering on)
{%- endcapture -%}
{% include multi-tabs.html id="flash-os-image"
                           labels="microSD card|USB storage / NVMe M.2 SSD"
                           contents=flash_md %}

To boot from the device, please see [How to boot](#how-to-boot).

### Update loader

Please update the loader (u-boot) using the loader file (flash.bin) included in the Yocto OS image (rootfs).
This is needed only if the U-Boot version displayed at boot is older than the one in [Software Version List](#software-version-list).

1. Insert the boot device prepared in [Flashing OS image](#flashing-os-image) into Sparrow Hawk, then power on the board and enter the U-Boot shell referring to steps 1 to 5 of [How to boot](#how-to-boot).
2. Update the QSPI memory by running the command corresponding to the boot device. The system is reset after the update.
   * microSD card
     ```bash
     run update_loader_from_mmc
     ```
   * USB storage device
     ```bash
     run update_loader_from_usb
     ```
   * NVMe M.2 SSD
     ```bash
     run update_loader_from_nvme
     ```
3. Enter the U-Boot shell again and reset the environment to default as shown below. The environment saved by `saveenv` before overrides the default environment of the new loader and hides the commands such as `autoconf_xxx`.
   ```bash
   env default -a
   saveenv
   reset
   ```

Note:
* `env default -a` resets all U-Boot environment variables, including your own settings such as `bootcmd` and `ethaddr`. Please set them again if necessary.
* `update_loader_from_usb` and `update_loader_from_nvme` use PCIe. If the device is not found, please see [Troubleshooting of USB/NVMe M.2 SSD boot](#troubleshooting-of-usb-nvme-boot) in [Tips](#tips).
* If `update_loader_from_xxx` is not defined (the loader is older than the v2026-04-13 release), insert the microSD card and use the following command instead of step 2.
  ```plaintext
  load mmc 0:1 ${loadaddr} flash.bin && sf probe && sf update ${loadaddr} 0 ${filesize} && reset
  ```
* If flashing fails and U-Boot no longer boots, please try the recovery procedure. Please see [Loader recovery procedure in Sparrow Hawk page](/Sparrow-Hawk/index.html#loader-recovery-procedure).

### How to boot

1. Ensure that the fan is properly installed.
2. Insert the boot device into Sparrow Hawk.
   * microSD card: insert it into {% include hover-image.html text="CN1" img="/images/CN1.webp" %} which is bottom of the board.
   * USB storage device: connect it to {% include hover-image.html text="USB6" img="/images/USB6.webp" %}.
   * NVMe M.2 SSD: insert it into {% include hover-image.html text="CN5" img="/images/CN5.webp" %}.
3. Open terminal application and open serial device.
4. Press {% include hover-image.html text="SW1" img="/images/SW1.webp" %} to power on the board.
5. After booting U-Boot, please press any key while showing "Hit any key to stop autoboot:" to enter U-Boot shell.
6. Input the command corresponding to the boot device into U-Boot shell and press enter key.
   * microSD card
     ```bash
     run autoconf_mmc
     ```
   * USB storage device
     ```bash
     run autoconf_usb
     ```
   * NVMe M.2 SSD
     ```bash
     run autoconf_nvme
     ```
7. If command and environment is correct, Linux kernel log will output.
8. Log in using the following login ID.
   * sparrow-hawk login: root

Note:
* `autoconf_xxx` sets `bootargs` for the boot device, loads `/boot/fitImage` from the first partition of the device, and runs the boot script in it.
* The boot script detects the connected Pi Camera(J1/J2) and DSI display(J4) automatically and selects the corresponding configuration. You don't need to specify them manually.
* When booting from USB storage device or NVMe M.2 SSD, the initramfs is used to load the PCIe firmware at an early stage.

&nbsp;

To make the command executed in step 6 of [How to boot](#how-to-boot) persistent across reboots, set it to `bootcmd` and run `saveenv` as shown below.
After saving the environment, reboot the system once. From the next boot onward, the command will be executed automatically, and you can skip steps 5 and 6 in [How to boot](#how-to-boot).
```bash
setenv bootcmd "run autoconf_mmc"  # Replace with autoconf_usb or autoconf_nvme according to the boot device
saveenv
reset  # Execute this only the first time
```

#### Boot options

The boot script changes its behavior according to the following U-Boot environment variables. Set them before running `autoconf_xxx` (use `saveenv` to keep them).

| Variable        | Value     | Description                                                       |
|-----------------|-----------|-------------------------------------------------------------------|
| `fan`           | `pwm`     | Apply the PWM fan settings for J3 (ex. Pi Active Cooler). The fan also works without this setting. |
| `fan`           | `argon40` | Enable the configuration for Argon FAN HAT (if it is detected).   |
| `disable_uio`   | `1`       | Disable the UIO devicetree overlay (enabled by default).          |
| `conf_append`   | string    | Append the string to the FIT configuration name. For advanced use.|

ex) Use Argon FAN HAT
```bash
setenv fan argon40
run autoconf_mmc
```

## How to Check Functions

### Software support list

| Function                              | Status(minimal)        | Status(weston)         |
|---------------------------------------|------------------------|------------------------|
| [CAN](#can)                           | Supported              | Supported              |
| Ethernet                              | Supported              | Supported              |
| [Audio(Output/Input)](#audio)         | Supported              | Supported              |
| Display Port                          | Supported              | Supported              |
| [GPIO](#gpio)                         | Supported              | Supported              |
| [I2C](#i2c)                           | Supported              | Supported              |
| JTAG                                  | Supported              | Supported              |
| [USB3.0](#usb30)                      | Supported              | Supported              |
| [UART](#uart)                         | Supported              | Supported              |
| [Thermal](#thermal)                   | Supported              | Supported              |
| [NVMe M.2 SSD](#nvme-m2-ssd)          | Supported              | Supported              |
| [Pi Camera](#pi-camera)               | Supported              | Supported              |
| [DSI Display](#dsi-display)           | Supported              | Supported              |
| PCIe Endpoint                         | Support planned (2026) | Support planned (2026) |
| [Pi Active Cooler](#pi-active-cooler) | Supported              | Supported              |
| [GPU](#gpu)                           | Not supported          | Supported              |
| AI Accelerator(CNN-IP)                | Support planned (2026) | Support planned (2026) |
| Desktop(GUI)                          | Not supported          | Supported              |

Note:
* "Supported": Function succeeded in the simple test as below.
* "Not supported": No support plan.

### CAN

Loop back
1. Connect the following pins of {% include hover-image.html text="CONN2" img="/images/CONN2.webp" %}: Connect Pin1(CAN1L) - Pin2(CAN0L) and Pin5(CAN1H) - Pin6(CAN0H)

* ![CAN]({{ '/images/CAN.webp' | relative_url }})

2. Execute following commands on Linux:
```bash
ip link set can0 up type can restart-ms 100 bitrate 1000000 dbitrate 5000000 fd on
ip link set can1 up type can restart-ms 100 bitrate 1000000 dbitrate 5000000 fd on
candump can0 -n 16 &
cangen can1 -I i -L i -D i -f -n 16
candump can1 -n 16 &
cangen can0 -I i -L i -D i -f -n 16
```
{:start="2"}

### Audio

* Audio connector
   * ![Audio connector]({{ '/images/audio_connector.webp' | relative_url }})
   * Sparrow Hawk has two audio input ports. These signals are mixed on the IC and therefore handled as a single-channel input on the board.
* Hardware setup
   * Connect headset/earphone/Speaker to {% include hover-image.html text="CONN3" img="/images/CONN3.webp" %}.
   * (if possible) Connect audio output like a smartphone to {% include hover-image.html text="CONN4" img="/images/CONN4.webp" %}.
      * Even if you don't connect an audio output to {% include hover-image.html text="CONN4" img="/images/CONN4.webp" %}, you can test.
* Software setup
   * Setup(Mix Aux in and Headset mic and setup audio output via {% include hover-image.html text="CONN3" img="/images/CONN3.webp" %})

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
   1. Only Playback test (3 times) [{% include hover-image.html text="CONN3" img="/images/CONN3.webp" %}]
      ```bash
      speaker-test -c 2 -l 3 -t wav -W /usr/share/sounds/alsa/
      ```
   * ![Playback]({{ '/images/playback.webp' | relative_url }})
   2. Only Recording test (5sec) [{% include hover-image.html text="CONN3" img="/images/CONN3.webp" %} or {% include hover-image.html text="CONN4" img="/images/CONN4.webp" %} or ‘{% include hover-image.html text="CONN3" img="/images/CONN3.webp" %} and {% include hover-image.html text="CONN4" img="/images/CONN4.webp" %}’]
      ```bash
      arecord -D hw:0,0 -t wav -d 5 -c 2 -r 48000 -f S16_LE > audio.wav
      ```
   * ![Recording]({{ '/images/recording.webp' | relative_url }})
   * If you want to check audio.wav, execute following command.
     ```
     aplay audio.wav
     ```
   3. Recording and Playback test (5sec) [{% include hover-image.html text="CONN3" img="/images/CONN3.webp" %} or ‘{% include hover-image.html text="CONN3" img="/images/CONN3.webp" %}+{% include hover-image.html text="CONN4" img="/images/CONN4.webp" %}’]
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

* As an example, output result using Argon FAN HAT and setting `setenv fan argon40` before booting (please see [Boot options](#boot-options))
   * i2cdetect: detect I2C devices on a bus

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
   * i2cset: control FAN speed
     ```bash
     root@sparrow-hawk:# i2cset -y 3 0x01a 0x00 # 0%
     root@sparrow-hawk:# i2cset -y 3 0x01a 0x32 # 50%
     root@sparrow-hawk:# i2cset -y 3 0x01a 0x64 # 100%
     ```
      * Argon FAN HAT: [https://argon40.com/en-jp/products/argon-fan-hat](https://argon40.com/en-jp/products/argon-fan-hat)

* Please search i2c-tools to use other commands(i2cdump, i2cget, i2cset, i2ctransfer).

### USB3.0

* With the power on, connect a USB flash drive to the {% include hover-image.html text="USB6" img="/images/USB6.webp" %} port on the board. If “SuperSpeed” is displayed, the test is successful.

   * Output example(the upper {% include hover-image.html text="USB6" img="/images/USB6.webp" %} port)
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

   * Output example(the lower {% include hover-image.html text="USB6" img="/images/USB6.webp" %} port)
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
  | 100 °C         | Forced system shutdown     |

* Measurement point

  | zone          | Measurement point |
  |---------------|-------------------|
  | thermal_zone0 | around Cortex-R52 |
  | thermal_zone1 | around CNN        |
  | thermal_zone2 | around Cortex-A76 |
  | thermal_zone3 | around DDR-PHY    |

### NVMe M.2 SSD

**Note:**
* **SATA M.2 SSD is not supported.**

&nbsp;

* Insert the NVMe into {% include hover-image.html text="CN5" img="/images/CN5.webp" %} before powering on.
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
* **Currently, only Raspberry Pi Camera V2 and Raspberry Pi Camera V3 are supported.**

Note:
* The Raspberry Pi Camera V3 is currently under development on mainline Linux and libcamera,
so at this stage the image may appear dark and features such as auto-focus are not yet supported. In addition, recognition may occasionally fail.

&nbsp;

1. Connect Raspberry Pi Camera V2 and/or Raspberry Pi Camera V3 to {% include hover-image.html text="J1" img="/images/J1.webp" %} and/or {% include hover-image.html text="J2" img="/images/J2.webp" %} connector.
   * The board connector has 22 pins, so you need to prepare a pitch conversion cable.
   * When using the Raspberry Pi Camera V2, the following cable is required.
      * [https://www.raspberrypi.com/products/camera-cable/](https://www.raspberrypi.com/products/camera-cable/)
   * ![Camera cable]({{ '/images/camera_cable.webp' | relative_url }})
2. Boot Linux referring to step 6 of [How to boot](#how-to-boot). The connected device is detected automatically.
3. Test camera. Select a test method from the following tabs.

{%- capture camera_test_md -%}
<!-- variant 0 -->
A display is required.

{% include selector.html title="Command for minimal" config="camera_minimal" data-mode="minimal" %}

{% include selector.html title="Command for weston" config="camera_weston" data-mode="weston" %}

---
<!-- variant 1 -->
[Camshark](https://gitlab.freedesktop.org/camera/camshark) is a GUI tool to work remotely with libcamera based cameras. A network connection and a Linux PC are required.

* Network connection example
* ![network connection]({{ '/images/network_connection.webp' | relative_url }})
* Please check the IP address of your Sparrow Hawk board on Sparrow Hawk.
  ```bash
  ifconfig
  ```
  If you cannot find inet, please execute the following command on Sparrow Hawk.
  ```bash
  ifconfig xxx <sparrow_hawk_ip_address>
  ```
  ex) ifconfig end0 192.168.10.2
* Please execute the following command on Linux PC.
  ```bash
  sudo apt install pipx
  pipx install git+https://gitlab.freedesktop.org/camera/camshark.git
  camshark root@<sparrow_hawk_ip_address>
  ```
  ex) camshark root@192.168.10.2
* To switch the camera device when two cameras are connected, follow these steps.
* ![Camshark]({{ '/images/Camshark.webp' | relative_url }})
{%- endcapture -%}
{% include multi-tabs.html id="camera-test"
                           labels="On-board test|Camshark (remote)"
                           contents=camera_test_md %}

### DSI Display

The following displays can be connected to the {% include hover-image.html text="J4" img="/images/J4.webp" %} connector. The connected device is detected automatically when you boot Linux referring to step 6 of [How to boot](#how-to-boot), so you don't need to specify it.

#### Raspberry Pi Touch Display 2

Raspberry Pi Touch Display 2: [https://www.raspberrypi.com/products/touch-display-2/](https://www.raspberrypi.com/products/touch-display-2/)

**Note:**
* **Please perform the following "1. Setup" without connecting the AC adapter to the board ({% include hover-image.html text="USB1" img="/images/USB1.webp" %}).**

**Note:**
* **There is a risk of damaging the board or the display, so please connect them with great care.**

&nbsp;

1. Setup
   * Connect Raspberry Pi Touch Display 2 cable to the {% include hover-image.html text="J4" img="/images/J4.webp" %} connector.
   * Connect the Power (red wire) to pin 2 of {% include hover-image.html text="CN7" img="/images/CN7.webp" %} and the Ground (black wire) to pin 6 of {% include hover-image.html text="CN7" img="/images/CN7.webp" %}.
   * ![Pi Display]({{ '/images/PiDisplay.jpg' | relative_url }})
2. Boot Linux referring to step 6 of [How to boot](#how-to-boot). The connected device is detected automatically.
3. Display will work correctly after booting.

#### Others

* [Olimex MIPI-HDMI adapter](https://www.olimex.com/Products/IoT/ESP32-P4/MIPI-HDMI/): Connect the adapter to the {% include hover-image.html text="J4" img="/images/J4.webp" %} connector, and connect an HDMI display to the adapter. The official Raspberry Pi FPC cable can be used to connect the adapter.
* [Waveshare 13.3inch DSI LCD](https://www.waveshare.com/wiki/13.3inch_DSI_LCD): Connect the panel to the {% include hover-image.html text="J4" img="/images/J4.webp" %} connector.

For the details of the connection, refer to the manual of each product.

### Pi Active Cooler

* Connect Raspberry Pi Active Cooler to the {% include hover-image.html text="J3" img="/images/J3.webp" %}connector.

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

### GPU

**Note:**
* **This function is available only in the BSP + 3D Graphics image (core-image-weston).**

&nbsp;

1. Connect a display to Sparrow Hawk and boot Linux referring to [How to boot](#how-to-boot). Weston starts automatically.
2. Execute the following commands on the serial console. Each application renders on the display.
   * OpenGL ES (weston-simple-egl)
     ```bash
     weston-simple-egl
     ```
   * OpenGL ES benchmark (glmark2)
     ```bash
     glmark2-es2-wayland
     ```
   * Vulkan (vkcube)
     ```bash
     vkcube
     ```
3. Press Ctrl+C on the serial console to stop each application.
4. To check OpenCL, execute `clinfo` on the serial console. The GPU is available if the platform and the device are listed as follows.
   ```bash
   clinfo
   ```
   ```text
   Number of platforms                               1
     Platform Name                                   PowerVR
   ...
   Number of devices                                 1
     Device Name                                     PowerVR A-Series AXM-8-256
   ```

## Tips

### How to flash OS image without removing the device from the board

Preparation:
* TFTP server on your host PC and network connection between board and your host PC.
* Copy the gzipped image file into tftp server root.
   * ex.) /tftp/core-image-minimal-sparrow-hawk.rootfs.wic.gz

**Note:**
* **After this operation, all data is erased on the device which is selected below.**

&nbsp;

Execute following command on u-boot shell:
```bash
setenv ethaddr
setenv serverip
setenv ipaddr
```

Then, select the device to flash and execute the command.

{%- capture tftp_flash_md -%}
<!-- variant 0 -->
```bash
tftp ${loadaddr} <image file with gzipped> && gzwrite mmc 0 ${loadaddr} ${filesize}
```
ex.) tftp ${loadaddr} core-image-minimal-sparrow-hawk.rootfs.wic.gz && gzwrite mmc 0 ${loadaddr} ${filesize}

---

<!-- variant 1 -->
```bash
pci e
usb start
tftp ${loadaddr} <image file with gzipped> && gzwrite usb 0 ${loadaddr} ${filesize}
```
ex.) tftp ${loadaddr} core-image-minimal-sparrow-hawk.rootfs.wic.gz && gzwrite usb 0 ${loadaddr} ${filesize}

**Note:**
* **The PCIe firmware is required to use USB storage device on U-Boot. If the device is not found, please see [Troubleshooting of USB/NVMe M.2 SSD boot](#troubleshooting-of-usb-nvme-boot).**

---

<!-- variant 2 -->
```bash
pci e
nvme scan
tftp ${loadaddr} <image file with gzipped> && gzwrite nvme 0 ${loadaddr} ${filesize}
```
ex.) tftp ${loadaddr} core-image-minimal-sparrow-hawk.rootfs.wic.gz && gzwrite nvme 0 ${loadaddr} ${filesize}

**Note:**
* **The PCIe firmware is required to use NVMe M.2 SSD on U-Boot. If the device is not found, please see [Troubleshooting of USB/NVMe M.2 SSD boot](#troubleshooting-of-usb-nvme-boot).**
{%- endcapture -%}
{% include multi-tabs.html id="tftp-flash-os-image"
                           labels="microSD card|USB storage|NVMe M.2 SSD"
                           contents=tftp_flash_md %}

### How to expand the rootfs

Please run the following command on your board. Rootfs is expanded to use whole storage.
```bash
expand-rootfs.sh
reboot
```

### Troubleshooting of USB/NVMe M.2 SSD boot {#troubleshooting-of-usb-nvme-boot}

Booting from USB storage device or NVMe M.2 SSD (`autoconf_usb` / `autoconf_nvme`) and `update_loader_from_usb` / `update_loader_from_nvme` initialize PCIe in U-Boot, which needs the PCIe firmware.
If the device is not found, please check the two conditions below.

**Condition 1: The PCIe firmware is written to the SPI flash.**

If the PCIe firmware is not written, dummy data is loaded as the firmware and PCIe does not work correctly. No error message is displayed in this case.
Updating the loader by the procedure in [Update loader](#update-loader) updates only U-Boot and does not write the PCIe firmware.
Write the PCIe firmware by either of the following methods.

* Method A: Recovery procedure (ipl-burning)
   * Run ipl-burning at least once, referring to [Loader recovery procedure in Sparrow Hawk page](/Sparrow-Hawk/index.html#loader-recovery-procedure). It writes both the loader and the PCIe firmware.
* Method B: Write from the microSD card on U-Boot shell
   * Boot U-Boot with the microSD card which has the Yocto OS image (rootfs), then run the following command. It writes `lib/firmware/rcar_gen4_pcie.bin` in the rootfs to the SPI flash.

     ```bash
     run flash_pcie_fw_to_qspi_from_mmc
     ```

**Condition 2: The environment variables for loading the PCIe firmware are set in U-Boot.**

If they are not set, the following message is displayed.
```plaintext
Define 'renesas_rcar_gen4_load_firmware' script which loads the R-Car
Gen4 PCIe controller firmware from storage into memory and sets these
two environment variables:
  ...
```

Check them on U-Boot shell. If they are not displayed, they are not set.
```bash
printenv renesas_rcar_gen4_load_firmware set_pcie_firmware_info
```

The environment saved by `saveenv` in the previous version overrides the default environment, so the variables may be missing even after the loader is updated. Reset the environment to default as shown below.
```bash
env default -a
saveenv
reset
```

**Note:**
* **`env default -a` resets all U-Boot environment variables, including your own settings such as `bootcmd` and `ethaddr`. Please set them again if necessary.**

## Known Issues

{% include issues_table.html %}
