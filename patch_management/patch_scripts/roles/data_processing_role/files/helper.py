def get_file_by_extension(folderpath,extension_type,checkname,subcheck_name):
    """This function will get all the file in the list and return
       all the file in the folder and also result with date strip from the
       filename.
       folderpath: folder where the output file reside
       extension_type: is the extension type of the file we want to grab ex: 'csv'
       checkname: is the Check_Name from yaml file
       subcheck_name: is the subcheck_name from yaml file
    """
    try:
    	print("Setting:",folderpath,extension_type,checkname,subcheck_name)
    	path = folderpath
    	extension = extension_type
    	os.chdir(path)
    	print(glob.glob('*-{}-{}-*.{}'.format(checkname,subcheck_name,extension)))
    	result = glob.glob('*-{}-{}-*.{}'.format(checkname,subcheck_name,extension))
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
    print(list1)
    print(list2)
    list_diff = list(list(set(list1)-set(list2)) + list(set(list2)-set(list1)))
    first_list = list(set(list1)-set(list2))
    second_list = list(set(list2)-set(list1))
    if len(list_diff) > 0:
        flag_diff = True
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
    print("df1 data:",df1)
    df2 = pd.read_csv(file2)
    print("df2 data:",df2)
    df1_list = df1[column_name]
    print("df1_list : ",df1_list)
    df2_list = df2[column_name]
    print("df2_list : ",df2_list)
    check_flag,list_diff,first_list,second_list = diff(df1_list,df2_list)
    
    return check_flag ,list_diff ,first_list ,second_list, df1_list,df2_list

def log(logFilePath,comment):
    """
    """
    with open(logFilePath, "a") as logfile:
            logfile.write(comment)
