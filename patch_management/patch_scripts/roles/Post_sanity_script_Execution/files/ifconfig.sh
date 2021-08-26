#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
ifconfig=`sudo /sbin/ifconfig -a|sed '/^$/d'`
IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi

inFile=`echo "$1/patch-management/$host-Patch-ifconfig-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-ifconfig-$dateStamp.log"`
osName=`uname`



#-----------------------------------------------------------------------------#
# Valid/Invalid Output path check                                             #
#-----------------------------------------------------------------------------#
if [ ! -d $1 ]
then
    echo "Error: Invalid Output Path. Please enter correct output path"
    exit 1
fi
#-----------------------------------------------------------------------------#
# Linux Flavour Check                                                         #
#-----------------------------------------------------------------------------#
if [ $osName == "Linux" ]
then
    # linuxFlavor=`cat /etc/*release |grep PRETTY_NAME |awk '{print $1,$2}' | cut -d'"' -f2-`
        linuxFlavor=`lsb_release -a |grep Description |awk -F: '{print $NF}'| xargs`
fi
#-----------------------------------------------------------------------------#
# Deletes old files related to ifconfig check and creates a new files           #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-ifconfig-*.txt $1/patch-management/$host-Patch-ifconfig-*.log
echo -e "Start of Log for Patch-ifconfig status
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile
echo "$ifconfig" >$inFile
if [ ! -f "$logFile" ]
then
    echo "Error: File '${logFile}' not found."
else
        echo "Log File has been created - $logFile"
fi
if [ ! -f "$inFile" ]
then
    echo "Error: File '${inFile}' not found."
        exit 1
else
        echo "Output File has been created - $inFile"
fi

