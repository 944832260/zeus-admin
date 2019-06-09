package service

import (
	"crypto/rand"
	"fmt"
	"golang.org/x/crypto/scrypt"
	"io"
	"zeus/pkg/api/dao"
	"zeus/pkg/api/dto"
	"zeus/pkg/api/log"
	"zeus/pkg/api/model"
)

const pwHashBytes = 64
var userDao = dao.User{}
type AccountService struct {
}

func (as AccountService) VerifyAndReturnUserInfo(dto dto.LoginDto) (bool, model.User) {
	userModel := userDao.GetByUserName(dto.Username)
	if pwd, err := as.hashPassword(dto.Password, userModel.Salt); err == nil && pwd == userModel.Password {
		return true, userModel
	}
	return false, model.User{}
}
func (as AccountService) Create(dto dto.UserCreateDto) model.User{
	salt,_ := as.makeSalt()
	pwd,_ := as.hashPassword(dto.Password, salt)
	userModel := model.User{
		Username:dto.Username,
		Mobile:dto.Mobile,
		Password:pwd,
		DepartmentId:dto.DepartmentId,
		Salt:salt,
	}
	c := userDao.Create(&userModel)
	if c.Error != nil {
		log.Error(c.Error.Error())
	}
	return userModel
}

func (as AccountService) makeSalt() (salt string, err error) {
	buf := make([]byte, pwHashBytes)
	if _, err := io.ReadFull(rand.Reader, buf); err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", buf), nil
}

func (as AccountService) hashPassword(password string, salt string) (hash string, err error) {
	h, err := scrypt.Key([]byte(password), []byte(salt), 16384, 8, 1, pwHashBytes)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", h), nil
}