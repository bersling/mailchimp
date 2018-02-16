#!/usr/bin/env bash
IMAGE=bersling/mailchimp:2
docker build -t $IMAGE .
docker push $IMAGE
