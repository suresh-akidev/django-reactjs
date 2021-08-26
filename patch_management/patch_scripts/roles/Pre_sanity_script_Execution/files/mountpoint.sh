#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
Patchdf=($(df -ThP|grep -v 'Filesystem'))
IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-mountpoint-$dateStamp.csv"`
inFile=`echo "$host-Patch-mountpoint-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-mountpoint-$dateStamp.log"`
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
# Deletes old files related to df.sh and creates a new files                  #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-mountpoint-*.csv $host-Patch-mountpoint-*.txt $1/patch-management/$host-Patch-mountpoint-*.log
echo -e "Start of Log for Pre Patch df status
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile

echo -en "Hostname\tOSName\tFilesystem\tType\tSize\tUSed\tAvail\tUse%\tMounted On" > $inFile
echo >> $inFile

for (( i=0; i<${#Patchdf[@]}; i++ ))
do
    echo -en "$host\t$linuxFlavor\t" >> $inFile
    BODY=`echo "${Patchdf[$i]}" | sed 's/ \+/\t/g'`
    echo -en "$BODY" >> $inFile
    echo >> $inFile
done

#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# PrePatchdf status
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

