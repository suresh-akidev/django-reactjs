#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
Loaded=`/usr/bin/systemctl status firewalld |sed -n '1!p' |grep Loaded | awk '{print $2,$3,$4,$5,$6,$7,$8}'`
Active=`/usr/bin/systemctl status firewalld |sed -n '1!p' |grep Active | awk '{print $2,$3,$4,$5,$6,$7,$8}'`
Docs=`/usr/bin/systemctl status firewalld |sed -n '1!p' |grep Docs | awk '{print $2,$3,$4,$5,$6,$7,$8}'`


IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-Firewall-$dateStamp.csv"`
inFile=`echo "$host-Patch-Firewall-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-Firewall-$dateStamp.log"`
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
# Deletes old files related to Networks and creates a new files               #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-Firewall-*.csv $host-Patch-Firewall-*.txt $1/patch-management/$host-Patch-Firewall-*.log
echo -e "Hostname\tOS Name\tLoaded\tActive\tDocs" >> $inFile
echo -e "Start of Log for Uptime check
OS: $linuxFlavor
Hostname: $host
Date: $dateStamp" > $logFile
        echo -e "$host\t$linuxFlavor\t$Loaded\t$Active\t$Docs" >> $inFile


#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# PrePatchNetworks status
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
