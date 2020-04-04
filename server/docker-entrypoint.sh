#!/bin/bash

env
yarn
yarn prisma generate
yarn $@
