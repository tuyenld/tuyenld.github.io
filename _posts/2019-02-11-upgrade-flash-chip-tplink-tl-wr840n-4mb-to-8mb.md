---
title: Upgrade TP-Link gateway flash chip
excerpt: "How to upgrade flash chip on TPLink TL-WR840N v5."
aside: true
aside:
  toc: true
categories: [embedded]
tags: [TL-WR840N]
comments: true
---

Upgrade TP-Link flash chip on TP-Link from 4mb to 8mb

**Table of content**
* ToC
{:toc}
----

## 1. Pre-requirement
* New flash chip: I used Winbond 8MiB GD25Q64CSIG
* Soldering iron: desolder old flash chip and re-solder new flash chip
* ROM programer and IC socket: I am using CH-341A (~ 5$)
* One PC/Laptop

## 2. Let's do it
### 2.1 Desolder old flash chip
Hot air soldering station is ideally suited for desoldering flash. If you not, you can follow this video to do this.

{% include youtube.html content="nZGEtpECPQY" size="8" %}

### 2.2 Program new flash chip
Firstly, you need to choose new flash chip you want to replace. Why I chose `Winbond GD25Q64CSIG` for replacement, see table bellow:

<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=Original_vs_Mod_Chip.md"></script>

I see the name of flash chip is the same, so I didn't checked datasheet for compatible.


Secondly, you need to choose OpenWRT firmware.
Why I used openwrt-18.06.1-ramips-mt76x8-tl-**wr841n-v13**-squashfs-sysupgrade instead of openwrt-18.06.1-ramips-mt76x8-tl-**wr840n-v5**-squashfs-sysupgrade?


Because it used the same CPU and different in flash and RAM chip.
<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=WR841Nv13_vs_WR840Nv5.md"></script>


**Note!** You are able to use openwrt-18.06.1-ramips-mt76x8-tl-**wr840n-v5**-squashfs-sysupgrade with 8MB flash chip, your router still booting but you can not any configuration after reboot. You may got error `Your image is probably too big, leaving not enough space for jffs2`
{: .notice--warning}

In the first time, I faced this problem. I can not save any configuration after reboot. If you look at boot log, it read:
<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=firmware_bad.log"></script>

No `/overlay` will be mounted:
<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=firmware_bad_no_overlay.log"></script>

If everything is good, it should be like this:
<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=firmware_good.log"></script>

Now, you have new flash chip and suitable firware, but you can not use this firware to program new flash chip. Because **RAW** flash need more partion than firmware such as: bootloader and art. See more in [here](https://openwrt.org/docs/techref/flash.layout)

You can use bellow shell script to generate firmware for any flash with different capacity.
<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=create_new_firmware.sh"></script>

<script src="https://gist.github.com/tuyenld/acb0f0e62cadca73b7dffc44d7cc1b4b.js?file=flash_partition.md"></script>


If you don't want to use this script, you can create image by yourself. You may to need hex editor like [HxDen](https://mh-nexus.de/en/hxd/) to do this.
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-02-11-upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb/create_image_manual.jpg" alt="">
  <figcaption>New firmware layout</figcaption>
</figure>

All file which I used in [here](https://drive.google.com/file/d/1kqXvFQYrolipvrrD3Rkv7J7JTZwgVHDn/view?usp=sharing)
### 2.3 Re-solder new flash chip
After use CH341A to program new flash chip, you can re-solder new flash chip on target board.

**Note!** If your board can not booting, don't worry. You can use [Clip Socket Adapter](https://www.ebay.com/itm/SOIC8-SOP8-Flash-Chip-IC-Test-Clip-Socket-Adapter-BIOS-CH341A-USB-Programmer-/372555847443) to try program flash again with out desolder chip.
{: .notice--warning}
## 3. Enjoy
<figure class="align-center">
  <img src="{{ site.cloudinaryurl }}2019-02-11-upgrade-flash-chip-tplink-tl-wr840n-4mb-to-8mb/software_status.jpg" alt="">
  <figcaption>Software with new flash chip (8MB).</figcaption>
</figure>

**Note!** I used image come from **TL-WR841N v13.x**, except for LED will not working, everything work well (Wi-Fi, Ethernet, Router feature).
{: .notice--warning}
