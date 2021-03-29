---
layout: post
title: Linux configurations
categories:
- linux
comments: true
---

**Table of content**
* ToC
{:toc}
----

# Basic tools
##	Configure TFTP Server

```bash
sudo apt-get install xinetd tftpd tftp -y

ls -la /usr/sbin/ | grep tftp
-rwxr-xr-x  1 root root   14284 Dec 16  2010 in.tftpd

sudo vi /etc/xinetd.d/tftpd

# description: The tftp server serves files using the trivial file transfer \
# protocol. The tftp protocol is often used to boot diskless \
# workstations, download configuration files to network-aware printers, \
# and to start the installation process for some operating systems.

service tftp
{
	socket_type = dgram
	protocol = udp
	wait = yes
	user = root
	server = /usr/sbin/in.tftpd
	server_args = -c -v -s /tftpboot
	disable = no
	per_source = 11
	cps = 100 2
	flags = IPv4
}


# Ubuntu 14.04
sudo vi  /etc/inetd.conf
# comment out: tftp           dgram   udp     wait    nobody  /usr/sbin/tcpd  /usr/sbin/in.tftpd /srv/tftp

sudo service xinetd restart

sudo netstat -taplun | grep 69
udp        0      0 0.0.0.0:45369           0.0.0.0:*                           764/avahi-daemon: r
udp        0      0 0.0.0.0:69              0.0.0.0:*                           3764/xinetd  

sudo mkdir /tftpboot
sudo chmod 777 /tftpboot/
```

## Syslog-ng, syslog
```bash
$ sudo apt-get install syslog-ng

$ sudo vi /etc/syslog-ng/conf.d/ldtuyen.conf

# https://blog.webernetz.net/basic-syslog-ng-installation/
# --------------------------------------------------
options {
        create_dirs(yes);
        owner(ldtuyen);
        group(ldtuyen);
        perm(0644);
        dir_owner(ldtuyen);
        dir_group(ldtuyen);
        dir_perm(0755);
};
# --------------------------------------------------
source s_udp {
        network (
                ip-protocol(6)
                transport("udp")
                port(514)
        );
        network (
                transport("udp")
                port(514)
        );
};
# --------------------------------------------------
destination d_host-specific {
        file("/var/log/ldtuyen_log/$HOST/$YEAR/$MONTH/$HOST-$YEAR-$MONTH-$DAY.log");
};
log {
        source(s_udp);
        destination(d_host-specific);
};

$ sudo service syslog-ng restart
$ sudo netstat -taplun | grep sys
$ sudo service syslog-ng status
$ sudo service syslog-ng restart
$ cat syslog | tail
$ tail -F ldtuyen_log/172.16.10.10/2020/01/172.16.10.10-2020-01-09.log

```
## Configure telnet server (telnetd)

```bash
$ sudo apt-get install xinetd telnetd

$ sudo vi /etc/xinetd.d/telnetd
service telnet
{
        disable         = no
        socket_type     = stream
        server          = /usr/sbin/in.telnetd
        protocol        = tcp
        wait            = no
        user            = root
        flags           = IPv6
}

$ sudo service xinetd restart
$ sudo netstat -taplun | grep 23
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2233/nginx -g daemo
tcp        0      0 0.0.0.0:23              0.0.0.0:*               LISTEN      19755/xinetd

$ cat /var/log/syslog | grep xinetd

```

##	Configure samba

```bash
$ sudo apt-get install samba
# (ldtuyen: username is below)
$ sudo  smbpasswd -a ldtuyen				

$ sudo vi /etc/samba/smb.conf

[ldtuyen]
path = /home/ldtuyen
available = yes
valid users = ldtuyen
read only = no
browsable = yes
public = yes
writable = yes


$ sudo /etc/init.d/smbd restart

# In window, 192.168.1.2 is samba machine IP address
Map network Drive >> Folder: \\192.168.1.12\ldtuyen

# If you change Window password 
# => You need to update sambe user password
$ sudo smbpasswd -a ldtuyen
```

##	Changing colors for user, host, directory information in terminal

```bash
# https://askubuntu.com/a/123306/613914

nano ~/.bashrc
#force_color_prompt=yes		>> 		force_color_prompt=yes
PS1='${debian_chroot:+($debian_chroot)}\[\033[01;35m\]\u\[\033[01;30m\]@\[\033[01;32m\]\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
```

## Ping show timeout
```bash
ping6 -D -O google.com

# [1566958425.967709] 64 bytes from 2404::8b: icmp_seq=23 ttl=49 time=84.6 ms
# [1566958427.820728] no answer yet for icmp_seq=24
# [1566958427.993347] 64 bytes from 2404::8b: icmp_seq=25 ttl=49 time=81.9 ms
```

## Firewall ufw
```bash
# https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-16-04
sudo ufw status verbose
sudo ufw enable

sudo ufw allow ssh
sudo ufw allow samba
```
## Show all process 

```bash
ps aux | grep sh

# Long line output, no wrap
ps auxww | grep dhcp
```

##	Install Open SSH

```bash
sudo apt-get install openssh-server

sudo systemctl status ssh
sudo systemctl enable ssh
```

## DNS 

- Change DNS server Ubuntu 14.04

```bash
# >> Persistent
$ sudo nano /etc/network/interfaces
#Below iface eth0 inet static add the following line:
dns-nameservers 10.10.10.12 8.8.8.8	#This will use Google's DNS servers.

# Note: as chaos says, you can also edit /etc/resolv.conf 
# but these changes will be overwritten on reobot.
# >> Temprary
$ vi /etc/resolv.conf

# Restart your network
$ sudo /etc/init.d/networking restart		
```
- Show DNS server after Reboot

```bash
nmcli device show <interfacename> | grep IP4.DNS	# Ubuntu >= 15
nmcli dev list iface <interfacename> | grep IP4		# Ubuntu <= 14
```

- Assign DNS record

```bash
$ sudo vi /etc/hosts 

127.0.1.1       mypc
10.10.10.94     example.com
$ sudo service network-manager restart
# OR 	
$ sudo service networking restart
```

- nslookup

```bash
ldtuyen@pc:~$ apt-cache search nslookup
dnsutils - Clients provided with BIND
knot-dnsutils - Clients provided with Knot DNS (kdig, knslookup, knsupdate)
libbot-basicbot-pluggable-perl - extended simple IRC bot for pluggable modules
libnet-nslookup-perl - simple DNS lookup module for perl
ldtuyen@pc:~$ 
ldtuyen@pc:~$ 
ldtuyen@pc:~$ sudo apt-get install dnsutils
```

## Disable auto sleep 16.04

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

## Good calculator

```bash
Qalculate
```
## Change Timezone time/date

```bash
# Change time/date setting to USA
sudo timedatectl set-timezone America/New_York
sudo localectl set-locale LC_TIME=en_US.utf8
sudo reboot

date +%F_%H-%M-%S
```


## Find, grep, search

```bash
# >> find

# Find file have changed in 10 minute
find /path/to/dir -mmin -10

find . -name \*.xls -exec cp {} newDir \;

# Smaller than 4G
find . -type f -size +3c -exec cp {} newDir \;
# c for bytes
# w for two-byte words
# k for Kilobytes
# M for Megabytes
# G for Gigabytes

# Ignore case sensitive
find -iname "keyword"

# >> ag

ag "stdint\.h" *
ag -G '\.java$' 'ftp' .
ag -G '\.h$' 'lnode' .

# >> grep

# Use grep --exclude/--include syntax to not grep through certain files
# -r, --recursive
# -n, --line-number 

grep someStrangeVariable -rn "stdint\.h"
grep "req->pobj->get<const char" -rn --include=\*Wrt.cpp
grep someStrangeVariable -rn --exclude=\*.{js,html}

# extract the text between, let's say, bbb and ddd.
sed 's/^.*bbb //; s/ddd.*$//' <<< "aaa bbb ccc ddd eee" 

```

## View CSV Data from the Command Line
```bash
cat file.csv | sed -e 's/,,/, ,/g' | column -s, -t | less -#5 -N -S
```

## Direct output to file

[How do I save terminal output to a file?](https://askubuntu.com/questions/420981/how-do-i-save-terminal-output-to-a-file)
```
          || visible in terminal ||   visible in file   || existing
  Syntax  ||  StdOut  |  StdErr  ||  StdOut  |  StdErr  ||   file   
==========++==========+==========++==========+==========++===========
    >     ||    no    |   yes    ||   yes    |    no    || overwrite
    >>    ||    no    |   yes    ||   yes    |    no    ||  append
          ||          |          ||          |          ||
   2>     ||   yes    |    no    ||    no    |   yes    || overwrite
   2>>    ||   yes    |    no    ||    no    |   yes    ||  append
          ||          |          ||          |          ||
   &>     ||    no    |    no    ||   yes    |   yes    || overwrite
   &>>    ||    no    |    no    ||   yes    |   yes    ||  append
          ||          |          ||          |          ||
 | tee    ||   yes    |   yes    ||   yes    |    no    || overwrite
 | tee -a ||   yes    |   yes    ||   yes    |    no    ||  append
          ||          |          ||          |          ||
 n.e. (*) ||   yes    |   yes    ||    no    |   yes    || overwrite
 n.e. (*) ||   yes    |   yes    ||    no    |   yes    ||  append
          ||          |          ||          |          ||
|& tee    ||   yes    |   yes    ||   yes    |   yes    || overwrite
|& tee -a ||   yes    |   yes    ||   yes    |   yes    ||  append


E.g: 
	command > output.txt
	command &> output.txt &
```

## What do the fields in ls -al output mean
```
-rwxrw-r--    10    root   root 2048    Jan 13 07:11 afile.exe
?UUUGGGOOOS   00  UUUUUU GGGGGG ####    ^-- date stamp and file name are obvious ;-)
^ ^  ^  ^ ^    ^      ^      ^    ^
| |  |  | |    |      |      |    \--- File Size
| |  |  | |    |      |      \-------- Group Name (for example, Users, Administrators, etc)
| |  |  | |    |      \--------------- Owner Acct
| |  |  | |    \---------------------- Link count (what constitutes a "link" here varies)
| |  |  | \--------------------------- Alternative Access (blank means none defined, anything else varies)
| \--\--\----------------------------- Read, Write and Special access modes for [U]ser, [G]roup, and [O]thers (everyone else)
\------------------------------------- File type flag
```

## User, group
```bash
# Adding/Remove a user to a group:
sudo adduser user group
sudo deluser user group
groups USERNAME 	# To show groups with spec user
groups 				# show all groups

# list all users with their UID
awk -F: '/\/home/ {printf "%s:%s\n",$1,$3}' /etc/passwd

# Add user with specific user ID
sudo useradd sambausr -u 1003 		
# Add user without user ID
sudo adduser ldtuyen

sudo usermod -aG sudo ldtuyen

# Create default home directory for existing user in terminal						
sudo mkhomedir_helper username 						
```

## Vim
```bash
$ vi ~/.bashrc
export TERM=xterm-256color

$ vim ~/.vimrc

if $TERM == "xterm-256color"
  set t_Co=256
endif

if has('gui_running')
	set background=light
else
	set background=dark
endif
```
## Grub
```bash
$ grep menuentry /boot/grub/grub.cfg
$ sudo vi /etc/default/grub

# Start from 0
GRUB_DEFAULT=3 
GRUB_TIMEOUT=3 

$ sudo update-grub
```

## IP
```bash
# Assign static IP for Ubuntu 14, 16
$ sudo vim /etc/network/interfaces

iface eno1 inet static
        address 172.16.10.113
        netmask 255.255.255.0
        gateway 172.16.10.1
        dns-nameservers 8.8.8.8
        up ip route add 10.10.1.0/24 via 172.16.10.1
        up ip -6 addr add 2001::2/64 dev eno1

```

## nginx
```bash
nginx -t -c /etc/nginx/nginx.conf
sudo tail -n 20 /var/log/nginx/error.log
systemctl status nginx.service
systemctl restart nginx.service
```

## Enable IP forwarding between interfaces

```bash

# Enable IP Forwarding on the fly
#---------------------------------------
sysctl -w net.ipv4.ip_forward=1
# OR
echo 1 > /proc/sys/net/ipv4/ip_forward


# Permanent setting using /etc/sysctl.conf
#---------------------------------------
cat /etc/sysctl.conf
[...]
net.ipv4.ip_forward = 1
```

## KVM
- Install

```bash
sudo apt-get install qemu-kvm libvirt-bin bridge-utils virt-manager -y
sudo adduser ldtuyen libvirtd
sudo virsh -c qemu:///system list
reboot
```

- Enable remote desktop via SSH

```bash
# Window > Install Xming from: http://sourceforge.net/projects/xming.
# Enable Remote/X11 forwarding

# SecureCRT: Session Option > Port Forwarding > Remote/X11 
# Checked Forwarded X11 Packet and Enfore X11 Authen

sed -i 's/X11Forwarding no/X11Forwarding yes/' /etc/ssh/sshd_config 
service sshd restart

virt-manager
```

- List all KVM

```bash
$ virsh list --all

$ virsh start ubuntu16.04
Domain ubuntu16.04 started
```
- Clone a machine

```bash
sudo virt-clone --original ubuntu-box1 --auto-clone
```

- Correct way to move kvm vm

```bash
# copy the VM's disks to the same dir on dest host
cd /var/lib/libvirt/images
# copy this xml to the dest host
virsh dumpxml win7 > win7.xml
# copy xml file and import configuration on the dest host
virsh define win7.xml

# If the disk location differs, you need to edit the xml's devices/disk node 
# to point to the image on the destination host

# If the VM is attached to custom defined networks, 
# you'll need to either edit them out of the xml on the destination host 
# or redefine them as well 
virsh net-dumpxml > netxml.xml 
virsh net-define netxml.xml 
virsh net-start NETNAME 
virsh net-autostart NETNAME
```

- Share network on kvm

- br0 work as a swith
- eno1 is only physical port
- any machine which use br0 network will see eno1

```
  +---------+    +---------+
  |  VM1    |    |   VM2   |
  |         |    |         |
  |         |    |         |
  +----+----+    +---+-----+
       |             |
+----------------------------------------+
|      |             |                   |
|      |             |       Host machine|
|      |             |                   |
|   +--+-------------+----------+        |
|   |br0 (switch)               |        |
|   +---------------------------+        |
|                        |---|           |
+----------------------------------------+
                           |
                           |eno1
                           |
                           +
```

```bash
# >> On boot
/etc/network/interfaces
auto br0
iface br0 inet static
      address 172.16.10.2
      netmask 255.255.255.0
      network 172.16.10.0
      broadcast 172.16.10.255
      gateway 192.168.1.1
      bridge_ports eno1
      bridge_stp on
      bridge_maxwait 0
      up ip route add 10.0.0.0/24 via 172.16.10.5
      up ip route add 10.10.10.0/24 via 172.16.10.25
iface br0 inet6 static
        address 3001::20
        netmask 64
        gateway fe80::1
        autoconf 0

# >> Manually

# https://help.ubuntu.com/community/NetworkConnectionBridge
ifconfig enx00e04c68014a
# enx00e04c68014a Link encap:Ethernet  HWaddr 00:e0:4c:ff:ff:ff  
#           inet addr:192.168.0.17  Bcast:192.168.0.255  Mask:255.255.255.0
#           inet6 addr: fe80::e782:ffff:ffff:ffff/64 Scope:Link

ip addr flush dev enx00e04c68014a
ip addr flush dev <interface 2>
sudo brctl addbr br0
sudo brctl addif br0 enx00e04c68014a <interface 2>
sudo ip link set dev br0 up

sudo dhclient br0 -v
```

## Fast copy, copy certain file extension, file size, capacity
```bash
tar c sourceDirectory | pv | tar x -C destinationDirectory
tar cf - sourceDirectory | pv | (cd backup; tar xvf -)
```

## SNMP
```bash
wget -c https://sourceforge.net/projects/net-snmp/files/net-snmp/5.7.3/net-snmp-5.7.3.zip/download
mv download net-snmp-5.7.3.zip
unzip net-snmp-5.7.3.zip 
cd net-snmp-5.7.3/
./configure
sudo apt-get install libperl-dev
make
sudo  make install
cd perl/
perl Makefile.PL
make
mib2c --help
mib2c -c mib2c.scalar.conf bfcMgmt
mkdir ~/test
cd ~/test/
export LD_LIBRARY_PATH=/usr/local/lib:/usr/lib
mib2c -c mib2c.scalar.conf myScalar
```

```bash
sudo apt-get install libperl-dev -y

wget -c https://nchc.dl.sourceforge.net/project/net-snmp/net-snmp/5.8/net-snmp-5.8.tar.gz
tar -xzvf net-snmp-5.8.tar.gz 
cd net-snmp-5.8/
./configure
make
sudo  make install

# May be not need
sudo ln -s /usr/local/lib/libnetsnmp.so.35 /usr/lib/libnetsnmp.so.35

snmpget -v

cd perl/
perl Makefile.PL
make    | sudo make
mib2c --help
```
```bash
snmptranslate  -M "/test/snmp/all" -m ALL -Ir 1.3.6.1.4.1.2.0 
snmptranslate   -m ALL -Ir 1.3.6.1.4.1.1.2.0 

export MIBDIRS=/test/snmp/all
export MIBS=ALL

mib2c -c mib2c.scalar.conf telnetUserName

snmptranslate .1.3.6.1.4.1.4002.1.7.5.6.0
snmptranslate -Ir 1.3.6.1.4.1.2.2.2.1.1.1.2.0  
```


## Java, JRE, JDK
```bash
sudo add-apt-repository ppa:openjdk-r/ppa \
&& sudo apt-get update -q \
&& sudo apt install -y openjdk-11-jdk
```
## Remove PPA (Linux repo list)

[How can PPAs be removed?](https://askubuntu.com/a/173209)

Alternately, as ppas are stored in /etc/apt/sources.list.d you can find the one you want to remove by entering:

```bash
ls /etc/apt/sources.list.d
```
Then when you have noted the name of that offending ppa (e.g. myppa.list), you can enter:

```bash
sudo rm -i /etc/apt/sources.list.d/myppa.list

# For example:
sudo rm -i /etc/apt/sources.list.d/inkscape_dev-ubuntu-stable-hirsute.list
```

## screen GNU

```bash
# >> sending text input to a detached screen
# https://unix.stackexchange.com/a/13961/265821

# /scripts/sync_code.sh
screen -S sync_code -p 0 -X stuff "scripts/sync_code.sh & ^M"

```

## Rename

```bash
# Rename all *.txt to *.text
for f in *.php; do 
    mv -- "$f" "${f%.txt}.html"

done

# Rename old string to new string
for f in *; do mv "$f" "${f//old_string/new_string}"; done

```

## curl
```bash
# https://www.keycdn.com/support/popular-curl-examples
curl --request DELETE https://yourwebsite.com/
curl --request DEBUG http://192.168.0.1
curl --request POST https://yourwebsite.com/

# 5) Generating Additional Information
curl -H "X-Header: Value" https://www.keycdn.com/ -v 
```

## tcpdump
```bash
tcpdump -i wanbridge -vvvv -s 0 '(port 547 or port 546)' -e
tcpdump -i em0 -vvvv -s 0 '(port 547 or port 546)' -e

# • unreachable: 1
# • too-big: 2
# • time-exceeded: 3
# • echo-request: 128
# • echo-reply: 129
# • router-solicitation: 133
# • router-advertisement: 134
# • neighbor-solicitation: 135
# • neighbor-advertisement: 136
tcpdump -i wanbridge -vvvv -s 0 "icmp6 && ip6[40] == 134" -e

tcpdump -i gif0 -vvvv -s 0 "icmp6 && ip6 host 2001::fe" -e

# filter vlan 100
sudo tcpdump -i br0 -n -e '(vlan 100)'

## Show full packet
tcpdump -i wanbridge -en icmp -vv

```

## coredump

```bash

$ cat /proc/sys/kernel/core_pattern
core
# >> The core dump is written in the current directory of the process 
# >> at the time of the crash.

# to enable core dumps
ulimit -c unlimited 

# where $pid is the process ID of the process. 
# That link will point to the current working directory of that process.
ls -l /proc/186/cwd 


```

## python
```bash
# find python package command installed by pip
$ python3  -m site --user-base
/home/ldtuyen/.local

/home/ldtuyen/.local/bin/cld --help
```
## regx
```py
# Find string between two string
# https://regexr.com/397dr
# href="/uploads/file/PDF Week 1 Day 1a.pdf" align
patent = 'uploads(.*?)\"'
```

## Resize image keep ratio

```bash
# https://askubuntu.com/a/135489
# 1654x is width pixel
convert '*.png[1654x]' resized%03d.png
```

## image to pdf
```bash
# Reduce quality if the output file is too big
convert "*.{png,jpeg}" -quality 100 outfile.pdf

# Keep same image size
# https://unix.stackexchange.com/a/74976
convert "resized*.{png}" -quality 100 -units PixelsPerInch -density 150x150 multipage.pdf

# Fix error: convert-im6.q16: attempt to perform an operation not allowed by the security policy `PDF' @ error/constitute.c/IsCoderAuthorized/408.
sudo vi /etc/ImageMagick-6/policy.xml

  <policy domain="coder" rights="read | write" pattern="PDF" />
</policymap>

```

## Remove pdf secure (password)

https://superuser.com/a/584710

Assuming it's simply a 'rights' (owner) password that restricts things like editing, printing, and copying (i.e. the password does not need to be entered to open the file) the following will remove the restrictions:

1. Grab https://github.com/qpdf/qpdf/releases
1. Unzip/Install and navigate to the bin folder that holds qpdf.exe (or similar for your platform)
1. Place the PDF you wish to work on in the same folder
1. Run: `qpdf --decrypt InputFile.pdf OutputFile.pdf` (use "s if the file name has spaces).
1. Do what you like with the OutputFile.

If your PDF file is user password protected, change step 4 to `qpdf --decrypt --password=yourpassword InputFile OutputFile`

## Shrinkpdf: shrink PDF files with Ghostscript (reduce pdf size)

[How can I reduce the file size of a scanned PDF file?](https://askubuntu.com/a/113547)

> No.1

```bash
http://www.alfredklomp.com/programming/shrinkpdf/

# 150 dpi
./shrinkpdf.sh file.pdf out.pdf 150
# 120 dpi
./shrinkpdf.sh file.pdf out.pdf 120

```
> No.2

34.44″
38.74″

```bash
    I use LibreOffice Draw to open the pdf.
    I then "export as pdf"
    And set "jpeg compression quality" to 10% and "image resolution" to 150 dpi

    High-school-transcript-Tuyen-Le.pdf from 36 MB to 2.6 MB
```

## How to resize page to fit drawing contents in Open office/Libre Office Draw


1. Press `Ctrl-A` to select everything.
2. Under `Format>Position and Size` you can see the exact size of the selection. It's helpful to copy the value of Width and Height to an editor (or a piece of paper). Click Cancel.
3. Open `Format>Page`: Set Width and Height according to the size of the selection. Set all Margins to zero. Click OK.
4. Open `Format>Position and Size` again: Set both Position X an Position Y to zero. 
5. Click OK.


## Edit pdf on Linux

```bash

Libre Office 7.1 (Draw) > Open > PDF File
You also need to show panel: View > Page Pane

cd DEBS/
sudo dpkg -i *.deb

```
## extract-img-from-pdf

```python
# python3 extract-img-from-pdf.py
import fitz
doc = fitz.open("file.pdf")
for i in range(len(doc)):
    for img in doc.getPageImageList(i):
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n < 5:       # this is GRAY or RGB
            pix.writePNG("p%s-%s.png" % (i, xref))
        else:               # CMYK: convert to RGB first
            pix1 = fitz.Pixmap(fitz.csRGB, pix)
            pix1.writePNG("p%s-%s.png" % (i, xref))
            pix1 = None
        pix = None
```
## Merge / convert multiple PDF files into one PDF

```bash
# https://stackoverflow.com/a/19358402
gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=merged.pdf mine1.pdf mine2.pdf

# size(output) = size(file1) + size(file2)
pdftk file1.pdf file2.pdf cat output output.pdf
```

## Make a sound once process is complete
```bash
make; spd-say done
```

## Migrate from Sublime Text to VS Code

### Key binding
[See more](https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-shortcuts-reference)

| vscode                              | sublime-text  | decs                   |
| ----------------------------------- | ------------- | ---------------------- |
| ctrl+shift+o > ctrl+r               | ctrl+r        | Heading, function list |
| ctrl+shift+i (linux, window_synced) |               | Table formater         |
| ctrl+p                              | ctrl+p        | Go to file             |
| alt+up                              | ctrl+shift+up | Move line up           |

## iptable
```bash
# https://backreference.org/2010/06/11/iptables-debugging/

iptables -t raw -S -v  | grep helper
iptables -t filter -S -v | grep helper
iptables -t nat -S -v   | grep helper

iptables -t raw  -L --line-numbers
iptables -t filter -L INPUT -v --line-numbers

# see number of package going chain
iptables -t nat -nvL

## debug out going package
ip6tables -t raw -A PREROUTING -p ipv6-icmp -d 2001:db8:1111:1111::3 -j TRACE
## debug in comming package
ip6tables -t raw -A PREROUTING -p ipv6-icmp -d 2001:db8:0:22:22:22:22:22 -j TRACE

# debug in/out package
iptables -t raw -A PREROUTING -p gre -j TRACE
iptables -t raw -A PREROUTING  -p udp -m multiport --dports 67,68 -j TRACE
```

## nmap
```bash
# scan service on port 22
$ nmap -A 172.16.10.25 -p22
# search all port
$ nmap -p- 172.16.10.25        
# scan service version on port 80
$ nmap -sV 172.16.10.25 -p80 
```

----

## NPM

```bash
# https://github.com/nodesource/distributions
# install Node.js v10.x:
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs

#clean slate install.
rm -rf node_modules
npm cache clean 
npm install node-sass


```

## Find USB version is using on some port

```markdown
# Method 1
sudo apt-get install  lshw
sudo lshw

    USB 2.0 will use the ehci_hcd module
    USB 1.x will use either ohci_hcd or uhci_hcd modules.


*-usb:0
description: Video
product: Show-me-webcam Pi Webcam
vendor: Show-me-webcam Project
physical id: 3
bus info: usb@1:1.3
version: 1.00
serial: 100000000d2386db
**capabilities: usb-2.00**
configuration: **driver=cdc_acm** maxpower=500mA speed=480Mbit/s
*-usb:1
description: Generic USB device
product: USB-Serial Controller
vendor: Prolific Technology Inc.
physical id: 4
bus info: usb@1:1.4
version: 3.00
**capabilities: usb-1.10**
configuration: driver=pl2303 maxpower=100mA speed=12Mbit/s

## Method 2
$ sudo dmesg | grep usb
[ 2478.011868] usb 1-1.3: device descriptor read/64, error -71
[ 2484.103738] usb 1-1.3: device descriptor read/64, error -71
[ 2484.291754] usb 1-1.3: new high-speed USB device number 6 using ehci-pci
[ 2484.409365] usb 1-1.3: New USB device found, idVendor=1d6b, idProduct=0104, bcdDevice= 1.00
[ 2484.409370] usb 1-1.3: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 2484.409373] usb 1-1.3: Product: Show-me-webcam Pi Webcam
[ 2484.409375] usb 1-1.3: Manufacturer: Show-me-webcam Project
[ 2484.409378] usb 1-1.3: SerialNumber: 100000000d2386db

cat /sys/bus/usb/devices/1-1.3/version
    2.00
```



# System init

Many init systems have been released, but the three init systems below are widely used in Linux ([source](https://www.2daygeek.com/sysvinit-vs-systemd-cheatsheet-systemctl-command-usage/))

- **`System V (Sys V):`** System V (Sys V) is one of the first and traditional init systems for the UNIX/Linux operating system.
- **`Upstart:`** Upstart is an event-based replacement for the /sbin/init daemon.
- **`systemd:`** systemd is a new init system and service manager for Linux operating systems.

## How to determine 
([ref1](https://www.2daygeek.com/how-to-determine-which-init-system-manager-is-running-on-linux-system/), [ref2](https://linuxconfig.org/detecting-which-system-manager-is-running-on-linux-system))

| sysVinit                                                                                                                                                                                                 | systemd                                                                                                                                                                                                                     | upstart                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                                                                                                                                          | ```$ file /sbin/init``` <br /> ```/sbin/init: symbolic link to /lib/systemd/systemd```<br /> (another way: check if the directory `/run/systemd/system` exists)                                                             | ```/sbin/init --version init``` <br />```(upstart 0.6.5)```                                                                                                                                                    |
| ```# ls -l /proc/1/exe ```<br />```lrwxrwxrwx 1 root root 0 Apr  3 04:17 /proc/1/exe -> /sbin/init ```<br />OR <br />```# stat /proc/1/exe | grep File```<br />```File: '/proc/1/exe' -> '/sbin/init'``` | ```# ls -l /proc/1/exe ```<br />```lrwxrwxrwx 1 root root 0 Mar 27 09:39 /proc/1/exe -> /lib/systemd/systemd```<br /> OR <br />```# stat /proc/1/exe | grep File ```  <br />```File: /proc/1/exe -> /lib/systemd/systemd``` | ```# ls -l /proc/1/exe```<br />```lrwxrwxrwx 1 root root 0 Apr  3 04:29 /proc/1/exe -> /sbin/upstart``` <br />OR<br />``` # stat /proc/1/exe | grep File```<br /> ```File: '/proc/1/exe' -> '/sbin/upstart'``` |



## Service Commands

 These are the most commonly used service commands on a Linux system to manage services.

| Short Description                                                 | SysVinit Command                                                                                             | systemd Command                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Timeline                                                          | System V (Sys V) is one of the first and traditional init systems for  the UNIX/Linux operating system.      | systemd is a new init system and system manager |
| First process                                                     | Init is the first process started by  the kernel during system boot, and is a parent process for everything. |                                                 |
| command                                                           | **service**                                                                                                  | **systemctl**                                   |
| To Start a Service                                                | service example start                                                                                        | systemctl start example                         |
| To Stop a Service                                                 | service example stop                                                                                         | systemctl stop example                          |
| Stop and then Start a Service (Restart a Service)                 | service example restart                                                                                      | systemctl restart example                       |
| Reload a Service (Reload the config file)                         | service example reload                                                                                       | systemctl reload example                        |
| Restarts if the service is already running                        | service example condrestart                                                                                  | systemctl condrestart example                   |
| check if a service is currently running                           | service example status                                                                                       | systemctl status example                        |
| How to enable a service on boot/startup                           | chkconfig example on                                                                                         | systemctl enable example                        |
| disable a service on boot/startup                                 | chkconfig example off                                                                                        | systemctl disable example                       |
| check if a service is configured to start on boot or not          | chkconfig example –list                                                                                      | systemctl is-enabled example                    |
| list of enabled/disabled services on boot + runlevels information | chkconfig                                                                                                    | systemctl list-unit-files –type=service         |
| Create a new service file or modify any configuration             | chkconfig example –add                                                                                       | systemctl daemon-reload                         |

## Runlevels/Targets:

 The systemd has a concept of targets, which serves a similar purpose as runlevels, but operates slightly differently. Each target is named  instead of numbers and is intended to serve a specific purpose.

| Short Description                   | SysVinit Command | systemd Command                                   |
| ----------------------------------- | ---------------- | ------------------------------------------------- |
| To halt the system                  | 0, halt          | runlevel0.target, poweroff.target, systemctl halt |
| Single user mode                    | 1, S, single     | runlevel1.target, rescue.target                   |
| Multi User                          | 2                | runlevel2.target, multi-user.target               |
| Multi User with Network             | 3                | runlevel3.target, multi-user.target               |
| Experimental (No User)              | 4                | runlevel4.target, multi-user.target               |
| Multi-user with Graphical & Network | 5                | runlevel5.target, graphical.target                |
| To reboot a system                  | 6, reboot        | runlevel6.target, reboot.target, systemctl reboot |
| Emergency shell                     | emergency        | emergency.target                                  |

# vmlinuz, initrd

[initrd and vmlinuz](https://www.linuxquestions.org/questions/linux-server-73/difference-between-initrd-and-vmlinuz-images-892868/#post4421128)

vmlinuz files contain the Linux kernel proper.

initrd files are CPIO images, filesystem images.



# Busybox

[How to Add a New Applet to BusyBox](https://git.busybox.net/busybox/plain/docs/new-applet-HOWTO.txt)


```c
IF_LINUXRC(APPLET_ODDNAME(linuxrc, init, BB_DIR_ROOT, BB_SUID_DROP, linuxrc))
busybox linuxrc = busybox init --> call init_main
```
```c
IF_I2CTRANSFER(APPLET(i2ctransfer, BB_DIR_USR_SBIN, BB_SUID_DROP))
busybox i2ctransfer --> call i2ctransfer_main
```



# Initramfs, initrd

- [ ] ?? bootloader, which loads both kernel and initrd/initramfs for you (if applicable - it's possible to put both into one file. [ref](https://unix.stackexchange.com/a/516256/265821))
- [ ] ?? `/linuxrc` is launched on an old-style [initrd](https://www.kernel.org/doc/Documentation/initrd.txt), `/sbin/init` is launched on a newer-style initrd, `/init` is launched on an [initramfs](https://www.kernel.org/doc/Documentation/filesystems/ramfs-rootfs-initramfs.txt). Initrd and initramfs are two mechanisms with the same purpose: to mount a filesystem in RAM from which storage drivers can be loaded. Initrd is older, initramfs is the current recommended method. ([ref](https://unix.stackexchange.com/a/265135/265821))
- [ ] 



For many users, an initramfs system is of no concern. Their system uses a simple partitioning schema with no exotic drivers or setups (like  encrypted file systems), so the Linux kernel is entirely capable of  handing over control to the **init** binary on their system. But for many systems, an initramfs is mandatory. 



| initrd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | initramfs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The **initrd** is an in-memory disk structure (ramdisk) that contains the necessary tools and scripts to mount the needed file systems *before* control is handed over to the **init** application on the root file system. The Linux kernel triggers the setup script (usually called **linuxrc** but that name is not mandatory) on this root disk, which prepares the  system, switches to the real root file system and then calls **init**. <br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| - A `ramdev` block device is created. It is a ram-based  block device, that is a simulated hard disk that uses memory instead of  physical disks. <br />- The `initrd` file is read and unzipped into the device, as if you did `zcat initrd | dd of=/dev/ram0` or something similar.  <br />- The `initrd` contains an image of a filesystem, so now you can mount the filesystem as usual: `mount /dev/ram0 /root`. Naturally, filesystems need a driver, so if you use ext2, the ext2 driver has to be compiled in-kernel. <br />- Done!<br /><br />**Note: **With `initrd` the kernel by default hands over to userspace `pid 1` at `/sbin/init` ([source](https://stackoverflow.com/a/54460303/5407195))<br />---------------------------<br />**ramdev (ramdisk)**<br />Ramdev is regular block device. This allows layering any filesystem  on top of it, but it is restricted by the block device interface. And  that has just methods to fill in a page allocated by the caller and  write it back. That's exactly what is needed for real block devices like disks, memory cards, USB mass storage and such, but for ramdisk it  means, that the data exist in memory twice, once in the memory of the  ramdev and once in the memory allocated by the caller. | The boot loader will  then offer it to the Linux kernel at boot time so the kernel knows an  initramfs is needed <br />- A `tmpfs` file system is mounted: `mount -t tmpfs nodev /root`. The tmpfs doesn't need a driver, it is always on-kernel. No device needed, no additional drivers. <br /> - Launch `/init` (PID 1) located in the root of the tmpfs file system. This is very important! <br />- The `initramfs` is uncompressed directly into this new filesystem: `zcat initramfs | cpio -i`, or similar (**cpio** ~  **tar** but more simple). <br /> - Execute the command line `exec /sbin/init` to switch the root towards the real root file system while we are still inside `/init`<br />- `/sbin/init` (still PID 1, inherit the PID from its parent `/init`) to continue the boot process.<br />- Done! ([ref1](https://wiki.gentoo.org/wiki/Initramfs/Guide), [ref2](https://unix.stackexchange.com/a/147688/265821))<br /><br />**Note:** When we use `initramfs` boot scheme the first process which the kernel invokes is the `/init` script. The kernel will never try to execute `/sbin/init` directly.  <br /><br />E.g. The following shell script fragment demonstrates how to use switch_root ([Programming for Initramfs](https://landley.net/writing/rootfs-programming.html))<br />```  # First, find and mount the new filesystem. ``` <br>``` ``` <br>```  mkdir /newroot ``` <br>```  mount /dev/whatever /newroot ``` <br>``` ``` <br>```  # Unmount everything else you've attached to rootfs.  (Moving the filesystems ``` <br>```  # into newroot is something useful to do with them.) ``` <br>``` ``` <br>```  mount --move /sys /newroot/sys ``` <br>```  mount --move /proc /newroot/proc ``` <br>```  mount --move /dev /newroot/dev ``` <br>``` ``` <br>```  # Now switch to the new filesystem, and run /sbin/init out of it.  Don't ``` <br>```  # forget the "exec" here, because you want the new init program to inherit ``` <br>```  # PID 1. ``` <br>``` ``` <br>```  exec switch_root /newroot /sbin/init ``` <br><br /><br />-------------------------------------<br />**tmpfs** ([source](https://stackoverflow.com/questions/10603104/the-difference-between-initrd-and-initramfs))<br />tmpfs is different. It's a dummy filesystem. The methods it provides  to VFS are the absolute bare minimum to make it work (as such it's  excellent documentation of what the inode, dentry and file methods  should do). Files only exist if there is corresponding inode and dentry  in the inode cache, created when the file is created and never expired  unless the file is deleted. The pages are associated to files when data  is written and otherwise behave as anonymous ones (data may be stored to swap, `page` structures remain in use as long as the file exists).<br /><br />*tmpfs* (a size-flexible, in-memory lightweight file system), which also did  not use a separate block device |



# configfs, sysfs 

([ref1](https://lwn.net/Articles/148973/), [ref2](https://www.linux.org/threads/sysfs-and-configfs.9353/), [ref3](https://developer.ridgerun.com/wiki/index.php/How_to_use_configfs))

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



## configfs vs sysfs

- provides an interface between kernelspace and userspace
- Like sysfs, configfs uses directories as the way of representing objects. 

- Directories  contain files ("attributes") which  display the current state of the object, and which, optionally, may be writable to change that state. (virtual filesystems, dir, file located on RAM)
- Both sysfs and configfs can and should exist together on the same system. One is not a replacement for the other.

|             | configfs                                                                                        | sysfs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mount point | - /config/ or /sys/kernel/config/, but not always. <br>- configfs is not required to be mounted | /sys/ or /sysfs/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| organize    | depend on device driver?                                                                        | - /sys/block/: block device.<br/>- /sys/bus/: <br/>- /sys/class/ - This directory contains folders named by device type like "printers", "mem", "leds", "input", etc.<br/>- /sys/dev/ - Inside, there are two folders - "block" and "char" which direct users to the block and character devices respectively.<br/>- /sys/devices/ - Most of the symbolic/soft links (shortcuts) in the sysfs system link to devices and files here.<br/>- /sys/firmware/: system's firmware<br/>- /sys/fs/: mounted filesystem is placed here by filesystem type (e.g ext4).<br/>- /sys/hypervisor/:<br/>- /sys/kernel/:<br/>- /sys/module/ - All of the loaded modules can be seen here.<br/>- /sys/power/ - This directory contains files with information on the power state, the number of times the system hibernated/slept, etc. |
| use for?    | - configfs is a filesystem-based manager of kernel objects, or config_items                     | - can be used to configure a new sub system from user space , however, was never really meant for this application.  <br> - it provides a view into the kernel's data structures, and it can be used to cause things to happen with those structures.  But sysfs cannot be used to create new objects - at least, not without distorting the interface somewhat.  It is the wrong tool for this job.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| lifetime    | - completely driven by userspace                                                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|             |                                                                                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |



# systemd 

```bash
# How to list all enabled services from systemctl?
systemctl list-unit-files | grep enabled

# How to see full log from systemctl status service?
journalctl --no-pager -u piwebcam.service
```



# dtb, dti (device tree)

## Compile / decompile

```bash
# https://stackoverflow.com/a/51356662/5407195
$ sudo apt-get install device-tree-compiler

# Compile dts to dtb
$ dtc -I dts -O dtb -f devicetree_file_name.dts -o devicetree_file_name.dtb

# Decompile dtb to dts (readable)
$ dtc -I dtb -O dts -f devicetree_file_name.dtb -o devicetree_file_name.dts
```

# watch inotify inotifywait

```bash
#!/bin/bash

# https://linux.die.net/man/1/inotifywait

inotifywait -r --format "%w;%f;%e" -m _images -e create -e delete |
    while read ; do
        echo "path: $path - file: $file - action: $action"
        path=$(echo "$REPLY" | cut -d ";" -f 1)
        file=$(echo "$REPLY" | cut -d ";" -f 2)
        action=$(echo "$REPLY" | cut -d ";" -f 3)
    done

# _images/untitled folder/;new file;		  CREATE
# _images/untitled folder/;new file;		  DELETE
# _images/;				untitled folder   ;CREATE,ISDIR
# _images/;               untitled folder   ;DELETE,ISDIR

```

