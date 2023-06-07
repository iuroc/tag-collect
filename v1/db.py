import sqlite3, datetime
from sqlite3 import Connection, Cursor
from util import init_dir, make_err
from typing import List


def init_tables():
    '''初始化数据表'''
    cursor = get_db()
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS "collect" (
            "id" INTEGER NOT NULL,
	        "title" TEXT,
	        "url" TEXT,
	        "text" TEXT,
            "username" TEXT NOT NULL,
            "create_time" TEXT NOT NULL,
            "update_time" TEXT NOT NULL,
            PRIMARY KEY ("id" AUTOINCREMENT)
        )'''
    )
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS "tag" (
            "collect_id" INTEGER NOT NULL,
            "tag" TEXT NOT NULL,
            PRIMARY KEY ("collect_id", "tag")
        )'''
    )
    close_db(cursor)


def get_db() -> Cursor:
    '''获取数据库连接和游标'''
    init_dir('data')
    return sqlite3.connect('data/data.db').cursor()


def close_db(cursor: Cursor):
    cursor.close()
    cursor.connection.close()


def url_exists(cursor: Cursor, url: str) -> bool:
    '''判断 URL 是否存在于数据库收藏中'''
    cursor.execute('SELECT COUNT(*) FROM "collect" WHERE "url" = ?', (url,))
    return cursor.fetchone()[0] > 0


def insert_collect(cursor: Cursor, json_data: dict):
    '''插入收藏记录'''
    url = json_data['url'] if 'url' in json_data else None
    if url_exists(cursor, url):
        raise Exception('URL 已经存在，不能重复插入')
    title = json_data['title'] if 'title' in json_data else None
    text = json_data['text'] if 'text' in json_data else None
    tags = json_data['tags'] if 'tags' in json_data else None
    username = json_data['username'] if 'username' in json_data else None
    if not any((url, text)):
        raise Exception('URL 和文本不能同时为空')

    create_time = update_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute(
        'INSERT INTO "collect" ("title", "url", "text", "create_time", "update_time", "username") VALUES (?,?,?,?,?,?)',
        (title, url, text, create_time, update_time, username),
    )
    cursor.connection.commit()
    if not tags:
        tags = []
    if not isinstance(tags, list):
        raise Exception('标签数组类型错误')
    insert_tag_of_collect(cursor, tags)


def insert_tag_of_collect(cursor: Cursor, tags: List[str]):
    '''插入 tag 表'''
    sql = 'INSERT INTO "tag" ("collect_id", "tag") VALUES (?, ?)'
    data = []
    collect_id = cursor.lastrowid
    for tag in tags:
        data.append((collect_id, tag))
    try:
        cursor.executemany(sql, data)
        cursor.connection.commit()
    except Exception as e:
        raise Exception('数据库插入失败')


def get_recent_tag(cursor: Cursor, count: int = 30):
    '''获取最近使用的标签'''
    cursor.execute(f'SELECT "id" FROM "collect" ORDER BY update_time DESC LIMIT {count}')
    tag_list = []
    collect_id_list = cursor.fetchall()
    for row in collect_id_list:
        collect_id = row[0]
        cursor.execute(f'SELECT "tag" FROM "tag" WHERE "collect_id" = {collect_id}')
        tags = cursor.fetchall()
        for tag_row in tags:
            tag = tag_row[0]
            if tag not in tag_list:
                tag_list.append(tag)
    return tag_list
