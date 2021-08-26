dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
SAVEIFS=$IFS
IFS=$'\n'
PatchFStab=`cat /etc/fstab | grep -v '#'`
IFS=$SAVEIFS


if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
#outFile=`echo "$1/patch-management/$host-Patch-FStab-$dateStamp.csv"`
inFile=`echo "$1/patch-management/$host-Patch-FStab-$dateStamp.txt"`
#inFile=`echo "$host-Patch-FStab-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-FStab-$dateStamp.log"`
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
# Deletes old files related to FStab check and creates a new files            #
#-----------------------------------------------------------------------------#
#rm -rf $1/patch-management/$host-Patch-FStab-*.csv $host-Patch-FStab-*.txt $1/patch-management/$host-Patch-FStab-*.log
rm -rf $1/patch-management/$host-Patch-FStab-*.txt $1/patch-management/$host-Patch-FStab-*.log
echo -e "Start of Log for Patch FStab status
OS:$linuxFlavor
Hostname:$host
Date: $dateStamp" > $logFile
echo "$PatchFStab" >$inFile
# echo -en "Hostname\tOSName\tDevice\tMount point\tFile system type\tOptions\tBackup operation\tFile system check order" > $inFile
# echo >> $inFile

# for (( i=0; i<${#PatchFStab[@]}; i++ ))
# do
#     echo -en "$host\t$linuxFlavor\t" >> $inFile
#     BODY=`echo "${PatchFStab[$i]}" | sed 's/ \+/\t/g'|tr ',' '|'`
#     echo -en "$BODY" >> $inFile
#     echo >> $inFile
# done

#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information for the      #
# PrePatchFStab status
#-----------------------------------------------------------------------------#
#tr '\t' ',' < $inFile > $outFile
#echo -e "$inFile has been converted into $outFile for processing data
#End of Log File)
#" >> $logFile
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

