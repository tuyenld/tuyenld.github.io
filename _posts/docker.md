## Install 
```bash
$ curl -O https://download.docker.com/linux/ubuntu/dists/xenial/pool/stable/amd64/docker-ce_18.06.0~ce~3-0~ubuntu_amd64.deb
$ sudo dpkg -i docker-ce_18.06.0~ce~3-0~ubuntu_amd64.deb 
```
## Test
```
$ sudo docker run hello-world
```

## Run Ubuntu 16.04 on Docker
```bash
$ sudo docker pull ubuntu:16.04
$ sudo docker run -i -t ubuntu:16.04 /bin/bash
```
## Useful command
<!-- http://blog.appconus.com/2016/04/17/docker-cho-nguoi-moi-bat-dau-p2/ -->

```bash
docker run -v /host/directory:/container/directory -it jenkins /bin/bash


# Docker 'run' command to start an interactive BaSH session
sudo docker run -it vema/jenkins /bin/bash

# Stop container
sudo docker stop de04adb60414

# Removing Containers
docker rm Container

# Delete image
docker rmi Image

sudo docker ps -a

# Commit change
sudo docker commit a74e605ae17a ruby:2.6

# Open port
$ docker run --name hilite -d -p 80 nginx:stable

# Attach to exsited container
sudo docker container exec -it vibrant_curran /bin/bash

```

### Để thoát ra khỏi container mà giữ cho nó vẫn chạy
Bạn bấm 2 tổ hợp phím Ctrl + P sau đó Ctrl + Q.
Thao tác này gọi là detach.

### Để vào lại container (attach), bạn chạy lệnh theo cú pháp: $docker attach {container_id}
$ sudo docker attach 3c0c3a545087


*****************************
        Fresh install
*****************************

sudo apt install docker.io
sudo groupadd docker
sudo usermod -aG docker $USER
logout
login

docker run hello-world
------------------------------------------------
$ docker run --name my-custom-nginx-container -v /host/path/nginx.conf:/etc/nginx/nginx.conf:ro -d nginx

# Open port
$ docker run --name hilite -d -p 8080:80 nginx:stable
> 	192.168.56.164:8080


$ sudo docker run -i -t -p 8080:80 ubuntu:16.04 /bin/bash


# Remove, clean
Docker provides a single command that will clean up any resources — images, containers, volumes, and networks — that are dangling (not associated with a container):

https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes

docker system prune -a

#### Ping
apt-get update
apt-get install iputils-ping

apt-get -y install sudo

apt-get install net-tools 	# 	ifconfig
apt-get install iproute2 	# 	ip
apt-get install bash-completion 	# Auto fill

usermod -aG sudo username

sudo nano authorized_keys 	# On server
> Copy **Public key** from Client

```
ldtuyen_prov.ppk  			# Putty format  << Putty gen ra > SSH2 RSA
ldtuyen_prov.pub 			# Putty format  << Putty gen ra

ldtuyen_prov_openssh 			# OpenSSH format 	>> Dung cho SecureCRT
ldtuyen_prov_openssh.pub 		# OpenSSH format 	>> Dung cho SecureCRT

```


#### Config sshd

cat /etc/ssh/sshd_config

```
Port 2221
	
ListenAddress 192.168.1.137

# Change to no to disable tunnelled clear text passwords
PasswordAuthentication no

UsePAM no

```

```
cat /etc/ssh/sshd_config

Port 2221
# Use these options to restrict which interfaces/protocols sshd will bind to
#ListenAddress ::
ListenAddress 192.168.1.137
Protocol 2
# HostKeys for protocol version 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key
#Privilege Separation is turned on for security
UsePrivilegeSeparation yes

# Lifetime and size of ephemeral version 1 server key
KeyRegenerationInterval 3600
ServerKeyBits 1024

# Logging
SyslogFacility AUTH
LogLevel INFO

# Authentication:
LoginGraceTime 120
PermitRootLogin prohibit-password
StrictModes yes

RSAAuthentication yes
PubkeyAuthentication yes
#AuthorizedKeysFile     %h/.ssh/authorized_keys

# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
# For this to work you will also need host keys in /etc/ssh_known_hosts
RhostsRSAAuthentication no
# similar for protocol version 2
HostbasedAuthentication no
# Uncomment if you don't trust ~/.ssh/known_hosts for RhostsRSAAuthentication
#IgnoreUserKnownHosts yes

# To enable empty passwords, change to yes (NOT RECOMMENDED)
PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Change to no to disable tunnelled clear text passwords
PasswordAuthentication no

# Kerberos options
#KerberosAuthentication no
#KerberosGetAFSToken no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes

X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
#UseLogin no

#MaxStartups 10:30:60
#Banner /etc/issue.net

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

Subsystem sftp /usr/lib/openssh/sftp-server

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the ChallengeResponseAuthentication and
# PasswordAuthentication.  Depending on your PAM configuration,
# PAM authentication via ChallengeResponseAuthentication may bypass
# the setting of "PermitRootLogin without-password".
# If you just want the PAM account and session checks to run without
# PAM authentication, then enable this but set PasswordAuthentication
# and ChallengeResponseAuthentication to 'no'.
UsePAM no
```


# Enable IPv6 Docker
sudo nano /etc/docker/daemon.json 
{
	"ipv6": true,
	"fixed-cidr-v6": "2001:22:1::/64"
}

sudo systemctl restart docker

ufw disable




docker network create -d macvlan  \
    --subnet=172.16.10.0/24  \
    --ip-range=172.16.10.22/32 \
    --gateway=172.16.10.1  \
    -o parent=eno1 macnet32

# Start a container and verify the address is 192.168.32.128
docker run --net=macnet32 -it ubuntu:16.04 /bin/bash


============================================================================
https://wiki.libvirt.org/page/Networking#Debian.2FUbuntu_Bridging
============================================================================

>> Host configuration

sudo vim /etc/network/interfaces

```
 auto br0
 iface br0 inet static
         address 172.16.10.20
         netmask 255.255.255.0
         network 172.16.10.0
         broadcast 172.16.10.255
         gateway 172.16.10.1
         bridge_ports eno1
         bridge_stp on
         bridge_maxwait 0

iface br0 inet6 static
        address 3001::20
        netmask 64
        gateway fe80::1
        autoconf 0
```

sudo ifconfig eno1 down
sudo ifconfig br0 down
sudo ifconfig br0 up

sudo vim /etc/sysctl.conf

```
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 0
net.bridge.bridge-nf-call-iptables = 0
net.bridge.bridge-nf-call-arptables = 0
```

sudo sysctl -p /etc/sysctl.conf 

>> Guest configuration

virsh edit <VM name>
virsh edit win7

```
    <interface type='bridge'>
      <mac address='52:54:55:53:ab:33'/>
      <source bridge='br0'/>
      <model type='rtl8139'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x03' function='0x0'/>
    </interface >
```


## copy Docker images from one host to another without using a repository
https://stackoverflow.com/questions/23935141/how-to-copy-docker-images-from-one-host-to-another-without-using-a-repository

You will need to save the Docker image as a tar file:

```
docker save -o <path for generated tar file> <image name>
```
Then copy your image to a new system with regular file transfer tools such as cp or scp. After that you will have to load the image into Docker:

```
docker load -i <path to image tar file>
```

PS: You may need to sudo all commands.

EDIT: You should add filename (not just directory) with -o, for example:

```
docker save -o c:/myfile.tar centos:16
```

## OpenGrok

https://hub.docker.com/r/opengrok/docker
https://github.com/oracle/opengrok/wiki/Repository-synchronization
https://github.com/oracle/opengrok/wiki/Per-project-management

<!-- netstat -->
sudo apt install net-tools

<!-- ps aux -->
apt-get install procps

<!-- Install vim -->
```bash
apt-get update

apt-get install apt-file

apt-file update

apt-get install vim     # now finally this will work !!!
```


sudo docker pull opengrok/docker:latest

sudo docker run -d -v src:/src -p 8088:8088 -it opengrok/docker:latest  /bin/bash
sudo docker run -v /home/network2/src:/src -p 8088:8080 -it opengrok/docker:latest  /bin/bash

sudo docker kill CONTAINER_ID


Reading configuration from /var/opengrok/etc/configuration.xml
INFO: Indexer options: [-s, /src, -d, /data, -H, -P, -S, -G, -W, /var/opengrok/etc/configuration.xml, -U, http://localhost:8080, --noIndex]


opengrok-projadm -U  http://localhost:8080 -a /src/hg100r-l4-571-mp3/rg_hsp


sudo docker exec -it 441727200fc0 bash


usage: opengrok-reindex-project [-h] [-l LOGLEVEL] [-v] [-j JAVA]
                                [-J JAVA_OPTS] [-e ENVIRONMENT]
                                (-a JAR | -c CLASSPATH) -t TEMPLATE -p PATTERN
                                -P PROJECT -d DIRECTORY [-U URI]
                                options [options ...]


vi /scripts/sync.conf
```
commands:
- command: [/opengrok/bin/opengrok-reindex-project, -D, -J=-d64,
    '-J=-XX:-UseGCOverheadLimit', -J=-Xmx16g, -J=-server, --jar, /opengrok/lib/opengrok.jar,
    -t, /opengrok/etc/logging.properties.template, -p, '%PROJ%', -d, /opengrok/log/%PROJECT%,
    -P, '%PROJECT%', -U, 'http://localhost:8080', --, --renamedHistory, 'on', -r, dirbased, -G, -m, '256', -c,
    /usr/local/bin/ctags, -U, 'http://localhost:8080',
    -H, '%PROJECT%'']
```

mkdir /opengrok/etc
mkdir /opengrok/log

vi /opengrok/etc/logging.properties.template
```
handlers= java.util.logging.FileHandler

.level= FINE

java.util.logging.FileHandler.pattern = /opengrok/log/%PROJ%/opengrok%g.%u.log
# Create one file per indexer run. This makes indexer log easy to check.
java.util.logging.FileHandler.limit = 0
java.util.logging.FileHandler.append = false
java.util.logging.FileHandler.count = 30
java.util.logging.FileHandler.formatter = org.opengrok.indexer.logger.formatter.SimpleFileLogFormatter

java.util.logging.ConsoleHandler.level = WARNING
java.util.logging.ConsoleHandler.formatter = org.opengrok.indexer.logger.formatter.SimpleFileLogFormatter
```
opengrok-sync -c /scripts/sync.conf -d /src/




opengrok-reindex-project -D -J=-d64 '-J=-XX:-UseGCOverheadLimit' '-J=-Xmx16g' -J=-server --jar opengrok/lib/opengrok.jar -- -s /src -d /data -H -P -S -G -W /var/opengrok/etc/configuration.xml -U http://localhost:8080

opengrok-reindex-project -D -J=-d64 --jar /opengrok/lib/opengrok.jar -- -s /src -d /data -H -P -S -G -W /var/opengrok/etc/configuration.xml -U http://localhost:8080



opengrok-reindex-project -J=-d64 '-J=-XX:-UseGCOverheadLimit' -J=-Xmx16g -J=-server --jar /opengrok/lib/opengrok.jar --template /opengrok/etc/logging.properties.template --pattern hg100r-l4-571-mp3 --directory /opengrok/log/hg100r-l4-571-mp3 --project /src/hg100r-l4-571-mp3 -U 'http://localhost:8080' -- --renamedHistory 'on' -r dirbased -G -m '256' -c /usr/local/bin/ctags -U 'http://localhost:8080' -H hg100r-l4-571-mp3


opengrok-reindex-project -D, -J=-d64,
    '-J=-XX:-UseGCOverheadLimit', -J=-Xmx16g, -J=-server, --jar, /opengrok/dist/lib/opengrok.jar,
    -t, /opengrok/etc/logging.properties.template, -p, '%PROJ%', -d, /opengrok/log/%PROJECT%,
    -P, '%PROJECT%', -U, 'http://localhost:8080/source', --, --renamedHistory, 'on', -r, dirbased, -G, -m, '256', -c,
    /usr/local/bin/ctags, -U, 'http://localhost:8080/source', -o, /opengrok/etc/ctags.config,
    -H, '%PROJECT%']