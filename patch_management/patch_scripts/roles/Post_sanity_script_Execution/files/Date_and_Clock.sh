dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
date=$(/bin/date)
HWClock=$(/sbin/hwclock)
SysConfig=$(cat /etc/sysconfig/clock)
IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-date_and_clock-$dateStamp.csv"`
inFile=`echo "$host-Patch-date_and_clock-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-date_and_clock-$dateStamp.log"`
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
rm -rf $1/patch-management/$host-Patch-date_and_clock-*.csv $host-Patch-date_and_clock-*.txt $1/patch-management/$host-Patch-date_and_clock-*.log
echo -e "Hostname\tOSName\tDate\tHWClock\tSysConfig" >> $inFile
echo -e "Start of Log for Uptime check
OS: $linuxFlavor
Hostname: $host
Date: $dateStamp" > $logFile
        echo -e "$host\t$linuxFlavor\t$date\t$HWClock\t$SysConfig" >> $inFile
#-----------------------------------------------------

#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# PatchMemory status
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

