##########################################################################
#Author: Muhammad Nidzam Maso'od
#Email: muhammad-nidzam.bin-masood@dxc.com
#This file contained configure class to be used in the main.py
##########################################################################

import yaml
from datetime import datetime 
import pytz
import os
import socket

#this function read variables from yaml configuration file. If new variable
#added to the yaml configuration file, it needed to be updated here.
class configure:
        def __init__(self,filename):
                now_utc   = datetime.now(pytz.utc)
                now = datetime.now()
                timestamp_utc = now_utc.strftime("%Y-%m-%d %H:%M:%S")
                timestamp_file = now.strftime("%Y%m%d")
                with open(filename,'r') as f:
                        for data in yaml.safe_load_all(f):
                                #print(data.keys())
                                self.technology =  data.get('Technology')
                                self.timestamp = timestamp_utc
                                self.timestamp_file = timestamp_file
                                self.config_version = data.get('Version')
                                self.script_version = data.get('Version')
                                self.account = data.get('Account_Name')
                                self.checkList = data.get('Patch_Checks')
                                self.masterServer_outputpath = data.get('Output').get('Path').get('Master_Server_Output_path')
                                self.remoteServer_output_path = data.get('Output').get('Path').get('Remote_Server_output_path')
                                self.server_List = data.get('Inventory').get('Inventory_List')
                                # self.consolidation_counter = data.get('Mail').get('Consolidation_Counter')
                                # self.test_mode = data.get('Mail').get('Test_Mode')
                                # self.secure_Mode = data.get('Mail').get('Secure_Mode').get('value')
                                # self.secure_Mode_string = data.get('Mail').get('Secure_Mode').get('Classification_Text')
                                self.scriptName = os.path.splitext(os.path.basename(__file__))[0]
                                self.connectivity_method =  data.get('Inventory').get('Connectivity_Method')
                                self.jump_Station  = socket.getfqdn()
                                self.Patchoutput = data.get('Patchoutput')
                                self.PrePatchOutput = data.get('PrePatchOutput')
                                self.PostPatchOutput = data.get('PostPatchOutput')
                                self.ValidationOutput = data.get('ValidationOutput')
                                self.outputPath = data.get('Output').get('Path').get('Master_Server_Output_path')+ self.Patchoutput + self.technology
                                self.output_summary = self.outputPath + "/"  + "Master-Execution-Summary.csv"
