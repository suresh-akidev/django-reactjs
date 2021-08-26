#!/usr/bin/env bash
dateStamp=`date +"%Y%m%d-%H%M"`
host=`hostname -s`
rm -rf $1/patch-management/$host-Patch-Networks-*.csv
linuxFlavor=`lsb_release -a |grep Description |awk -F: '{print $NF}'| xargs`
inFile=`echo "$1/patch-management/$host-Patch-Networks-$dateStamp.txt"`
outFile=`echo "$1/patch-management/$host-Patch-Networks-$dateStamp.csv"`
logFile=`echo "$1/patch-management/$host-Patch-Networks-$dateStamp.log"`
IFCFGFILES=`ls /etc/sysconfig/network-scripts/ifcfg-*`
COLUMNHEADERS="NAME HWADDR TYPE DNS1 DNS2 DOMAIN DEVICE ONBOOT USERCTL BOOTPROTO NETMASK IPADDR PEERDNS GATEWAY PROXY_METHOD UUID BONDING_OPTS BROADCAST DHCP_HOSTNAME HOTPLUG MACADDR NETWORK SRCADDR"
echo -en "Hostname\tOS-Name\tNAME\tHWADDR\tTYPE\tDNS1\tDNS2\tDOMAIN\tDEVICE\tONBOOT\tUSERCTL\tBOOTPROTO\tNETMASK\tIPADDR\tPEERDNS\tGATEWAY\tPROXY_METHOD\tUUID\tBONDING_OPTS\tBROADCAST\tDHCP_HOSTNAME\tHOTPLUG\tMACADDR\tNETWORK\tSRCADDR" > $inFile
echo >> $inFile
for eachifcfg in $IFCFGFILES
do
echo -en "$host\t$linuxFlavor\t" >> $inFile
for eachcolumn in $COLUMNHEADERS
do
eachvalue=`cat $eachifcfg| grep -v '#' | grep '=' | grep $eachcolumn | awk -F= '{print $NF}'`
if [ -z $eachvalue ]
then
eachvalue=" "
fi

echo -en "$eachvalue\t" >> $inFile

done
echo >> $inFile
done

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