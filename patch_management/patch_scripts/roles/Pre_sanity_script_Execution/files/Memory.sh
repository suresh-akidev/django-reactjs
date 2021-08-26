dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
PatchMemory=($( free -m))
IFS=$SAVEIFS
MemTotal=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $2}')
MemUsed=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $3}')
MemFree=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $4}')
MemShared=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $5}')
MemBuff=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $6}')
MemAvailable=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $7}')
SwapTotal=$(free -m |sed -n '1!p'|grep Swap |awk '{ print $2}')
SwapUsed=$(free -m |sed -n '1!p'|grep Swap |awk '{ print $3}')
SwapFree=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $4}')
SwapShared=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $5}')
SwapBuff=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $6}')
SwapAvailable=$(free -m |sed -n '1!p'|grep Mem |awk '{ print $7}')

if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-Memory-$dateStamp.csv"`
inFile=`echo "$host-Patch-Memory-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-Memory-$dateStamp.log"`
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
rm -rf $1/patch-management/$host-Patch-Memory-*.csv $host-Patch-Memory-*.txt $1/patch-management/$host-Patch-Memory-*.log
echo -e "Hostname\tOS Name\tMem-Total\tMem-Used\tMem-Free\tMem-Shared\tMem-Buff\tMem-Available\tSwap-Total\tSwap-Used\tSwap-Free\tSwap-Shared\tSwap-Buff\tSwap-Available" >> $inFile
echo -e "Start of Log for Uptime check
OS: $linuxFlavor
Hostname: $host
Date: $dateStamp" > $logFile
        echo -e "$host\t$linuxFlavor\t$MemTotal\t$MemUsed\t$MemFree\t$MemShared\t$MemBuff\t$MemAvailable\t$SwapTotal\t$SwapUsed\t$SwapFree\t$SwapShared\t$SwapBuff\t$SwapAvailable" >> $inFile
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

