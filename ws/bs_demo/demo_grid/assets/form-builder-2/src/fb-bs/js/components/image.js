;(function (factory) {
    'use strict';
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(['jquery'], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    $.formb = $.formb || {};

    $.formb.components = $.formb.components || {};
    var baseComponent = $.formb.baseComponent;

    var component_image = function(args) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'f7-icon': 'camera'
        };
        baseComponent.apply(this, arguments);	// 执行基类的初始化

        var that = this;

        this.template =
            '<div class="component">' +
            '<input type="hidden" name="{name}" />' +
            '<div class="thumbnails-container">' +
            '</div>' +
            '<div class="help-block-error"></div>'+
            '</div>';

        this.addTemplate =
            '<span class="button thumbnail add fake-file-btn">' +
            '<i class="fa fa-plus"></i>' +
            '<input class="ignore" id="{id}" type="file"  ' +
            'accept="image/x-png, image/gif, image/jpeg, image/bmp">' +
            '</span>';


        this.thumbnailTemplate =
            '<div class="thumbnail coreInput">' +
            '<div class="delete">' +
            '<i>&times;</i>' +
            '</div>' +
            '<a class="openPhotoBrowser" href="javascript:void(0);">' +
            '<div class="image-container">' +
            '<img src="{url}" onerror="onerror=null; src=\'/assets/fw7/img/error.jpg\'"/>' +
            '</div>' +
            '</a>' +
            '</div>';

        this.waitingTemplate =
            '<div class="thumbnail waiting">' +
            '<div class="delete">' +
            '<i>&times;</i>' +
            '</div>' +
            '<div class="help">' +
            '<i class="fa fa-spinner fa-spin fa-pulse fa-3x fa-fw"></i>' +
            '</div>' +
            '</div>';


        //绑定添加图片按钮id
        //确保唯一性，如果多个id重复的情况需要重新定义
        var add_id = this.opts.name + "_add";
        //绑定上传序号，自增变量，与max无关
        var index = 0;

        function _bindDelete($obj) {
            $obj.find('.delete').on('click', function(e) {
                var $delBtn = $(e.target).closest('.delete');
                // 先定位到addBtn，然后再删掉delBtn对应的缩略图
                var $addBtn = $delBtn.closest('.thumbnails-container').find('.add');
                $delBtn.closest('.thumbnail').remove();

                $addBtn.trigger('changeShowHide');
                var $node = $addBtn.closest('.component');

                // 更新已存值
                var imageData = {
                    formId: $node.closest('form').attr('id'),
                    name: that.opts.name
                };
                _updateImageItemUrls(imageData);
            });
        }
        // 更新指定的表单项的值
        function _updateImageItemUrls(data) {
            var $input = $('form#{formId} input[name={name}]'.format(data));
            var $node = $input.closest('.component');
            var urlList = [];
            var $imgs = $node.find('img');
            $.each($imgs || {}, function(idx) {
                urlList.push($imgs[idx].getAttribute('src'));
            });
            if (urlList.length > 0) {
                $input.val('images:[' + urlList.join(',') + ']');
            } else {
                $input.val('');
            }
        }
        this.__render = function() {
            this.$node = $(this.template.format(this.opts));


            var $add = $(this.addTemplate.format({id:add_id}));
            this.$node.find('.thumbnails-container').append($add);
            this.$node.find('input[name={name}]'.format({name:that.opts.name})).on('change', function(e) {
                var value = e.target.value;
                that.setValue(value);
                $(this).trigger('keyup');
            });

            $add.on('changeShowHide',function() {
                var current = $(this).closest('.thumbnails-container').find('.thumbnail:not(.add)').length;
                if (current >= that.opts.maxNumber) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });

            if(!that.opts.isRead){
                // sb七牛云必须加载到页面后的dom才能初始化
                setTimeout(function() {
                    _bindUpload(that.$node);
                },500);
                $add.css('display','inline-block');
                // $add.show();
            } else {
                $add.css('display','none')
                // $add.hide();
            }

        }


        this.__setValue = function(value) {
            console.log('image / this.__setValue(' + value + ')');
            this.$node.find('input[name={name}]'.format({name:that.opts.name})).val(value);

            var urlList;
            if (value.match(/images:\[(.*)\]/) && value.match(/images:\[(.*)\]/).length > 0) {
                urlList = value.match(/images:\[(.*)\]/)[1].split(',');
            } else {
                urlList = [];
            }

            $.each(urlList, function(idx) {
                var $item = $(that.thumbnailTemplate.format({url: urlList[idx]}));
                if(that.opts.isRead) {
                    $item.find('.delete').hide();
                }
                _bindDelete($item);

                // 绑定点击弹出
                $item.find('.image-container').bindPopup();

                var $container = that.$node.find('.thumbnails-container');
                var $addBtn = $container.find('.thumbnail.add');
                $addBtn.before($item);
            });
            if(urlList.length == 0) {
                that.$node.attr('hidden',true);
            } else {
                that.$node.removeAttr('hidden');

            }

        }

        /**
         * 绑定七牛云上传事件 ，需要$node
         * @private
         */
        function _bindUpload ($node) {

            var uploader = Qiniu.uploader({
                // runtimes: 'html5,flash,html4',	//上传模式,依次退化
                browse_button: add_id,			//上传选择的点选按钮，**必需**

                // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                // uptoken_url: '/token',			//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）

                uptoken : 'pBwzxNPBDAAD9cJaND2xh3TkgtTilQERWHSByAQ_:9CNVM9IegER_FjIbGKw3qcjTvIQ=:eyJzY29wZSI6ImJwbXRlc3QiLCJkZWFkbGluZSI6MTU0OTIxNTMxNX0=',			//若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成

                filters : {
                    mime_types:[{title : "Image files", extensions : "jpg,jpeg,png,bmp"}]
                },
                // unique_names: true,				// 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                // save_key: true,   				// 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                domain: 'http://olt0d7mfp.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,				//设置上传文件的时候是否每次都重新获取新的token
                // container: 'container',			//上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb',				//最大文件体积限制
                // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                max_retries: 3,						//上传失败最大重试次数
                // dragdrop: true,					//开启可拖曳上传
                // drop_element: 'container',		//拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',					//分块上传时，每片的体积
                auto_start: true,					//选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                            console.log('FilesAdded');
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        // 在上传之前 加入key关键字
                        console.log('BeforeUpload');
                        var file_id = up.settings.multipart_params.key || undefined;
                        if (file_id === undefined) {
                            console.error('file_id is undefined')
                        }
                        var key = file_id.split('.')[0].split('_');
                        var name = key[0];
                        var index = key[1];
                        var $container = $('input[name={name}]'.format({name:name})).closest('.component').find('.thumbnails-container');
                        // 增加占位图
                        var $waiting = $(that.waitingTemplate);
                        $waiting.attr('index',index);
                        // 绑定删除上传中的方法
                        _bindDelete($waiting);
                        var $addBtn = $container.find('.thumbnail.add');
                        $addBtn.before($waiting);
                        $addBtn.trigger('changeShowHide');

                        //


                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                        console.log('UploadProgress');
                        // 禁用browser按钮
                        // uploader.disableBrowse(true);
                    },
                    'FileUploaded': function(up, file, info) {
                        console.log('FileUploaded');
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //	"hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //	"key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var res = $.parseJSON(info.response);
                        var sourceLink = domain + res.key;		// 获取上传成功后的文件的Url
                        var key = res.key.split('.')[0].split('_');
                        var name = key[0];
                        var index = key[1];
                        var $item = $(that.thumbnailTemplate.format({url:sourceLink }))
                        $item.attr('index',index);

                        // 绑定点击弹出
                        $item.find('.image-container').bindPopup();

                        _bindDelete($item);
                        var $container = $('input[name={name}]'.format({name:name})).closest('.component').find('.thumbnails-container');
                        var $waiting = $container.find('.thumbnail.waiting[index={index}]'.format({index:index}));
                        $waiting.replaceWith($item);
                        // 更新已存值
                        var imageData = {
                            formId: $container.closest('form').attr('id'),
                            name: that.opts.name
                        };
                        _updateImageItemUrls(imageData);
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                        console.log('Error');
                        // 激活browser按钮
                        uploader.disableBrowse(false);

                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                        console.log('UploadComplete');
                        // 激活browser按钮
                        uploader.disableBrowse(false);
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效

                         /*
                         eg
                         key : a2_33_18391238571.png
                         */
                        var key = that.opts.name + '_' + index + '_' + (new Date()).valueOf();
                        index++;
                        if (file.name.match(/\.(jpg|jpeg|png|gif)/)) {
                            key += file.name.match(/\.(jpg|jpeg|png|gif)/)[0];
                        }
                        // do something with key here
                        return key
                    }
                }
            });
        }

        this.__transRead = function () {
            //暂时不管image的transRead方法
        }

    }

    $.formb.components.image = component_image;
}));