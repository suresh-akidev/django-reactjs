#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
PatchSELinux=($(/usr/sbin/sestatus))
IFS=$SAVEIFS

if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-SELinux-$dateStamp.csv"`
inFile=`echo "$host-Patch-SELinux-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-SELinux-$dateStamp.log"`
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
# Deletes old files related to SELiux check and creates a new files           #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-SELinux-*.csv $host-Patch-SELinux-*.txt $1/patch-management/$host-Patch-SELinux-*.log
echo -e "Start of Log for Patch SELinux status
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile

echo -en "Hostname\tOSName" > $inFile

for (( i=0; i<${#PatchSELinux[@]}; i++ ))
do
    HEADER=`echo "${PatchSELinux[$i]}" | awk -F: '{print $1}'`
    echo -en "\t$HEADER" >> $inFile
done 
echo >> $inFile
echo -en "$host\t$linuxFlavor" >> $inFile

for (( i=0; i<${#PatchSELinux[@]}; i++ ))
do
    BODY=`echo "${PatchSELinux[$i]}" | awk -F": *" '{print $2}'`
    echo -en "\t$BODY" >> $inFile
done

#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# PrePatchSELinux status
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

