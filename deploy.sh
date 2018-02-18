#!/usr/bin/env bash

server=ubuntu@18.196.229.25

scp -r ./docker-compose.yml $server:~/mailchimp/docker-compose.yml
ssh $server "sudo docker stack deploy -c ./mailchimp/docker-compose.yml mailchimp"

