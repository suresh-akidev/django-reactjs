#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
PatchPasswordFile=`cat /etc/passwd`
IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
#outFile=`echo "$1/patch-management/$host-Patch-PasswordFile-$dateStamp.csv"`
inFile=`echo "$1/patch-management/$host-Patch-PasswordFile-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-PasswordFile-$dateStamp.log"`
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
# Deletes old files related to PasswordFile and creates a new files           #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-PasswordFile-*.txt $1/patch-management/$host-Patch-PasswordFile-*.log
echo -e "Start of Log for Patch PasswordFile status
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile

echo "$PatchPasswordFile" >$inFile

# for (( i=0; i<${#PatchPasswordFile[@]}; i++ ))
# do
#     echo -en "$host\t$linuxFlavor\t" >> $inFile
#     BODY=`echo "${PatchPasswordFile[$i]}"`
#     echo -en "$BODY" >> $inFile
#     echo >> $inFile
# done

# #-----------------------------------------------------------------------------#
# # Converts input file to CSV file with all necessary information for the      #
# # PrePatchPasswordFile status
# #-----------------------------------------------------------------------------#
# tr '\t' ',' < $inFile > $outFile
# echo -e "$inFile has been converted into $outFile for processing data
# End of Log File)
# " >> $logFile
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
#rm -rf $inFile

