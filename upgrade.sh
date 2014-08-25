#!/bin/sh
### ====================================================================== ###
##                                                                          ##
##  Update Script                                                    ##
##                                                                          ##
### ====================================================================== ###

cd /c
cd cyanrhino
git remote update
git fetch
git pull origin master