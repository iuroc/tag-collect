package util

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

// Ajax 请求函数选项
type AjaxOption struct {
	// 请求地址
	Url string
	// 请求方式
	Method string
	// POST 数据
	Data string
	// 请求头
	Header map[string]string
}

// Ajax 请求函数
func Ajax(ajaxOption AjaxOption, client *http.Client) (string, error) {
	// 获取请求方法并将其转换为大写，默认为 GET
	method := strings.ToUpper(ajaxOption.Method)
	if method == "" {
		method = "GET"
	}

	url := ajaxOption.Url
	data := ajaxOption.Data
	header := ajaxOption.Header

	// 创建包含请求数据的字符串读取器
	payload := strings.NewReader(data)

	// 创建 HTTP 请求
	request, err := http.NewRequest(method, url, payload)
	if err != nil {
		return "", err
	}

	// 设置请求头
	for key, value := range header {
		request.Header.Set(key, value)
	}

	// 发送 HTTP 请求并获取响应
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	// 读取响应体
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

type ResOption struct {
	Code int
	Msg  string
	Data interface{}
}

func MakeRes(code int, msg string, data interface{}) (string, error) {
	jsonBytes, _ := json.Marshal(struct {
		Code int         `json:"code"`
		Msg  string      `json:"msg"`
		Data interface{} `json:"data"`
	}{
		Code: code,
		Msg:  msg,
		Data: data,
	})
	jsonStr := string(jsonBytes)
	return jsonStr, nil
}

func MakeSuc(msg string, data interface{}) []byte {
	str, _ := MakeRes(200, msg, data)
	return []byte(str)
}

func MakeErr(msg string) []byte {
	str, _ := MakeRes(0, msg, nil)
	return []byte(str)
}
