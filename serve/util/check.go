package util

import (
	"crypto/rand"
	"encoding/base64"
	"regexp"
)

// 正则校验邮箱地址格式
func CheckEmail(email string) bool {
	pattern := `^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	regex := regexp.MustCompile(pattern)
	return regex.MatchString(email)
}

// 生成 Token 字符串
func MakeToken(tokenLength int) string {
	randomBytes := make([]byte, tokenLength)
	rand.Read(randomBytes)
	token := base64.URLEncoding.EncodeToString(randomBytes)
	return token
}
