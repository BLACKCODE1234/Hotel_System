from database.db import database_connection



def user_account_check(email: str):
    database = database_connection()
    cursor = database.cursor()
    cursor.execute("select 1 from users where email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    database.close()
    return user




def get_user_by_email(email: str):
    database = database_connection()
    cursor = database.cursor()
    cursor.execute(
        "select username, email, password from users where email = %s",
        (email,),
    )
    user = cursor.fetchone()
    cursor.close()
    database.close()
    return user



def create_user(username: str, email: str, password: str):
    database = database_connection()
    cursor = database.cursor()
    cursor.execute("""
        insert into users (username,email,password) 
        values (%s, %s, %s)
        """, 
        (username, email, password))
    
    database.commit()
    cursor.close()
    database.close()