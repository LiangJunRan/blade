#! /bin/bash

# 使用ffmepg转换音频，指定输出名称，指定码率
ffmpeg -i "concat:TPO-1356.mp3" -c:v copy -ab 128k -y TPO-1356_128.mp3





	

#! /bin/bash

# 批量从path_in输出到path_out中去
path_in=./path_in
path_out=./path_out
for f in $path_in/*
do
    fn=`basename $f`
    ffmpeg -i "concat:$path_in/$fn" -c:v copy -ab 128k -y $path_out/$fn
done


	

#! /bin/bash

# 批量下载，转换，结构化输出文件
urlList="./urlList.txt"
pathIn="./pathIn"
pathOut="./pathOut"

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



