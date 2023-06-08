package util

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
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

func MakeToken(tokenLength int) (string, error) {
	randomBytes := make([]byte, tokenLength)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}
	token := base64.URLEncoding.EncodeToString(randomBytes)
	return token, nil
}
