# install autossh
`apt-get install autossh`


# create service

edit file /etc/systemd/system/autossh-uppis-tunnel.service

set IP and login correctly

```
[Unit]
Description=AutoSSH tunnel service to uppis on local port 5000
After=network.target

[Service]
Environment="AUTOSSH_GATETIME=0"
ExecStart=/usr/bin/autossh -M 0 -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -NR 2222:localhost:22 -R 8080:localhost:80 <login>@<IP> -p 22

[Install]
WantedBy=multi-user.target
```
