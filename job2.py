import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="09112013"
)
mycursor = mydb.cursor()
mycursor.execute('SELECT ans.id_sbr_groups_sub_qn_models_aux as value FROM site.sbr_groups_sub_qn_answers ans')
result = mycursor.fetchall()

count = 10
for j in result:
    if(j[0]%11 == 0):
        print(j[0])