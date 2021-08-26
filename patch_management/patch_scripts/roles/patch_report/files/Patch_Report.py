import pandas as pd
import os
import datetime
from datetime import datetime
from ruamel import yaml
import csv
import datetime
import glob
import operator
import sys
import argparse
import numpy as np
from config import *
import collections
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def TestPortConnection(smtp_server, port, logFilePath):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # print(sock)
        result = sock.connect_ex((smtp_server, port))
        if result == 0:
            with open(logFilePath, "a") as logfile:
                logfile.write('SMTP {} was reachable with given port {} \n'.format(smtp_server, port))
        else:
            with open(logFilePath, "a") as logfile:
                logfile.write('Given SMTP server hostname/ip {} was not reachable with port {}..hence script is going to terminate...!'.format(smtp_server,port))
            exit()
            sock.close()
    except:
        e = sys.exc_info()
        print(e)
        with open(logFilePath, "a") as logfile:
            logfile.write("Port Connection function failed with ErrorException -- " + str(e))
        exit()

def report(yaml_file):
    #read yaml file for configuration
    config=configure(yaml_file)
    now = datetime.now()
    CurrentTime = now.strftime("%d-%m-%Y %I:%M:%S %p")
    hostname = os.uname()[1]

   #############################################################################################
    # HTML REPORT FORMATTING
    #############################################################################################

    # HTML Cascading Style Sheet (CSS)
    style = """
    <style>
    html, body {
    width: 100%%;
    height: 100%%;
    margin: 0;
    padding: 0;
    }
    body{width: 85%%;
    font-size: 10pt;
    background-color: white;
    font-family: Arial, Tahoma, sans-serif;}
    table {
    margin-left:auto; 
    margin-right:auto;
    border: 1px solid #1C6EA4;
    background-color: #FFFFFF    ;
    width: 80%%;
    text-align: center;
    border-collapse: collapse;
    }
    table td, table th {
    border: 1px solid #AAAAAA;
    padding: 3px 2px;
    }
    table tbody td {
    font-size: 13px;
    }
    table tr:nth-child(even) {
    background: #D9D9D9    ;
    }
    table thead {
    background: #6F2C91;
    background: -moz-linear-gradient(top, #6F2C91 0%%, #6F2C91 66%%, #6F2C91 100%%);
    background: -webkit-linear-gradient(top, #6F2C91 0%%, #6F2C91 66%%, #6F2C91 100%%);
    background: linear-gradient(to bottom, #6F2C91 0%%, #6F2C91 66%%, #6F2C91 100%%);
    border-bottom: 2px solid #6F2C91;
    }
    table thead th {
    font-size: 15px;
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    border-left: 2px solid #D0E4F5;
    }
    table thead th:first-child {
    border-left: none;
    }
    .FailedService {color: red;}
    </style>
    <h2 style="text-align: center;">DXC Technology|%s|Patch Report</h2>
    """ % (config.account)

    title_1 = """<h2 style="text-align: center;">Overall Status</h2>"""
    title_2 = """<h2 style="text-align: center;">Validation Status</h2>"""
    Footer = "<br/><hr class='footer-line'><div class='footer-font'>Patch Report generated on {}</div>".format(CurrentTime)


    ####################################################################################################
    # HTML REPORT FILE LOCATION
    ####################################################################################################

    #set variable for path
    outputPath = config.masterServer_outputpath + "/" + config.Patchoutput  + "/" + config.technology
    outputPath_prePatch = outputPath + "/" + config.PrePatchOutput
    outputPath_postPatch = outputPath + "/" + config.PostPatchOutput
    outputPath_validation = outputPath + "/" +  config.ValidationOutput
    master_file = outputPath + "/" + "Master-Execution-Summary.csv"
    logFilePath = '{}/Patch-Validation-{}-Logfile.log'.format(outputPath,config.technology)
    scriptname = os.path.basename(__file__)

    # HTML Report Filename
    fileName = "{}-{}-Patch Report".format(config.technology,config.account)

    #delete existing HTML file
    html_file = glob.glob('{}/*.{}'.format(outputPath_validation,'html'))
    if len(html_file) != 0:
        for file in html_file:
            os.remove(file)

    logFilePath = '{}/Patch-Validation-{}-Logfile.log'.format(outputPath,config.technology)

    #get embedded picture for OK and NG
    with open ("OK.txt", "r") as OKfile:
        OK=OKfile.readlines()

    with open ("NG.txt", "r") as NGfile:
        NG=NGfile.readlines()    

    # HTML Report Target File Location.
    now = datetime.now()
    time_zone = now.strftime("%d%b%Y-%H%M")   
    outputPath_validation = outputPath + "/" +  config.ValidationOutput
    master_file = outputPath + "/" + "Master-Execution-Summary.csv"
    #set html file output
    patch_report_html = "{}/{}_{}.html".format(outputPath_validation,fileName,time_zone)
     
    #create os info dictionaries
    file_list = glob.glob('{}/*kernelcheck*.csv'.format(outputPath_postPatch))
    server_info = collections.defaultdict(dict) 
    for file in file_list:
    	data = pd.read_csv(file)
    	server=data["Hostname"][0]
    	server_info[server]["OSname"]=data["OSName"][0]
    	server_info[server]["CurKernel"]=data["Current Kernel Version"][0] 

    #check if the path is correct
    if os.path.exists(outputPath_validation):

        try:
            #Get patch data
            csv_file = glob.glob('{}/Patch-*.csv'.format(outputPath_validation))
            csv_file = ' '.join([str(elem) for elem in csv_file])
            data_csv = pd.read_csv(csv_file,na_values="")

            
            #get unique hostname list
            Host_list = data_csv.Hostname.unique()

            #overall table processing
            data_master = pd.read_csv(master_file)
            table_overall = []
            for host in Host_list:
                table_overall_dict = {}
                table_overall_dict['Server name'] = host
                if server_info.get(host):
                    table_overall_dict['OS Version'] = server_info.get(host).get('OSname')
                    table_overall_dict['Current Kernel Version'] = server_info.get(host).get('CurKernel')
                else:
                    table_overall_dict['OS Version'] = ""
                    table_overall_dict['Current Kernel Version'] = ""    

                filter1 = len(data_master[(data_master['HostName']==host) & (data_master['TaskName']=='Patching role') & (data_master['Result']=='Failed')])
                host_data = data_master[data_master['HostName']==host]
                filter2 = len(host_data[host_data['Result'].map(lambda x: x == 'Unreachable' or x =='Excluded' or x =='FAIL' or x=='Failed to execute')])
                if filter1 > 0:
                    table_overall_dict['Patching Status'] = "FAIL"
                elif filter2 > 0:
                    table_overall_dict['Patching Status'] = "FAIL"
                else: 
                    table_overall_dict['Patching Status'] = "PASS"

                table_overall.append(table_overall_dict)

            table_overall = pd.DataFrame(table_overall)
            table_overall = table_overall[['Server name','OS Version','Patching Status','Current Kernel Version']].sort_values('Server name',ascending=False)

            #create html
            old_width = pd.get_option('display.max_colwidth')
            pd.set_option('display.max_colwidth', -1)
            table_overall_html = table_overall.to_html(index=False)
            pd.set_option('display.max_colwidth', old_width)

            #validation table processing
            valid=data_csv[['Hostname','Check name','Result']]
            table_valid = valid.sort_values('Hostname',ascending=False)
            table_valid = table_valid.replace(np.nan, '', regex=True)
            table_valid = table_valid[table_valid['Result'] != 'INFO'] 

            table_valid_html = table_valid.to_html(index=False)
            table_valid_html = table_valid_html.replace("<td>All Checks</td>",'<td class="FailedService">All Checks</td>')
            table_valid_html = table_valid_html.replace("<td>Failed</td>","<td><img src={}></img></td>".format(NG[0]))
            table_valid_html = table_valid_html.replace("<td>PASS</td>","<td><img src={}></img></td>".format(OK[0]))
            table_valid_html = table_valid_html.replace("<td>FAIL</td>","<td><img src={}></img></td>".format(NG[0]))

            Patch_Report = style + title_1 + table_overall_html + title_2 + table_valid_html + Footer

            Html_file= open("{}".format(patch_report_html),"w")
            Html_file.write(Patch_Report)
            Html_file.close()
            
            #check smtp connection
            TestPortConnection(config.smtp_server, 25,logFilePath)

            #sending email
            fromaddr = config.fromAddress
            email_send = config.toAddress
            toaddr  = [item.replace(',','') for item in email_send]
            toadd_str = ", ".join(toaddr)
            msg = MIMEMultipart()

            msg['From'] = fromaddr
            msg['To'] = '{}'.format(toadd_str) #need to be in string
            msg['Subject'] = 'Patch Result - {} - {}'.format(config.account,config.technology)

            body = """
Hi

Please refer attached file for patch report.
            
From
Patch automation bot
            """

            msg.attach(MIMEText(body, 'plain'))

            filename = "{}_{}.html".format(fileName,time_zone)

            attachment = open(patch_report_html, "rb")
            
            part = MIMEBase('application', 'octet-stream')
            part.set_payload((attachment).read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', "attachment; filename= %s" % filename)

            msg.attach(part)

            server = smtplib.SMTP(config.smtp_server)
            text = msg.as_string()
	    
            
            server.sendmail(fromaddr, toaddr, text)
            print("Message sent")
            server.quit()

        except:
            e = sys.exc_info()[0]
            with open(logFilePath, "a") as logfile:
                logfile.write("{}: patch_report_html : Error : {}\n".format(time_zone,e))
            sys.exit()
            
    else:
        with open(logFilePath, "a") as logfile:
                logfile.write(time_zone+" :"+scriptname+": Error : "+outputPath_validation+" Path is Invalid \n")


if __name__== "__main__":

        #parsing yaml file from command line
        parser = argparse.ArgumentParser()
        parser.add_argument("-config","--ConfigFile", help="Configuration file path")
        args = parser.parse_args()
        yaml_file = args.ConfigFile
        report(yaml_file)

