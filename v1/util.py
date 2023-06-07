import os, json, re
from typing import Union, List, Any


def init_dir(paths: Union[str, List[str]]):
    '''初始化创建文件夹'''
    if isinstance(paths, str):
        paths = [paths]
    for path in paths:
        if not os.path.exists(path):
            os.mkdir(path)


def make_res(msg: str = '操作成功', data: Any = None, code: int = 200) -> dict:
    '''生成 HTTP API 响应数据'''
    return {'code': code, 'msg': msg, 'data': data}


def make_err(msg: str = '错误', code: int = 0) -> dict:
    '''生成异常响应数据'''
    return make_res(msg, None, code)
