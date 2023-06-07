### MyPages 数据库迁移本数据库


import pymysql, sqlite3, datetime, json
from db import insert_collect, get_db
from app import init_tables, init_dir


def get_source():
    conn = pymysql.connect(
        host='localhost', user='root', passwd='12345678', db='ponconsoft'
    )
    cursor = conn.cursor()
    sql = 'select title, url, note, username, tag_list from `mypages_collect`'
    cursor.execute(sql)
    result = cursor.fetchall()
    return cursor, result


def get_sqlite():
    init_dir('data')
    init_tables()
    return get_db()


mysql_cursor, source = get_source()
sqlite_cursor = get_sqlite()
insert_sql = 'INSERT INTO "collect" ("title", "url", "text", "username", "create_time", "update_time") VALUES (?,?,?,?,?,?)'
create_time = update_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
for i in source:
    json_data = {
        'title': i[0],
        'url': i[1],
        'text': i[2],
        'username': i[3],
        'tags': json.loads(i[4]),
    }
    insert_collect(sqlite_cursor, json_data)
sqlite_cursor.close()
sqlite_cursor.connection.close()
