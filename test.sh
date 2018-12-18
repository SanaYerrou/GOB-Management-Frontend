#!/usr/bin/env bash

set -u # crash on missing env
set -e # stop on any error

echo "Running style checks"
npm run lint

echo "Running unit tests"
npm run test:unit
