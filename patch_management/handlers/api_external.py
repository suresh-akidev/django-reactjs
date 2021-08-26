import requests
import pandas as pd
from requests.auth import HTTPDigestAuth
from datetime import datetime
from .hvac_request import call_hvac
from .time_convert import time_convert

class SnowChange:    
        def __init__(self,instance_name,change_number,zone_to_convert):
            """
            This class will call service now api to get specific change record details from designated api instance
            (Planned Start Time,Planned end time, Approval status and Change number)
            instance_name: example https://dev69388.service-now.com
            change_number: chnage number you want to find the details
            user: your instance user name
            pwd: your instance password
            zone_to_convert = local time region you want to display ex: 'Asia/Kuala_Lumpur'

            To use the class, first import it
            from api_call import SnowChange

            Assign variable to the function
            Ex:
                SNOW = SnowChange("https://dev69388.service-now.com","CHG0000096","Admin","ZAQ!2wsx")
            
            To view the output of object
            Ex:
                print(SNOW.change_id)
            """
            path = 'servicenow'
            mount_point = 'opstool'
            user = call_hvac(path,mount_point,'username')
            pwd = call_hvac(path,mount_point,'password')

            # Set the request parameters #sysparm_display_value = false 
            url = '{}/api/now/table/change_request?sysparm_query=number={}&sysparm_fields=number%2Cstart_date%2Cend_date%2Capproval&sysparm_limit=1'.format(instance_name,change_number)
            # Set proper headers
            headers = {"Content-Type":"application/json","Accept":"application/json"}
            # Do the HTTP request
            response = requests.get(url, auth=(user, pwd), headers=headers )
            # Check for HTTP codes other than 200
            if response.status_code != 200: 
                print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
                exit()

            # Decode the JSON response into a dictionary and use the data
            df = response.json()
            if len(df['result']) > 0:
                data = df['result'][0]
                change_id =data.get("number")
                start_date = data.get("start_date")
                end_date = data.get("end_date")
                approval =data.get("approval")
                change_status = ""

                if change_id:
                    pass
                else:
                    change_status = "not found"

                if approval:
                    if approval == "approved":
                        change_status=approval
                    else:
                        change_status = "found with approval status: "+approval          

                if start_date and end_date:
                    formatedStartDate = time_convert(start_date,zone_to_convert)
                    formatedEndDate = time_convert(end_date,zone_to_convert)
                elif start_date:
                    formatedStartDate = time_convert(start_date,zone_to_convert)
                    formatedEndDate = ""
                    change_status += ". Date is not updated"
                elif end_date:
                    formatedEndDate = time_convert(end_date,zone_to_convert)
                    formatedStartDate = ""
                    change_status += ". Date is not updated"
                else:                    
                    formatedEndDate = ""
                    formatedStartDate = ""
                    change_status += ". Date is not updated"              
                
            else:
                change_status = "not found"
                change_id = ""
                formatedStartDate = ""
                formatedEndDate = ""
           
            self.data={
                    'change': change_status,
                    'change_no': change_id,
                    'planned_startdate': formatedStartDate,
                    'planned_enddate': formatedEndDate,
                    'actual_startdate': formatedStartDate,
                    'actual_enddate': formatedEndDate,
                    'patch_id': ""
                    }

def Solarwind_NodeID(servername,sysname):
        """
        servername: master server name. Ex - https://172.16.72.91:17778
        sysname: system name that you want to check
        user: user name
        pwd: user password
        """
        path = 'solarwinds/{}'.format(servername)
        mount_point = 'opstool'
        user = call_hvac(path,mount_point,'username')
        pwd = call_hvac(path,mount_point,'password')
        #get nodes
        url = '{}/SolarWinds/InformationService/v3/Json/Query?query=SELECT+NodeID+FROM+Orion.Nodes+WHERE+SysName={}'.format(servername,sysname)
        headers = {"Content-Type":"application/json","Accept":"application/json"}
        # Do the HTTP request
        response = requests.get(url, auth=(user, pwd), headers=headers )
        # Check for HTTP codes other than 200
        if response.status_code != 200: 
            print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
            exit()
        df = response.json()
        df = pd.DataFrame(df['result']) 
        NodeID = df.NodeID           
        return NodeID

def Solarwind_AlertSuppression_State(servername,node):
        """
        servername: master server name. Ex - https://172.16.72.91:17778
        sysname: system name that you want to check
        node:node need to be in list structure 
            ex ["swis://SCCVPBLRMGT34.SBICMPC.internal/Orion/Orion.Nodes/NodeID=1065"​]
        user: user name
        pwd: user password
        """
        path = 'solarwinds/{}'.format(servername)
        mount_point = 'opstool'
        user = call_hvac(path,mount_point,'username')
        pwd = call_hvac(path,mount_point,'password')
        #get nodes
        url = '{}/SolarWinds/InformationService/v3/Json/Invoke/Orion.AlertSuppression/GetAlertSuppressionState​'.format(servername)
        headers = {"Content-Type":"application/json","Accept":"application/json"}
        payload = {"entityUris":node}
        # Do the HTTP request
        response = requests.post(url, auth=(user, pwd), headers=headers ,data=payload)
        # Check for HTTP codes other than 200
        if response.status_code != 200: 
            print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
            exit()
        df = response.json()
        SuppressionMode = df.get('SuppressionMode')         
        return SuppressionMode


def Solarwind_Set_SuppressAlerts(servername,node,suppressFrom,suppressUntil):
        """
        servername: master server name
        node:node need to be in list structure 
            ex ["swis://SCCVPBLRMGT34.SBICMPC.internal/Orion/Orion.Nodes/NodeID=1065"​]
        suppressFrom: ex "2020-10-05T06:38:12.344Z"
        suppressUntil: ex "2020-10-05T06:38:12.344Z"
        user: user name
        pwd: user password
        """
        path = 'solarwinds/{}'.format(servername)
        mount_point = 'opstool'
        user = call_hvac(path,mount_point,'username')
        pwd = call_hvac(path,mount_point,'password')
        SuppressionMode = Solarwind_AlertSuppression_State(servername,node)
        if SuppressionMode == 0:

            url = '{}/SolarWinds/InformationService/v3/Json/Invoke/Orion.AlertSuppression/SuppressAlerts​'.format(servername)
            headers = {"Content-Type":"application/json","Accept":"application/json"}
            payload = {"entityUris": node, "suppressFrom": suppressFrom,"suppressUntil": suppressUntil}
            # Do the HTTP request
            response = requests.get(url, auth=(user, pwd), headers=headers,data=payload )
            # Check for HTTP codes other than 200
            if response.status_code != 200: 
                print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
                exit()
            else:
                return response.status_code
        else:
            print("SuppressionMode not set")


def Solarwind_AlertSuppression_ResumeAlerts(servername,node):
        """
        servername:
        node:node need to be in list structure 
            ex ["swis://SCCVPBLRMGT34.SBICMPC.internal/Orion/Orion.Nodes/NodeID=1065"​]
        user: user name
        pwd: user password
        """
        path = 'solarwinds/{}'.format(servername)
        mount_point = 'opstool'
        user = call_hvac(path,mount_point,'username')
        pwd = call_hvac(path,mount_point,'password')
        #resume alerts
        url = '{}/SolarWinds/InformationService/v3/Json/Invoke/Orion.AlertSuppression/ResumeAlerts​'.format(servername)
        headers = {"Content-Type":"application/json","Accept":"application/json"}
        payload = {"entityUris":node}
        # Do the HTTP request
        response = requests.post(url, auth=(user, pwd), headers=headers ,data=payload)
        # Check for HTTP codes other than 200
        if response.status_code != 200: 
            print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
            exit()
        else:
            return response.status_code


def NetBackUp_login(servername,user,pwd):
        """
        servername: backup server, ex "https://<backupserver>"
        user: user name
        pwd: user password
        """

        url = '{}:1556/netbackup/login​​'.format(servername)
        headers = {"Content-Type":"application/json","Accept":"application/json"}
        payload = {"userName":user,"password":pwd}
        # Do the HTTP request
        response = requests.post(url, headers=headers ,data=payload)
        # Check for HTTP codes other than 200
        if response.status_code != 200: 
            print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
            exit()
 
        df = response.json()
        token = df.get('token')
        return token

def NetBackUp_check_job(servername,node,state,startTime):
        """
        servername: backup server, ex "https://<backupserver>"
        node: servername that you want to check
        state: ex 'DONE'
        startTime: job started greater than startTime. Ex '2020-10-29T00:00:00.000Z'
        user: user name
        pwd: user password

        return backup_Flag
        If meta/count: 0, raise a flag that patching cannot proceed for this server as backups are not available.​ backup_Flag set to FAIL
        If meta/count: gt 0, proceed with patching for this server. backup_Flag set to PASS
        """ 
        path = 'netbackup/{}'.format(servername)
        mount_point = 'opstool'
        user = call_hvac(path,mount_point,'username')
        pwd = call_hvac(path,mount_point,'password')
        url = '{}:1556/netbackup/admin/jobs?filter=clientName eq {} and state eq {} and startTime ge {}'.format(servername,node,state,startTime)
        token = NetBackUp_login(servername,user,pwd)   
        response = requests.get(url, Authorization=token, headers=headers)
        # Check for HTTP codes other than 200
        if response.status_code != 200: 
            print('Status:', response.status_code, 'Headers:', response.headers, 'Error Response:',response.json())
            exit()
 
        df = response.json()
        meta_count = df.get('meta').get('count')
        if meta_count == 0:
            backup_Flag = 'FAIL'
        elif meta_count > 0:
            backup_Flag = 'PASS'
        #backup_Flag as pass or fail
        return backup_Flag