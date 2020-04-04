#!/bin/bash

yarn
yarn prisma generate
yarn $@
