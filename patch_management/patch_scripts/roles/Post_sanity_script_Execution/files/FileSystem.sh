dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
if [ ! -d "$1/patch-management" ]
then
    mkdir $1/patch-management
fi
outFile=`echo "$1/patch-management/$host-Patch-filesystem-$dateStamp.csv"`
inFile=`echo "$host-Patch-filesystem-$dateStamp.txt"`
logFile=`echo "$1/patch-management/$host-Patch-filesystem-$dateStamp.log"`
dfMount=`df -lh | grep -v /run | grep -v /cd-rom | grep -v /proc | grep -v /var/crash`
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
# Converting Megabytes and Kilobytes to Gigabytes in Linux                    #
#-----------------------------------------------------------------------------#
function gbSize()
{
  sizeGiven=$1
  sizeUnit=`echo $sizeGiven | sed 's/.*\(.\)$/\1/'`
  case $sizeUnit in
    G)
     echo $sizeGiven | sed s/.$//
     ;;
    M)
     sizeMb=`echo $sizeGiven | sed s/.$//`
     echo "scale=2; $sizeMb / 1024" | bc
     ;;
    K)
     sizeKb=`echo $sizeGiven | sed s/.$//`
     echo "scale=2; $sizeKb / 1024^2" | bc
     ;;
    *)
     echo $sizeGiven
     ;;
   esac
}
#-----------------------------------------------------------------------------#
# Deletes old files related to Patchfilesystem check and creates a new files       #
#-----------------------------------------------------------------------------#
rm -rf $1/patch-management/$host-Patch-filesystem-*.csv $host-Patch-filesystem-*.txt $1/patch-management/$host-Patch-filesystem-*.log
echo -e "Hostname\tOSName\tfilesystem\tTotal (GB)\tUsed (GB)\tAvailable (GB)\tUsed%\tFree Utilization%" >> $inFile
echo -e "Start of Log for filesystem Utilization
OS: $linuxFlavor
Hostname: $host
Date: $dateStamp" > $logFile
#-----------------------------------------------------------------------------#
# Collects complete information about each Patchfilesystem utilization and feeds to#
# input file                                                                  #
#-----------------------------------------------------------------------------#
echo "$dfMount" 2>>$logFile | awk '{print $6}' | grep -v Mounted > /tmp/mountPoints
for mountPoint in `cat /tmp/mountPoints`
do
    dfSpace=`df -lh $mountPoint 2>>$logFile | grep -v Used`
    mount=`echo "$mountPoint"`
        total=`echo "$dfSpace" | awk '{print$2}'`
    used=`echo "$dfSpace" | awk '{print$3}'`
    free=`echo "$dfSpace" | awk '{print$4}'`
    utilization=`echo "$dfSpace"  | awk '{print$5}' |sed 's/[^0-9.]*//g'`
        frUtil=$(echo "scale=2; "100" "-" "$utilization" "| bc)
    total=`gbSize $total`
    used=`gbSize $used`
    free=`gbSize $free`
    echo -e "$host\t$linuxFlavor\t$mount\t$total\t$used\t$free\t$utilization\t$frUtil" >> $inFile
done
echo -e "Collected Mount points, Total Space, Used Space, Free Space, Utilization% and Free Utilization% into $inFile" >> $logFile
#-----------------------------------------------------------------------------#
# Converts input file to CSV file with all necessary information about the    #
# Patchfilesystem                                                                  #
#-----------------------------------------------------------------------------#
tr '\t' ',' < $inFile > $outFile
echo -e "$inFile has been converted into $outFile for processing data
End of Log File
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
rm -rf /tmp/mountPoints $inFile
#EOF

