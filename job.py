import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="09112013"
)
mycursor = mydb.cursor()
'''for i in range(11):
    sql = "UPDATE sbr_groups_sub_qn_models_aux SET address = 'Canyon 123' WHERE address = 'Valley 345'"
    mycursor.execute(sql)
'''
mycursor.execute('SELECT aux.id as value FROM site.sbr_groups_sub_qn_models_aux aux ORDER BY aux.id_sbr_groups_sub_qn ASC')

result = mycursor.fetchall()
'''for i in range(10, -1, -1):
    print(i)

'''
count = 10
for j in result:
    sql = "UPDATE site.sbr_groups_sub_qn_models_aux aux SET aux.value = %i WHERE id = %i" %(count,j[0])
    mycursor.execute(sql)
    mydb.commit()
    count = count - 1
    if count < 0:
        count = 10