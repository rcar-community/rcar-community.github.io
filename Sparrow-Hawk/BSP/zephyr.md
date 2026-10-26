---
layout: home
title: Sparrow Hawk - Zephyr | R-Car Community Board
style: common
breadcrumbs:
  - name: TOP
    url: /index.html
  - name: Sparrow Hawk
    url: /Sparrow-Hawk/index.html
  - name: Zephyr
    url: /Sparrow-Hawk/BSP/zephyr.html
right_links: sh_right_links
use_toc: true
---

## Introduction

This is the Zephyr page for Sparrow Hawk.
Zephyr runs on the Cortex-R52 core of R-Car V4H. U-Boot loads zephyr.bin to the memory and starts the core.

## Software Version List

|Software                   |Version|
|---------------------------|-------|
|Zephyr                     |v4.4.0 |

## How to Build

{%- capture build_md -%}
<!-- variant 0 -->
This guide covers Ubuntu version 24.04 LTS and later.

1. Build script(build-zephyr.sh)
   ```bash
   #!/usr/bin/env bash
   set -e

   echo "=== Updating and upgrading system packages ==="
   sudo apt update
   sudo apt -y upgrade

   echo "=== Installing dependencies ==="
   sudo apt -y install --no-install-recommends \
       git \
       cmake \
       ninja-build \
       gperf \
       ccache \
       dfu-util \
       device-tree-compiler \
       wget \
       python3-dev \
       python3-venv \
       python3-tk \
       xz-utils \
       file \
       make \
       gcc \
       gcc-multilib \
       g++-multilib \
       libsdl2-dev \
       libmagic1

   echo "=== Setting up Zephyr workspace ==="
   mkdir -p ~/work/zephyr
   cd ~/work/zephyr

   echo "=== Creating Python virtual environment ==="
   python3 -m venv .venv

   echo "=== Activating Python virtual environment ==="
   source .venv/bin/activate

   echo "=== Installing west tool ==="
   pip install --upgrade pip
   pip install west

   echo "=== Fetching Zephyr source (v4.4.0) ==="
   mkdir -p zephyrproject
   git clone --depth=1 --branch v4.4.0 https://github.com/zephyrproject-rtos/zephyr zephyrproject/zephyr
   west init -l zephyrproject/zephyr

   cd zephyrproject
   # Fetch only the modules required for this board (cmsis*, Cortex-R headers)
   west config manifest.project-filter -- -.*,+cmsis.*
   west update --narrow -o=--depth=1
   west zephyr-export
   west packages pip --install

   echo "=== Installing Python dependencies ==="
   pip install -r zephyr/scripts/requirements.txt

   echo "=== Installing Zephyr SDK ==="
   west sdk install -t arm-zephyr-eabi

   echo "=== Building sample application ==="
   cd zephyr

   west build -b sparrowhawk_rcar_v4h/r8a779g0/r52 samples/hello_world -p always

   echo "=== Setup and build completed successfully ==="
   ```
2. Execute the following command
   ```bash
   chmod +x build-zephyr.sh
   ./build-zephyr.sh
   ```
   {: data-filename="Host PC"}
   * The zephyr.bin will be generated under ~/work/zephyr/zephyrproject/zephyr/build/zephyr/zephyr.bin.

---

<!-- variant 1 -->
This guide covers Windows 11.

1. Build script(build-zephyr.ps1)
   ```powershell
   echo "=== Install dependencies ==="
   winget install --scope user Kitware.CMake
   winget install `
     Ninja-build.Ninja `
     oss-winget.gperf `
     Python.Python.3.12 `
     Git.Git `
     oss-winget.dtc `
     wget `
     7zip.7zip

   echo "=== Reload PATH to use the installed tools ==="
   $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
   $env:Path += ";C:\Program Files\7-Zip"

   echo "=== Create a new virtual environment ==="
   mkdir -Force "$HOME\work\zephyr"
   cd "$HOME\work\zephyr"
   py -3.12 -m venv zephyrproject\.venv
   zephyrproject\.venv\Scripts\Activate.ps1
   pip install west

   echo "=== Get Zephyr and install Python dependencies ==="
   git clone --depth=1 --branch v4.4.0 https://github.com/zephyrproject-rtos/zephyr zephyrproject\zephyr
   west init -l zephyrproject\zephyr
   cd zephyrproject
   # Fetch only the modules required for this board (cmsis*, Cortex-R headers)
   west config manifest.project-filter -- '-.*,+cmsis.*'
   west update --narrow -o=--depth=1
   west zephyr-export

   echo "=== Install required Python packages ==="
   python -m pip install @((west packages pip) -split ' ')
   cd zephyr
   west sdk install -t arm-zephyr-eabi

   echo "=== Building sample application ==="
   west build -b sparrowhawk_rcar_v4h/r8a779g0/r52 samples/hello_world -p always

   echo "=== Setup and build completed successfully ==="
   ```
   * If prompted by Windows during the installation, enter administrator credentials if required, then click "Yes" to continue.
2. Execute the following command
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\build-zephyr.ps1
   ```
   {: data-filename="Host PC (PowerShell)"}
   * The zephyr.bin will be generated under $HOME\work\zephyr\zephyrproject\zephyr\build\zephyr\zephyr.bin
{%- endcapture -%}
{% include multi-tabs.html id="build-zephyr"
                           labels="Ubuntu User|Windows User"
                           contents=build_md %}

## Setup the console terminal

Connect a USB cable from your PC to the CN4 USB port. Two serial devices appear (two /dev/ttyUSBx on Linux, two COM ports on Windows).
Both devices are used during the boot process.
* Lower-numbered /dev/ttyUSBx or COM port (HSCIF0): U-Boot console. Use it to load zephyr.bin and to run it.
* Higher-numbered /dev/ttyUSBx or COM port (HSCIF1): Zephyr console. Zephyr outputs logs on it.

Use the following serial settings for both devices:
```plaintext
Speed: 921600
Data: 8 bits
Parity: None
Stop bits: 1
```

## How to Load zephyr.bin to Sparrow Hawk

Connect the terminal software to the lower-numbered /dev/ttyUSBx or COM port (HSCIF0), then power on the Sparrow Hawk board.
Press any key while "Hit any key to stop autoboot:" is displayed to enter the U-Boot shell, and execute the following commands.

{%- capture load_md -%}
<!-- variant 0 -->
```bash
setenv ipaddr <board.ip>
setenv serverip <tftp.server.ip>
tftp 0x40040000 zephyr.bin
```
{: data-filename="Sparrow Hawk (U-Boot console)"}

---

<!-- variant 1 -->
Copy zephyr.bin to the microSD card, which already has the Yocto/Debian (rootfs) written, and insert it into the Sparrow Hawk board.

```bash
sudo mount /dev/sdxX /mnt
sudo cp ~/work/zephyr/zephyrproject/zephyr/build/zephyr/zephyr.bin /mnt/
sudo umount /mnt
```
{: data-filename="Host PC"}

```bash
ext4load mmc 0 0x40040000 /zephyr.bin
```
{: data-filename="Sparrow Hawk (U-Boot console)"}

---

<!-- variant 2 -->
Copy zephyr.bin to a new microSD card, which has no Yocto/Debian (rootfs) written, and insert it into the Sparrow Hawk board.

```bash
sudo fdisk -l
sudo fdisk /dev/sdx
sudo mkfs.ext4 /dev/sdxX
sudo mount /dev/sdxX /mnt
sudo cp ~/work/zephyr/zephyrproject/zephyr/build/zephyr/zephyr.bin /mnt/
sudo umount /mnt
```
{: data-filename="Host PC"}

```bash
ext4load mmc 0 0x40040000 /zephyr.bin
```
{: data-filename="Sparrow Hawk (U-Boot console)"}

---

<!-- variant 3 -->
**This guide covers Tera Term version 5.0.**

Transfer zephyr.bin from a host PC over the serial console using Tera Term and XMODEM.

```bash
loadx 0x40040000
```
{: data-filename="Sparrow Hawk (U-Boot console)"}

```plaintext
File → Transfer → XMODEM → Send
Select zephyr.bin, enable the "1K" option, and start the transfer.
```
{: data-filename="Tera Term"}
{%- endcapture -%}
{% include multi-tabs.html id="load-zephyr"
                           labels="TFTP|microSD card (rootfs written)|microSD card (new card)|Tera Term (Serial Transfer)"
                           contents=load_md %}

## How to Run

```bash
rproc init
rproc load 0 0x40040000 ${filesize}
rproc start 0
```
{: data-filename="Sparrow Hawk (U-Boot console)"}

If the following output appears on the higher-numbered /dev/ttyUSBx or COM port (HSCIF1), the operation is successful.

```plaintext
*** Booting Zephyr OS build v4.4.0 ***
Hello World! sparrowhawk_rcar_v4h/r8a779g0/r52
```
{: data-filename="Sparrow Hawk (Zephyr console)"}

**Note:**
* **If no output is observed, check that the correct /dev/ttyUSBx or COM port is selected.**

