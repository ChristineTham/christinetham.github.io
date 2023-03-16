---
draft: false
title: Home Network
description: A new year to usher in a reconfiguration of our home network
author: Chris Tham
publishDate: 2023-01-30T00:00:00.000Z
categories:
  - Create
  - Software
tags:
  - plantuml
  - home
  - infrastructure
---

I've finally decided to reconfigure our home network to use purely Telstra
Smart Modems (Gen 2) as the backbone and wi fi infrastructure.

## Commands to configure modems

This assumes the modem has root access enabled as per
[Hacking Technicolor Gateways](https://hack-technicolor.readthedocs.io/en/stable/).

I have 4 Telstra Smart Modems (Gen 2) - model DJA0231 made by Technicolor. These
can easily be hacked to provide root access using
[tch-exploit](https://github.com/BoLaMN/tch-exploit)

The specs are:

| Category   | Specification               |
| ---------- | --------------------------- |
| Wi-Fi      | 802.11ac                    |
|            | Dual Band Concurrent Wi-Fi  |
|            | 4x4 2.4ghz, 4x4 5ghz        |
| LTE-Backup | Yes – Voice & Data          |
| Voice      | 2x FXS ports                |
| Capability | Bandsteering                |
|            | Automatic Channel Selection |
|            | WPS                         |
|            | Wi-Fi Dr enabled            |
| Ports      | 1 x USB 2.0                 |
|            | 1 x Gigabit WAN             |
|            | 4 x Gigabit LAN             |
| Security   | WPA3                        |
| Mesh       | EasyMesh                    |

I used [tch-gui-unhide](https://github.com/seud0nym/tch-gui-unhide) to unlock
the GUI to access additional features and to configure
1 modem as the main router and the additional 3 modems as Wi Fi Booster devices
using Ethernet as the backhaul.

For the main router:

```sh
wget http://fwstore.bdms.telstra.net/Technicolor_vcnt-a_20.3.c.0389-MR20-RA/vcnt-a_20.3.c.0389-MR20-RA.rbi
././safe-firmware-upgrade -b -c -d -e vcnt-a_20.3.c.0389-MR20-RA.rbi
./reset-to-factory-defaults-with-root -b -c -d -e
./de-telstra -kl -km -kn -kq -ks -kx -d christham.net -my -o (for the router)
passwd
./tch-gui-unhide
opkg update
opkg install snmpd
```

For the boosters:

```sh
wget http://fwstore.bdms.telstra.net/Technicolor_vcnt-a_20.3.c.0389-MR20-RA/vcnt-a_20.3.c.0389-MR20-RA.rbi
././safe-firmware-upgrade -b -c -d -e -I 192.168.0.x vcnt-a_20.3.c.0389-MR20-RA.rbi
./reset-to-factory-defaults-with-root -b -c -d -e -I 192.168.0.x
./de-telstra -S -M -G -ma
passwd
./tch-gui-unhide -hs -y
./bridged-booster -i 192.168.0.x -6
opkg update
opkg install snmpd
```

## Network Diagrams

```plantuml
@startuml

!include <office/Devices/ip_gateway>
!include <office/Devices/router>
!include <office/Devices/switch>

nwdiag {
  title Core Infrastructure

  Internet [ shape = cloud];
  Internet -- modem;

  network NBN {
    router;
    modem [description = "<$ip_gateway>\nmodem"];
  }

  network HOME {
    address = "192.168.0.x/8";
    router [address = ".1"];
    wifi2 [address = ".2"];
    wifi3 [address = ".3"];
    wifi4 [address = ".4"];
    hue [address = ".5"];
    eve [address = ".6"];
    aircon [address = ".8"];
    switch [address = ".9"];
  }

  group {
    description = "Backbone";
    router [description="<$router>\nrouter\nDJA0231\nAttic"];
    wifi2 [description="<$router>\nwifi2\nDJA0231\nBedroom"];
    wifi3 [description="<$router>\nwifi3\nDJA0231\nKitchen"];
    wifi4 [description="<$router>\nwifi4\nDJA0231\nLiving Room"];
  }

  group {
    description = "Smart Home";
    hue [description="<$ip_gateway>\nhue\nHue Bridge"];
    eve [description="<$ip_gateway>\neve\nEve Extend"];
    aircon [description="<$ip_gateway>\naircon\nDaikin Airbase"];
    switch [description="<$switch>\nswitch\nNetgear GS716T"];
  }
}
@enduml
```

```plantuml
@startuml

!include <office/Devices/device_printer>
!include <office/Devices/device_fax>
!include <office/Servers/file_server>

nwdiag {
  title Common Services

  network HOME {
    address = "192.168.0.x/8";
    nas1 [address = ".241"];
    nas2 [address = ".241"];
    wdmcm [address = ".244"];
    backup [address = ".254"];
    printer [address = ".252"];
    scanner [address = ".247"];
  }

  group {
    description = "Storage";
    nas1 [description="<$file_server>\nnas1\nQNAP TS-569L"];
    nas2 [description="<$file_server>\nnas2\nQNAP TS-431P"];
    wdmcm [description="<$file_server>\nwdmcm\nWD MyCloud Mirror"];
    backup [description="<$file_server>\nbackup\nSynology DS918+"];
  }

  group {
    description = "Peripherals";
    printer [description="<$device_printer>\nprinter\nEpson WT-7750"];
    scanner [description="<$device_fax>\nscanner\nEpson DS-570"];
  }
}
@enduml
```

```plantuml
@startuml

!include <office/Devices/video_camera>
!include <office/Communications/conference_announcement_service>

nwdiag {
  title Home Security

  network HOME {
    address = "192.168.0.x/8";
    entrance;
    frontdoor;
    chime;
    backdoor;
    backyard;
    garage;
    living;
    kitchen;
  }

  group {
    description = "Ring Cameras";
    entrance [description="<$video_camera>\nentrance\nRing Spotlight Cam"];
    frontdoor [description="<$video_camera>\nfrontdoor\nRing Video Doorbell 2"];
    chime [description="<$conference_announcement_service>\nchime\nRing Chime"];
    backdoor [description="<$video_camera>\nbackdoor\nRing Video Doorbell 2"];
    backyard [description="<$video_camera>\nbackyard\nRing Spotlight Cam"];
    garage [description="<$video_camera>\ngarage\nRing Spotlight Cam"];
  }

  group {
    description = "HomeKit Cameras";
    living [description="<$video_camera>\nliving\nD-Link Omna"];
    kitchen [description="<$video_camera>\nkitchen\nD-Link Omna"];
  }
}
@enduml
```
