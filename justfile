#!/usr/bin/env just --justfile

default:
    @just --list

run day:
    node --watch --import=tsimp/import ./{{day}}/index.ts
