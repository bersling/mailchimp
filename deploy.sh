#!/usr/bin/env bash

server=ubuntu@18.196.229.25

scp -r ./src $server:~/mailchimp
ssh $server "sudo docker stack deploy -c ./mailchimp/src/docker-compose.yml mailchimp"

