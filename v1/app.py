import sqlite3, os, requests, re, json
from flask import Flask, render_template, request
from util import init_dir, make_res, make_err
from db import get_db, close_db, init_tables, insert_collect, get_recent_tag
from urllib.parse import urlparse

app = Flask(__name__)
# 初始化创建文件夹
init_dir('data')
init_tables()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/add', methods=['POST'])
def add():
    cursor = get_db()
    json_data = request.get_json()
    try:
        insert_collect(cursor, json_data)
    except Exception as e:
        return make_err(str(e))
    close_db(cursor)
    return make_res('新增成功')


@app.route('/api/get_title')
def get_title():
    url = request.args.get('url')
    if not url:
        return make_err('请输入 URL')
    parsed_url = urlparse(url)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        return make_err('URL 格式不正确')
    headers = {
        'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35',
        'Referer': f'{parsed_url.scheme}://{parsed_url.hostname}',
    }
    r = requests.get(url, headers=headers)
    r.encoding = 'utf-8'
    title = re.search(r'<title.*?>(.*?)</title>', r.text, re.DOTALL)
    if title:
        title = title.group(1)
    else:
        title = (
            re.sub(r'^www\.|(\.[^.]*)$', '', parsed_url.hostname)
            .replace('.', ' ')
            .title()
        )
    return title


@app.route('/api/tag_list')
def tag_list():
    cursor = get_db()
    cursor.execute('SELECT "tag" FROM "tag"')
    result = cursor.fetchall()
    tag_list = {}
    for row in result:
        tag = row[0]
        if tag in tag_list:
            tag_list[tag] += 1
        else:
            tag_list[tag] = 1
    tag_list = sorted(tag_list.items(), key=lambda x: x[1], reverse=True)
    recent_tag_list = get_recent_tag(cursor, 10)
    close_db(cursor)
    return make_res('获取成功', {'all': tag_list, 'recent': recent_tag_list})


@app.route('/api/recent_tag_list')
def new_tag_list():
    '''最近使用过的标签'''
    cursor = get_db()
    tag_list = get_recent_tag(cursor, 30)
    close_db(cursor)
    return make_res('获取成功', tag_list)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
