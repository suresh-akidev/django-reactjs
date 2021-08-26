#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
dateStampNow=`date +"%a %b %d %Y"`
host=`hostname -s`
Updated_Packages=`rpm -qa --qf "%{NAME}-%{VERSION}-%{RELEASE}\t%{INSTALLTIME:day}\n" | grep "$dateStampNow" | awk '{print $1}'`

if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-Updated_Packages-$dateStamp.csv"`
inFile=`echo "$host-Patch-Updated_Packages-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-Updated_Packages-$dateStamp.log"`
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
# Deletes old files related to Updated_Packages and creates a new files             #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-Updated_Packages-*.csv $host-Patch-Updated_Packages-*.txt $1/patch-management/$host-Patch-Updated_Packages-*.log
echo -e "Start of Log for Patch Updated Packages 
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile

echo -en "Hostname\tOSName\tUpdated_Packages" > $inFile
echo >> $inFile

if [ -z "$Updated_Packages" ]
then
    echo -en "$host\t$linuxFlavor\tNo packages updated today" >> $inFile
    echo >> $inFile
else
    while IFS= read -r line; do
        echo -en "$host\t$linuxFlavor\t$line" >> $inFile
        echo >> $inFile
    done <<< "$Updated_Packages"
fi


#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# Updated_Packages status
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
