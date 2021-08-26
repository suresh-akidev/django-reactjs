import hvac
import os
import sys


def call_hvac(path,mount_point,var):
    """
    vault_token: vault token
    path: path of vault ex:aix
    mount_point: mounting point inside hvac vault ex:opstool
    var: the keyword for data you want to retrieved from hashi vault
    *** if the keyword not in the hashi vault, response will return as None

    #usage example:
    path = 'aix'
    mount_point = 'opstool'
    username = call_hvac(path,mount_point,'password')

    """
    # Get environment variables
    vault_token = os.getenv('VAULT_TOKEN')
    vault_path = os.getenv('VAULT_ADDR')

    if vault_token == None or vault_path == None:
        print("VAULT_TOKEN or VAULT_ADDR value is None")
        sys.exit()

    client = hvac.Client(url=vault_path,token=vault_token)
    if client.is_authenticated() and client.sys.is_initialized():
            read_response=client.secrets.kv.read_secret_version(path=path,mount_point=mount_point)
            value = read_response.get('data').get('data').get(var)
            if value:
                value=value.encode(encoding='UTF-8',errors='strict')
                return value.decode("utf-8")   
    else:
        print("HVAC,Hashicorp client not authenticated")
        sys.exit()

