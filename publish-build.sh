#!/usr/bin/env bash
IMAGE=bersling/mailchimp
docker build -t $IMAGE .
docker push $IMAGE
