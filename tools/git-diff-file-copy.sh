#!/bin/bash

# 配置以下参数
OLD_COMMIT="e8ed4148c2460c79affd8e8ef3ca93b5d35cd38e"
NEW_COMMIT="b835977552707aa28cc4588a068afeb58e1b2097"
NEW_FILE_FOLDER_NAME="diffiles"

mkdir ${NEW_FILE_FOLDER_NAME}
cp -pv --parents `git diff ${OLD_COMMIT} ${NEW_COMMIT} --name-only` ${NEW_FILE_FOLDER_NAME}

echo -e '\n-------------------------------------------------------\nThe structured files is copy to ./'${NEW_FILE_FOLDER_NAME}', done'
