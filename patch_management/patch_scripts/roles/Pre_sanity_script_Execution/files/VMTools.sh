dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
VMTools=`ps -ef | grep -i vmtool | grep -v 'grep'|grep -v '/tmp'`
IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-VMTools-$dateStamp.csv"`
inFile=`echo "$host-Patch-VMTools-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-VMTools-$dateStamp.log"`
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
    # linuxFlavor=`lsb_release -a |grep -v 'Description' |xargs`
        linuxFlavor=`lsb_release -a |grep Description |awk -F: '{print $NF}'| xargs`
fi
#-----------------------------------------------------------------------------#
# Deletes old files related to uptime check and creates a new files           #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-VMTools-*.csv $host-Patch-VMTools-*.txt $1/patch-management/$host-Patch-VMTools-*.log
echo -e "Start of Log for PatchVMTools status
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile

echo -en "Hostname\tOSName\tUID\tPID\tPPID\tC\tSTIME\tTTY\tTIME\tCMD" > $inFile
echo >> $inFile

for (( i=0; i<${#VMTools[@]}; i++ ))
do
    echo -en "$host\t$linuxFlavor\t" >> $inFile
    BODY=`echo "${VMTools[$i]}" | sed 's/ \+/\t/g'`
    echo -en "$BODY" >> $inFile
    echo >> $inFile
done

#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# PrePatchVMTools status
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

