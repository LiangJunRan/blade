#! /bin/bash

# 批量下载，转换，结构化输出文件
urlList="urlList.txt"
pathIn="pathIn"
pathOut="pathOut"

sudo rm -rf $pathIn
sudo rm -rf $pathOut
mkdir $pathIn
mkdir $pathOut

# 从list文件中逐行取出url，循环直到结束
for url in `cat $urlList`
do
	# 每个url正则取到路径，在path_in, path_out下生成该路径
	subPath=`echo $url | sed 's/http:\/\/[^\/]*\///' | sed 's/\/[^\/]*$//'`
	
	mkdir -p $pathIn/$subPath
	mkdir -p $pathOut/$subPath
	
	# 在这个路径下下载文件
	wget -P $pathIn/$subPath $url

	# ffmpeg处理这个文件，生成到path_out对应路径下去
	fn=`echo $url | sed 's/[^\/]*\///g'`
	
	echo "=========================="
	echo "url:       $url"
	echo "subPath:   $subPath"
	echo "filename:  $fn"
	echo "--------------------------"
	
	ffmpeg -i "concat:$pathIn/$subPath/$fn" -c:v copy -ab 128k -y $pathOut/$subPath/$fn
done
