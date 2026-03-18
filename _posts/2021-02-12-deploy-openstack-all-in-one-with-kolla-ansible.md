---
layout: post
title: "Deploy Openstack All-in-one with Kolla-ansible"
date: 2021-02-12 08:59:33 +0000
categories: []
tags: []
comments: true
---

![image](https://cdn-images-1.medium.com/max/800/0*WT6ROatUI2X00gfn)
What is openstack ?> “OpenStack is an open source cloud computing infrastructure software project and is one of the three most active open source projects in the world”.
More details about openstack click [here](http://openstack.org)

Requirements for this tutorial:- Ubuntu 18.04 CPU 8 core,
- 8 GB RAM
- storage vda 50 GB, vdb 50G
- 2 network interfaces ens3 > 10.20.20.10. ens9 > 10.30.30.10
- Kolla ansible, - [here](https://docs.openstack.org/kolla-ansible/latest/)

Lets build, setup on vm ubuntu

1. Update, upgrade server and install dependency
```
$ sudo apt-get update; sudo apt-get upgrade
$ sudo apt-get install python3-dev libffi-dev gcc libssl-dev
$ sudo apt-get install python3-pip
```
2. create a new userThis case user named kolla, then set kolla user as sudoer without password.

```
$ sudo useradd kolla -m -s /bin/bash
$ sudo vim /etc/sudoers.d/kolla
...
kolla ALL=(ALL) NOPASSWD: ALL
...
```

```
$ su - kolla
```
3. Install kolla-ansible
```
$ sudo pip3 install -U pip
$ sudo pip3 install ansible
$ pip3 install kolla-ansible==10.0
$ sudo mkdir -p /etc/kolla
$ sudo chown $USER:$USER /etc/kolla
$ cp -r /usr/local/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
$ cp /usr/local/share/kolla-ansible/ansible/inventory/* .
```
4. create a partition for cinder volumefor tutorial create partition lvm you can see [here](https://www.techoism.com/create-new-partition-using-lvm-linux/).

```
$ sudo fdisk /dev/vdb
```

```
+--------+------+----------------+
| Device | Size |      Type      |
+--------+------+----------------+
| vdb1   | 100G | 8e (Linux LVM) |
+--------+------+----------------+
```
5. Create LVM disk for cinder service
```
sudo pvcreate -f /dev/vdb1
sudo pvs
sudo vgcreate -f cinder-volumes /dev/vdb1
sudo vgs
```
6. Edit ansible config
```
$ sudo vim /etc/ansible/ansible.cfg
...
[defaults]
host_key_checking=False
pipelining=True
forks=100
...
```
7. Generate kolla password
```
$ kolla-genpwd
```
8. Edit kolla configuration
```
$ vi /etc/kolla/globals.yml
...
kolla_base_distro: "ubuntu"
kolla_install_type: "source"
openstack_release: "ussuri"
kolla_internal_vip_address: "10.20.20.10"
network_interface: "ens3"
neutron_external_interface: "ens9"
neutron_plugin_agent: "openvswitch"
enable_heat: "yes"
enable_neutron_provider_networks: "yes"
nova_compute_virt_type: "kvm"
enable_cinder: "yes"
enable_cinder_backend_lvm: "yes"
cinder_volume_group: "cinder-volumes"
enable_neutron_qos: "yes"
enable_openstack_core: "yes"
enable_haproxy: "no"
...
```
9. Deployment kolla
```
kolla-ansible -i all-in-one bootstrap-servers
kolla-ansible -i all-in-one prechecks
kolla-ansible -i all-in-one deploy
kolla-ansible -i all-in-one post-deploy
kolla-ansible -i all-in-one check
```
10. install openstack CLI client
```
pip install python3-openstackclient
```
11. Testing installationThere is a script that will create example networks, images, and so on.

```
$ cd /usr/local/share/kolla-ansible/
$ ./init-runonce
```
12. Check openstack services
```
$ source /etc/kolla/admin-openrc.sh
```

```
$ openstack service list
+----------------------------------+-------------+----------------+
| ID                               | Name        | Type           |
+----------------------------------+-------------+----------------+
| 211967ceae3b4cf1bc04ca1587c73073 | nova        | compute        |
| 4b0a44c2ae654e45a22ec6539d8c5634 | glance      | image          |
| 53b944270b7f489ea37f00027e5999a3 | neutron     | network        |
| 6dc350336f8c4a14831dda920545f64a | keystone    | identity       |
| 83bafae712084e76b09d6da590152bd0 | cinderv2    | volumev2       |
| 988dab40890d452a8f55eef7f85bfd46 | placement   | placement      |
| ab8d636872db481ea04b6c6075d63f8e | heat        | orchestration  |
| ae288e6298ea42af8cabb9d8865d0fac | cinderv3    | volumev3       |
| ba92ae6b96a04d2d9671a92802c90e61 | nova_legacy | compute_legacy |
| ea54bc5ca34846c894d12a054c1969a9 | heat-cfn    | cloudformation |
+----------------------------------+-------------+----------------+
```
Openstack all-in-one has been installed on ubuntu 18.04.

Reference:

[https://docs.openstack.org/kolla-ansible/latest/](https://docs.openstack.org/kolla-ansible/latest/)
