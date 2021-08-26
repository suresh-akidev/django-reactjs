#!/usr/bin/env bash
###############################################################################
#  SBIC  : Linux-RHEL Uptime Module           #
###############################################################################
# INSTRUCTIONS                                                                #
# ------------                                                                #
# This script generates a CSV report for the Uptime check which lists         #
# the hostname, OS Name and uptime in days and hours                          #
# VERSION HISTORY                                                             #
# ---------------                                                             #
# VERSION   AUTHOR                  DATE            NOTES                     #
# v1.0      Kavin S              04 Septemer 2019   Initial Version           #
###############################################################################
#-----------------------------------------------------------------------------#
#DECLARE ALL THE VARIABLES IN THIS BLOCK                                      #
#VARIABLES SHOULD BE IN CAMELCASE EG- myVariable                              #
#-----------------------------------------------------------------------------#
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-uptime-$dateStamp.csv"`
inFile=`echo "$host-uptime-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-uptime-$dateStamp.log"`
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
# Deletes old files related to uptime check and creates a new files           #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-uptime-*.csv $host-uptime-*.txt $1/patch-management/$host-Patch-uptime-*.log
echo -e "Hostname\tOSName\tUptime Days\tUptime Hours\tUptime Mins" >> $inFile
echo -e "Start of Log for Uptime check
OS: $linuxFlavor
Hostname: $host
Date: $dateStamp" > $logFile
#-----------------------------------------------------------------------------#
# Collects uptime information(Number of days, hours, minutes the server is up #
# and running) of the server and feeds to input file                          #
#-----------------------------------------------------------------------------#
upTime=`uptime`
days=`echo "$upTime" |grep day`
mins=`echo "$upTime" |grep min`
hours=`echo "$upTime" |grep hr`
#-----------------------------------------------------------------------------#
# Below condition is checked when server is up and running for few days/day   #
#-----------------------------------------------------------------------------#
if [ -n "$days" ]
then
        daysUptime=`echo "$upTime" | awk '{print $3,$4}' | cut -f1 -d, |sed 's/[^0-9]*//g'`
        hrsUptime=`echo "$upTime" | awk '{print $5}' | cut -f1 -d: |sed 's/[^0-9]*//g'`
        minsUptime=`echo "$upTime" | awk '{print $5}' | cut -f2 -d:  |sed 's/[^0-9a-z]*//g'`
        echo -e "$host\t$linuxFlavor\t$daysUptime\t$hrsUptime\t$minsUptime" >> $inFile
fi
#-----------------------------------------------------------------------------#
# Below condition is checked when server is up and running for few hours only #
#-----------------------------------------------------------------------------#
if [ -n "$hours" ];
then
    daysUptime=0
        hrsUptime=`echo "$upTime" | cut -f2 -d"p" |cut -f1 -d, |sed 's/[^0-9]*//g'`
    minsUptime=0
        echo -e "$host\t$linuxFlavor\t$daysUptime\t$hrsUptime\t$minsUptime" >> $inFile
fi
#-----------------------------------------------------------------------------#
# Below condition is checked when server is up and running for few minutes only#
#-----------------------------------------------------------------------------#
if [ -n "$mins" ]
then
        daysUptime=0
        hrsUptime=0
        minsUptime=`echo "$upTime" | cut -f2 -d"p" |cut -f1 -d, |sed 's/[^0-9]*//g'`
        echo -e "$host\t$linuxFlavor\t$daysUptime\t$hrsUptime\t$minsUptime" >> $inFile
fi
if [ -z "$days" ] && [ -z "$hours" ] && [ -z "$mins" ];
then
    daysUptime=0
        hrsUptime=`echo "$upTime" | cut -f2 -d"p" |cut -f1 -d"," |cut -f1 -d: |sed 's/[^0-9]*//g'`
    minsUptime=`echo "$upTime" | cut -f2 -d"p" |cut -f1 -d"," |cut -f2 -d:`
        echo -e "$host\t$linuxFlavor\t$daysUptime\t$hrsUptime\t$minsUptime" >> $inFile
fi
echo -e "Collected uptime of the server in days and hours into $inFile" >> $logFile
#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# uptime                                                                      #
#-----------------------------------------------------------------------------#
tr '\t' ',' < $inFile > $outFile
echo -e "$inFile has been converted into $outFile for processing data
End of Log File)
" >> $logFile
if [ ! -f "$logFile" ]
then
    echo "Error: File '${logFile}' not found."
else
        echo "Log File has been created - $logFile"
fi
if [ ! -f "$outFile" ]
then
    echo "Error: File '${outFile}' not found."
        exit 1
else
        echo "Output File has been created - $outFile"
fi
rm -rf $inFile



