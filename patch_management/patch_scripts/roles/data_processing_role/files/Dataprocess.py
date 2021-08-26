#!/usr/bin/python3.6
# -*- coding: utf-8 -*-
#Data-processing Script

#Author: Muhammad Nidzam
#email : muhammad-nidzam.bin-masood@dxc.com

import numpy as np
import pandas as pd
import os
from ruamel import yaml
import csv
import datetime
import glob
import operator
import sys
import argparse
import re
from config import configure
import difflib

#initializing config class by using configure class from config file
# yamlfile = "/root/Nidzam/ansible-patchmanagement/patch_managment_scripts/patch_script.yml"

def get_file_by_extension(folderpath,extension_type,checkname,subcheck_name,host):
    """This function will get all the file in the list and return
       all the file in the folder and also result with date strip from the
       filename.
       folderpath: folder where the output file reside
       extension_type: is the extension type of the file we want to grab ex: 'csv'
       checkname: is the DORM_Check_Name from yaml file
       subcheck_name: is the subcheck_name from yaml file
    """
    try:
    	path = folderpath
    	extension = extension_type
    	os.chdir(path)
    	result = glob.glob('{}-{}-{}-*.{}'.format(host,checkname,subcheck_name,extension))
    	result_without_date = [re.sub(r'-\d*-\d*\..*$','', filename) for filename in result]                
    	return result,result_without_date
    except:
        return "File not found"
	 

def diff(list1, list2):
    """
       This function will check between 2 list and output will be in bolean and 
       list differences. If between two list got differences, it will output Flag as
       True.
       check_flag: True if got differences between list else False
       list_diff: combanation of result for list differences 
       first_list: items in list are inside the first list but not in second list. Output is in list
       second_list: items in list are inside the second list but not in first list. Output is in list
    """
    list_diff = list(list(set(list1)-set(list2)) + list(set(list2)-set(list1)))
    first_list = list(set(list1)-set(list2))
    second_list = list(set(list2)-set(list1))
    if len(list_diff) > 0:
        flag_diff = True
    else:
        flag_diff = False
    return flag_diff,list_diff,first_list,second_list

def file_diff_csv(file1,file2,column_name):
    """
       This function will check between 2 specified csv file and compare list on the
       same column name on both file.If between two list got differences, it will output Flag as
       True.
       check_flag: True if got differences between list else False
       list_diff: combanation of result for list differences 
       first_list: items in list are inside the first list but not in second list. Output is in list
       second_list: items in list are inside the second list but not in first list. Output is in list
    """
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)
    df1_list = df1[column_name]
    df2_list = df2[column_name]
    check_flag,list_diff,first_list,second_list = diff(df1_list,df2_list)
    
    return check_flag ,list_diff ,first_list ,second_list, df1_list,df2_list

def get_data(file,outputPath_prePatch,outputPath_postPatch,extension_type,column_Name):
        """
        This function used to output data from file_diff_csv.
        It will convert result from list to string.
        servername: hostname from the file name
        scriptname: task name from the file name
        df1_list: output first_list from diff function in string format
        df2_list: output second_list from diff function in string format
        """
        servername = file.split("-")[0]
        scriptname = file.split("-")[2]
        file1 = glob.glob('{}/{}-*.{}'.format(outputPath_prePatch,file,extension_type))
        file1 = ' '.join([str(elem) for elem in file1])
        file2 = glob.glob('{}/{}-*.{}'.format(outputPath_postPatch,file,extension_type))
        file2 = ' '.join([str(elem) for elem in file2])
        flag_diff,list_diff,first_list,second_list,df1_list,df2_list = file_diff_csv(file1,file2,column_Name)

        first_list = ' '.join([str(elem) for elem in first_list])
        second_list = ' '.join([str(elem) for elem in second_list])
        df1_list = ' '.join([str(elem) for elem in df1_list])
        df2_list = ' '.join([str(elem) for elem in df2_list])

        return flag_diff,list_diff,first_list,second_list,df1_list,df2_list,servername,scriptname

def dict_update(hostname,check_name,file,file1,result):
        """
        This function is used to create a dict and populate the data using the argument.
        """
        new_dict = {}
        new_dict['Hostname'] = hostname
        new_dict['Check name'] = check_name
        new_dict['Pre-Sanity output file'] = file
        new_dict['Post-Sanity output file'] = file1
        new_dict['Result'] = result
        return new_dict

def dict_update_txt(hostname,check_name,file,file1,result):
        """
        This function is used to create a dict and populate the data using the argument.
        """
        text_dict = {}
        text_dict['Hostname'] = hostname
        text_dict['Check name'] = check_name
        text_dict['Pre-Sanity output file'] = file
        text_dict['Post-Sanity output file'] = file1
        text_dict['Result'] = result
        return text_dict

def file_diff_txt(file,outputPath_prePatch,outputPath_postPatch,extension_type="txt"):
        """
        This function is used to output the difference between two txt file.
        flag_diff = False if no data in list, True if there are data in the list
        str_diff_output = the diff command output in string
        """
        servername = file.split("-")[0]
        scriptname = file.split("-")[2]

        file1 = glob.glob('{}/{}-*.{}'.format(outputPath_prePatch,file,extension_type))
        file1 = ' '.join([str(elem) for elem in file1])
        file2 = glob.glob('{}/{}-*.{}'.format(outputPath_postPatch,file,extension_type))
        file2 = ' '.join([str(elem) for elem in file2])

        text1 = open(file1).readlines()
        text2 = open(file2).readlines()
        str_list= []
        for line in difflib.unified_diff(text1, text2):
                str_list.append(line)
        
        str_diff_output = ' '.join([elem for elem in str_list])

        if len(str_diff_output) == 0:
                flag_diff = False
        else:
                flag_diff = True 
        
        return flag_diff,str_diff_output,servername,scriptname

def server_list(path):
    os.chdir(path)
    server_list = []
    filenames = glob.glob("*.csv")
    for file in filenames:
        servername = file.split("-")[0]
        server_list.append(servername)

    new_list = list(set(server_list)) 
    return new_list


def data_processing(yaml_file):
        """
           This function will process csv file from PrePatch and PostPatch directory
           and do the file comparison based on rules specified
        """

        #get configuration variable from yaml file
        print("Yaml file: ",yaml_file)
        config=configure(yaml_file)

        #set variable for path
        outputPath = config.masterServer_outputpath + "/" + config.Patchoutput  + "/" + config.technology
        outputPath_prePatch = outputPath + "/" + config.PrePatchOutput
        outputPath_postPatch = outputPath + "/" + config.PostPatchOutput
        outputPath_validation = outputPath + "/" +  config.ValidationOutput
        master_file = outputPath + "/" + "Master-Execution-Summary.csv"
        logFilePath = '{}/Patch-Validation-{}-Logfile.log'.format(outputPath,config.technology)


        #check if outputPath_validation exist. If yes delete the file in the path, else create folder
        if os.path.exists(outputPath) and os.path.exists(outputPath_prePatch) and os.path.exists(outputPath_postPatch):
                print("Start processing")
                os.chdir(outputPath)
                if os.path.exists(outputPath_validation):
                        delPath=outputPath_validation+"\*"
                        r_file = glob.glob(delPath)
                        for i in r_file:
                                os.remove(i)
                else:
                        os.mkdir(outputPath_validation)

                #get script name
                scriptname=os.path.basename(sys.argv[0])
                scriptname=scriptname.split(".")[0]

                #read data from Master-Execution-Summary.csv
                df= pd.read_csv(master_file)

                #initialized list
                mylist=[]
                excludelist=[]

                #set date variable
                today=datetime.date.today()
                timeZone=today.strftime('%Y%m%d-%H%M')
                todaysDate =str(today).split()[0]
                
                #get excluded server list from Master-Execution-Summary.csv 
                excluded_server = df[df['Result'].map(lambda x: x == 'Unreachable' or x =='Excluded')]
                print(excluded_server)
                if not excluded_server.empty :
                        for index, row in excluded_server.iterrows():
                                new_dict={}
                                new_dict['Hostname']=row['HostName'] 
                                new_dict['Check name'] = "All Checks"
                                new_dict['Pre-Sanity output file'] = ""
                                new_dict['Post-Sanity output file'] = ""
                                new_dict['Result'] = row['Result'] 
                                excludelist.append(new_dict)
                
                #get failed server list from Master-Execution-Summary.csv 
                failed_server = df[df['Result'].map(lambda x: x == 'Failed' or x== 'Failed to execute')]
                print(failed_server)
                if not failed_server.empty :
                        for index, row in failed_server.iterrows():
                                new_dict={}
                                new_dict['Hostname']=row['HostName'] 
                                new_dict['Check name'] = "All Checks"
                                new_dict['Pre-Sanity output file'] = ""
                                new_dict['Post-Sanity output file'] = ""
                                new_dict['Result'] = row['Result'] 
                                excludelist.append(new_dict)

                # print("This is exclude list: " ,excludelist)
                #get variable for checklist
                result_list = []
                result_list_txt = []
                host_list = server_list(outputPath_prePatch)
                for host in host_list:
                        for check in config.checkList:
                                checkID = check['Check_Id']
                                checkname=check['Check_Name']
                                if checkID != 'NA' and checkID != None:
                                        subCheckList = check['Sub_Checks']
                                        for subcheck in subCheckList:
                                                subcheck_name = subcheck['Name']
                                                column_Name= subcheck['Column_Name']
                                                condition= subcheck['Condition']

                                                

                                                #txt file data processing
                                                extension_type = 'txt'
                                                prePatch_output_txt = get_file_by_extension(outputPath_prePatch,'txt',checkname,subcheck_name,host)
                                                postPatch_output_txt = get_file_by_extension(outputPath_postPatch,'txt',checkname,subcheck_name,host)
                                                diff_file_txt = diff(prePatch_output_txt[1], postPatch_output_txt[1])

                                                for file_date,file_date2,file,file1 in zip(prePatch_output_txt[0],postPatch_output_txt[0],prePatch_output_txt[1],postPatch_output_txt[1]):

                                                        flag_diff,str_diff_output,servername,scriptname = file_diff_txt(file,
                                                                                                outputPath_prePatch,
                                                                                                outputPath_postPatch,
                                                                                                extension_type)

                                                        file_date = outputPath_prePatch + "/" + file_date
                                                        file_date2 = outputPath_postPatch + "/" + file_date2

                                                        if not failed_server.empty :
                                                                if any(failed_server['HostName']==servername):
                                                                        continue
                                                        elif not excluded_server.empty:
                                                                if any(excluded_server['HostName']==servername):
                                                                        continue
        
                                                        if condition == 'info':
                                                                text_dict = dict_update_txt(servername,scriptname,file_date,file_date2,"INFO")
                                                                result_list_txt.append(text_dict)

                                                        else:
                                                                if flag_diff == False:
                                                                        text_dict = dict_update_txt(servername,scriptname,file_date,file_date2,"PASS")
                                                                else:
                                                                        text_dict = dict_update_txt(servername,scriptname,file_date,file_date2,"FAIL")
                                                                result_list_txt.append(text_dict)


                                                #csv file data processing
                                                extension_type = 'csv'
                                                prePatch_output = get_file_by_extension(outputPath_prePatch,'csv',checkname,subcheck_name,host)
                                                postPatch_output = get_file_by_extension(outputPath_postPatch,'csv',checkname,subcheck_name,host)
                                                diff_file = diff(prePatch_output[1], postPatch_output[1])


                                                for file_date,file_date2,file,file1 in zip(prePatch_output[0],postPatch_output[0],prePatch_output[1],postPatch_output[1]):
                                                        flag_diff,list_diff,first_list,second_list,df1_list,df2_list,servername,scriptname = get_data(file,
                                                                                                                                                        outputPath_prePatch,
                                                                                                                                                        outputPath_postPatch,
                                                                                                                                                        extension_type,
                                                                                                                                                        column_Name)

                                                        if not failed_server.empty :
                                                                if any(failed_server['HostName']==servername):
                                                                        continue
                                                        elif not excluded_server.empty:
                                                                if any(excluded_server['HostName']==servername):
                                                                        continue
                                                        
                                                        print("No")
                                                        file_date = outputPath_prePatch + "/" + file_date
                                                        file_date2 = outputPath_postPatch + "/" + file_date2
                                                        #start evaluation for each subcheck_name
                                                        if condition == 'match':
                                                                if flag_diff == False:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"PASS")
                                                                else:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"FAIL")
                                                                result_list.append(new_dict)

                                                        elif condition == 'notmatch':
                                                                if flag_diff == False:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"FAIL")
                                                                else:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"PASS")
                                                                result_list.append(new_dict)

                                                        elif condition == 'eq':
                                                                if flag_diff == False:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"PASS")
                                                                else:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"FAIL")                                                       
                                                                result_list.append(new_dict)

                                                        elif condition == 'ne':
                                                                if flag_diff == False:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"FAIL")
                                                                else:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"PASS")                                                     
                                                                result_list.append(new_dict)

                                                        elif condition == 'lt':
                                                                if int(df2_list) < int(df1_list):
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"PASS")
                                                                else:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"FAIL")                                                       
                                                                result_list.append(new_dict)

                                                        elif condition == 'gt':
                                                                if int(df2_list) > int(df1_list):
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"PASS")
                                                                else:
                                                                        new_dict = dict_update(servername,scriptname,file_date,file_date2,"FAIL")                                                       
                                                                result_list.append(new_dict)

                                                        elif condition == 'info':
                                                                new_dict = dict_update(servername,scriptname,file_date,file_date2,"INFO")
                                                                result_list.append(new_dict)

                                else:
                                        with open(logFilePath, "a") as logfile:
                                                logfile.write(timeZone+" :"+scriptname+": Info : CheckID for "+checkname+" is empty. Hence Skipping the check \n")


                result_list = pd.DataFrame(result_list,columns=['Hostname', 'Check name', 'Pre-Sanity output file', 'Post-Sanity output file','Result' ])
                result_list2 = pd.DataFrame(excludelist,columns=['Hostname', 'Check name', 'Pre-Sanity output file', 'Post-Sanity output file','Result' ])
                
                result_list_txt = pd.DataFrame(result_list_txt,columns=['Hostname', 'Check name','Pre-Sanity output file', 'Post-Sanity output file','Result' ])                               
                
                result_list = result_list.append(result_list2, ignore_index=True)
                result_list = result_list.append(result_list_txt, ignore_index=True)
                result_list.to_csv( outputPath_validation + "/" + checkname+ "-"  + timeZone + ".csv", index=False, encoding='utf-8-sig')

        
                print("File output to: "+outputPath_validation + "/" + checkname+ "-"  + timeZone + ".csv")


                                       
        else:
                print("No folder found")
                with open(logFilePath, "a") as logfile:
                        logfile.write(timeZone+" :"+scriptname+": Error : "+config.outputPath+" Path is Invalid \n")

if __name__== "__main__":

        #parsing yaml file from command line
        parser = argparse.ArgumentParser()
        parser.add_argument("-config","--ConfigFile", help="Configuration file path")
        args = parser.parse_args()
        yaml_file = args.ConfigFile
        data_processing(yaml_file)

