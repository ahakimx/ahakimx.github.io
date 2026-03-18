---
layout: post
title: "Monitoring Prometheus dengan Grafana"
date: 2020-06-08 21:38:24 +0000
categories: []
tags: []
comments: true
---

### Monitoring Prometheus dengan Grafana

![image](https://cdn-images-1.medium.com/max/1200/1*jQ_nknBAUgkxCIKjDltC2g.jpeg)
Kali ini kita akan membahas mengenai monitoring prometheus dengan visualisasi grafana.

**Apa itu prometheus ?**

Prometheus adalah *open source*, sistem monitoring berbasis *metrics*. Prometheus mudah di gunakan serta memiliki model data yang *powerful* dan bahasa query yang dapat menganalisa aplikasi dan infrastruktur yang kita miliki.

Dengan format text yang sederhana membuatnya lebih mudah untuk mengekspos metrik ke prometheus.

![image](https://cdn-images-1.medium.com/max/800/1*JLCBDXagn4As8OzMlFvddA.png)
**Apa itu node exporter ?**

Eksporter adalah perangkat lunak yang di gunakan tepat di samping aplikasi yang ingin diperoleh metriknya. Eksporter menerima permintaan dari Prometheus, mengumpulkan data yang diperlukan dari aplikasi, mengubahnya menjadi format yang benar, dan kemudian mengembalikannya sebagai respons terhadap Prometheus.

**Apa itu Grafana ?**

Grafana adalah alat yang populer untuk membuat dashboard untuk berbagai sistem pemantauan dan non monitor, termasuk Graphite, InfluxDB, Elasticsearch, dan PostgreSQL. Ini adalah salah satu tools yang dapat digunakan untuk membuat dashboard saat menggunakan Prometheus.

Sekarang kita akan menginstall node exporter, prometheus dan grafana.

Kebutuhan :

- Node monitoring: node-monitoring (ip: 10.67.67.30, OS: Centos 7)
- Node container: node-container (ip: 10.67.67.31, OS: Centos 7)

Lakukan pada node containerJika menggunakan firewall, buka port 9100 terlebih dahulu

```
# firewall-cmd --zone=public --permanent --add-port=9100/tcp
# firewall-cmd --reload
```

```
# cd /opt
# wget https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-0.18.1.linux-amd64.tar.gz
# tar xvfz node_exporter-0.18.1.linux-amd64.tar.gz
# ./node_exporter --help
# ./node_exporter
```

```
...
INFO[0000]  - netstat                                    source="node_exporter.go:104"
INFO[0000]  - nfs                                        source="node_exporter.go:104"
INFO[0000]  - nfsd                                       source="node_exporter.go:104"
INFO[0000]  - pressure                                   source="node_exporter.go:104"
INFO[0000]  - sockstat                                   source="node_exporter.go:104"
INFO[0000]  - stat                                       source="node_exporter.go:104"
INFO[0000]  - textfile                                   source="node_exporter.go:104"
INFO[0000]  - time                                       source="node_exporter.go:104"
INFO[0000]  - timex                                      source="node_exporter.go:104"
INFO[0000]  - uname                                      source="node_exporter.go:104"
INFO[0000]  - vmstat                                     source="node_exporter.go:104"
INFO[0000]  - xfs                                        source="node_exporter.go:104"
INFO[0000]  - zfs                                        source="node_exporter.go:104"
INFO[0000] Listening on :9100                            source="node_exporter.go:170"
```
Akses browser http://10.67.67.31:9100/metrics :

![image](https://cdn-images-1.medium.com/max/800/1*Lt_3DDk10J6o3bvBT8VSYg.png)
Membuat node exporter sebagai service

```
# vi /etc/systemd/system/node_exporter.service

[Unit]
Description=Node Exporter

[Service]
User=root
ExecStart=/opt/node_exporter-0.18.1.linux-amd64/node_exporter

[Install]
WantedBy=default.target
```
Menjalankan servis node exporter

```
# systemctl daemon-reload
# systemctl enable node_exporter.service
# systemctl start node_exporter.service
# systemctl status node_exporter.service
# journalctl -u node_exporter
```
Instalasi PrometheusLakukan di node-monitoring

jika menggunakan firewall buka port 9090 terlebih dahulu

```
# firewall-cmd --zone=public --permanent --add-port=9090/tcp
# firewall-cmd --reload
```

```
# cd /opt
# wget https://github.com/prometheus/prometheus/releases/download/v2.10.0/prometheus-2.10.0.linux-amd64.tar.gz
# tar xvfz prometheus-2.10.0.linux-amd64.tar.gz
# cd prometheus-2.10.0.linux-amd64
# vi config.yml

global:
  scrape_interval:     15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
    - targets: ['10.67.67.30:9090']
  - job_name: 'node'
    static_configs:
    - targets: ['10.67.67.31:9100']
```
Cek konfigurasi prometheus

```
# ./promtool check config config.yml
# ./prometheus --web.listen-address 10.X0.X0.21:9090 --config.file /opt/prometheus-2.10.0.linux-amd64/config.yml
```
Membuat prometheus sebagai servis

```
# vi /etc/systemd/system/prometheus_server.service

[Unit]
Description=Prometheus Server

[Service]
User=root
ExecStart=/opt/prometheus-2.10.0.linux-amd64/prometheus --web.listen-address 10.X0.X0.21:9090 --config.file /opt/prometheus-2.10.0.linux-amd64/config.yml

[Install]
WantedBy=default.target
```
Jalankan prometheus

```
# systemctl daemon-reload
# systemctl enable prometheus_server.service
# systemctl start prometheus_server.service
# systemctl status prometheus_server.service
# journalctl -u prometheus_server
```

![image](https://cdn-images-1.medium.com/max/800/1*YNdXkgWFm2wrIQsdp0djPg.png)
Install Grafana di node-monitoringJika menggunakan firewall buka port 3000

```
# firewall-cmd --zone=public --permanent --add-port=3000/tcp
# firewall-cmd --reload
```

```
# cd /opt
# wget https://dl.grafana.com/oss/release/grafana-6.2.5.linux-amd64.tar.gz 
# tar -zxvf grafana-6.2.5.linux-amd64.tar.gz 
# cd grafana-6.2.5
# ./bin/grafana-server -homepath /opt/grafana-6.2.5 web
```
Membuat grafana sebagai servis

```
# vi /etc/systemd/system/grafana.service

[Unit]
Description=Grafana

[Service]
User=root
ExecStart=/opt/grafana-6.2.5/bin/grafana-server -homepath /opt/grafana-6.2.5/ web

[Install]
WantedBy=default.target
```
Jalankan grafana:

```
# systemctl daemon-reload
# systemctl enable grafana.service
# systemctl start grafana.service
# systemctl status grafana.service
# journalctl -u grafana
```
Akses web browser [http://10.67.67.30:3000](http://10.67.67.30:3000)

Credential grafana default:

```
username : admin
password : admin
```

![image](https://cdn-images-1.medium.com/max/800/1*rZC6k3oLixy9y4cjV6SqKg.png)
Menambahkan Data Source:

Masuk ke menu Configuration > Data Source > Add data source

Type > Prometheus

![image](https://cdn-images-1.medium.com/max/800/1*zqknqvYY-s_yTo1KGLJKOA.png)

![image](https://cdn-images-1.medium.com/max/800/1*-JoOklkwAoeAapvnTJTdPA.png)

![image](https://cdn-images-1.medium.com/max/800/1*i6_znQeDY4CnV5eriZU-2w.png)
Contoh:melihat uptime pada node

![image](https://cdn-images-1.medium.com/max/800/1*zKbdjZC9Za7zCXp30MbIRQ.png)

![image](https://cdn-images-1.medium.com/max/800/1*MCftSI43pvb0vRlV8F6ftQ.png)

![image](https://cdn-images-1.medium.com/max/800/1*ZHEP2nJZPvvTyly4SDMd8Q.png)

![image](https://cdn-images-1.medium.com/max/800/1*V19kCjVYPCy3pyUHvCm_Qw.png)

![image](https://cdn-images-1.medium.com/max/800/1*mRuUAlbn33jdSky47DDBPg.png)

![image](https://cdn-images-1.medium.com/max/800/1*ZPSptsfSv88UgJYw9xf5pQ.png)

![image](https://cdn-images-1.medium.com/max/800/1*Of5gzpmfdfH8MdM35ge7pg.png)
Sekian dan terimakasih.
