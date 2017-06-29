(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define('form-builder-plugins', ['jquery'], factory);
    } else {
        factory(window.jQuery);
    }
}(function ($, undefined) {
    $.formb = $.formb || {};
    $.formb.plugins = {
        'select2': {
            module: 'select2',
            init: function () {
                var setting = this.data('option'),
                    option = setting.plugins || {},
                    selectNode = $('select', this);
                if (option.option && option.option.multiple) {
                    $('option[value=""]', selectNode).remove();
                }
                selectNode.select2(option.option);
            },
            setValue: function (value) {
                $('select', this).val(value).trigger('change');
            },
            disabled: function (flag) {
                $('select', this).prop('disabled', flag).select2('_sync');
            }
        },
        'My97': {
            init: function () {
                var setting = this.data('option'),
                    option = setting.plugins || {};

                if (setting.display_type != 'disabled') {
                    if (setting.type == 'daterange') {
                        var node1 = $('input:eq(0)', this), node2 = $('input:eq(1)', this);
                        node1.click(function () {
                            WdatePicker($.extend({'maxDate': "#F{$dp.$D('" + node2[0].id + "')}"}, option.option));
                        });

                        node2.click(function () {
                            WdatePicker($.extend({'minDate': "#F{$dp.$D('" + node1[0].id + "')}"}, option.option));
                        });

                    } else {
                        $('input, .icon-group', this).click(function () {
                            WdatePicker($.extend({'el': setting.id}, option.option));
                        });
                    }
                }

                //此处有特殊样式控制，如又需要自行修改
                if (!!option.option.dateFmt && option.option.dateFmt.indexOf('HH:mm:ss') >= 0) {
                    $('.icon-group i', node).removeClass('glyphicon-calendar').addClass('glyphicon-time');
                }

            },
            disabled: function (flag) {
                var setting = this.data('option'),
                    option = setting.plugins || {};
                $('input', this).prop('disabled', flag);
                if (flag) {
                    $('input, .icon-group', this).off('click');
                } else {
                    if (setting.type == 'daterange') {
                        var node1 = $('input:eq(0)', this), node2 = $('input:eq(1)', this);
                        node1.click(function () {
                            WdatePicker($.extend({'maxDate': "#F{$dp.$D('" + node2[0].id + "')}"}, option.option));
                        });

                        node2.click(function () {
                            WdatePicker($.extend({'minDate': "#F{$dp.$D('" + node1[0].id + "')}"}, option.option));
                        });

                    } else {
                        $('input, .icon-group', this).click(function () {
                            WdatePicker($.extend({'el': setting.id}, option.option));
                        });
                    }
                }
            }
        },
        'UE': {
            init: function () {
                var setting = this.data('option'),
                    option = setting.plugins || {},
                    textAraNode = $('textarea', this).addBack('textarea');
                textAraNode.removeClass('form-control').css({width: '100%', height: '200px'});
                var tue = UE.getEditor(textAraNode.prop('id'), option.option);

                tue.addListener('contentChange', function () {
                    tue.sync();
                    textAraNode.focusout();
                });

                if ($('textarea', this).prop('disabled')) {
                    tue.ready(function () {
                        tue.setDisabled('fullscreen');
                    });
                }

            },
            setValue: function (value) {
                var setting = this.data('option'),
                    tue = UE.getEditor(setting.id);
                tue.ready(function () {
                    tue.setContent(value);
                });
            },
            disabled: function (flag) {
                var setting = this.data('option'),
                    tue = UE.getEditor(setting.id);
                tue.ready(function () {
                    if (flag) {
                        tue.setDisabled('fullscreen');
                    } else {
                        tue.setEnabled();
                    }

                });
            }
        },
        'P2Dictionary': (function () {
            var req;
            return {
                unrequire: true,
                init: function () {
                    var setting = this.data('option'),
                        option = setting.plugins || {},
                        selectNode = $('select', this),
                        op;

                    req = P2.utils.getStdCode(option.param, function (options) {
                        for (var i = 0, len = options.length; i < len; i++) {
                            op = $('<option value="' + options[i]['itemValue'] + '">' + options[i]['itemName'] + '</option>').data('value', options[i]);
                            selectNode.append(op);
                        }
                        if (option.option && option.option.multiple) {
                            $('option[value=]', selectNode).prop('disabled', true);
                        }
                        selectNode.select2(option.option);
                    });
                },
                setValue: function (value) {
                    var selectNode = $('select', this).addBack('select');
                    if (req.state() === 'pending') {
                        req.done(function () {
                            selectNode.val(value).trigger('change');
                        });
                    } else {
                        selectNode.val(value).trigger('change');
                    }
                },
                disabled: function (flag) {
                    $('select', this).prop('disabled', flag).select2('_sync');
                }
            }
        })(),
        'jqgrid_local': {
            module: 'jqgrid',
            init: function () {
                var setting = this.data('option'),
                    option = setting.plugins || {},
                    col;

                if (setting.cols) {
                    option.colModel = [];
                    for (var i = 0, len = setting.cols.length; i < len; i++) {
                        col = $.extend({}, setting.cols[i]);
                        col.index = col.name = col.id;
                        if (option.treeGrid && col.expand) {
                            option.ExpandColumn = col.id;
                        }
                        if (col.display_type == 'hidden') {
                            col.hidden = true;
                        }
                        option.colModel.push(col);
                    }
                }

                option.data = setting.value;
                var tableNode = $('table', this);
                tableNode.after('<div id="p' + setting.id + '">');
                option.pager = 'p' + setting.id;

                tableNode.jqGrid(option);
                tableNode.navGrid('#p' + setting.id);

                if (setting.buttons) {
                    for (var j = 0, l = setting.buttons.length; j < l; j++) {
                        tableNode.navButtonAdd('#p' + setting.id, {
                            caption: setting.buttons[j].label,
                            buttonicon: setting.buttons[j].class,
                            position: 'last',
                            onClickButton: function (option) {
                                return function (e, node) {
                                    $(this).triggerHandler('fclick.' + option.id, [e, node]);
                                };
                            }(setting.buttons[j])
                        });
                    }
                }
                // 为按钮添加事件
                // $('#tb1').on('click.b1',function(even, e, node){console.log(even, e, node)});

            },
            setValue: function (value) {
                var table = $('table', this);
                table.clearGridData();
                table.addJSONData(value);
            }
        },
        'jqgrid_local_edit': {
            module: 'jqgrid,layer',
            init: function () {
                var setting = this.data('option'),
                    option = setting.plugins || {},
                    col,
                    lastSelection, lastCol;

                if (setting.cols) {
                    option.colModel = [];
                    for (var i = 0, len = setting.cols.length; i < len; i++) {
                        col = $.extend({}, setting.cols[i]);
                        col.index = col.name = col.id;
                        if (option.treeGrid && col.expand) {
                            option.ExpandColumn = col.id;
                        }

                        if (col.display_type == 'hidden') {
                            col.hidden = true;
                        }

                        if (col.display_type === 'disabled') {
                            col.editable = false;
                        } else {
                            col.editable = true;
                            switch (col.type) {
                                case 'str':
                                    col.edittype = 'text';
                                    break;
                                case 'number':
                                    col.edittype = 'text';
                                    col.editoptions = {
                                        dataInit: function (element, option) {
                                            $(element).prop('type', 'number');
                                        }
                                    };
                                    //col.editrules = {number: true};
                                    break;
                                case 'select':
                                    col.editable = true;
                                    col.edittype = 'select';
                                    col.formatter = 'select';
                                    col.editoptions = {
                                        value: function (col) {
                                            var options = '';
                                            if ($.isArray(col.options)) {
                                                $.each(col.options, function (index, item) {
                                                    options += item.value + ':' + item.label + ';';
                                                });
                                            }
                                            return options.replace(/;$/g, '');
                                        }(col)
                                    };

                                    break;
                                case 'radio':
                                    col.editable = true;
                                    col.formatter = function (cellvalue, options, rowObject) {
                                        if (cellvalue == '1') {
                                            return '<input type="radio" name="' + options.colModel.id + '" checked disabled>';
                                        } else {
                                            return '<input type="radio" name="' + options.colModel.id + '" disabled>';
                                        }
                                    };
                                    col.unformat = function (cellvalue, options, element) {
                                        if ($(':radio', element).is(':checked')) {
                                            return '1';
                                        } else {
                                            return '0';
                                        }
                                    };

                                    col.edittype = 'custom';
                                    col.editoptions = {
                                        custom_element: function (value, editOptions) {
                                            window.chk = false;
                                            var node = $('<input type="radio" onMouseover="chk=checked;" onClick="checked=chk=!chk;">');
                                            node.attr('rowid', editOptions.rowId);
                                            if (value === '1') {
                                                node.prop('checked', true);
                                            }
                                            return node;
                                        },
                                        custom_value: function (elem, oper, value) {
                                            if (oper === 'set') {
                                                if (value) {
                                                    $(elem).prop('checked', true);
                                                }
                                            }
                                            if (oper === "get") {
                                                $.each(this.p.data, function (index, item) {
                                                    item[$(elem).prop('name')] = '0';
                                                });
                                                return $(elem).is(':checked') ? '1' : '0';
                                            }
                                        }
                                    };

                                    break;
                                case 'checkbox':
                                    col.editable = true;
                                    col.edittype = 'checkbox';
                                    col.formatter = 'checkbox';
                                    col.editoptions = {
                                        value: '1:0'
                                    };

                                    break;
                                case 'date':
                                    col.edittype = 'text';
                                    col.editoptions = {
                                        dataInit: function (element, option) {
                                            $(element).click(function () {
                                                WdatePicker({el: this.id})
                                            }).click();
                                        }
                                    };
                                    break;
                                case 'datetime':
                                    col.edittype = 'text';
                                    col.editoptions = {
                                        dataInit: function (element, option) {
                                            $(element).click(function () {
                                                WdatePicker({el: this.id, dateFmt: 'yyyy-MM-dd HH:mm:ss'})
                                            }).click();
                                        }
                                    };
                                    break;
                                case 'url':
                                    col.editable = false;
                                    col.formatter = function (col) {
                                        return function (cellvalue, options, rowObject) {
                                            var url;
                                            if ($.isFunction(col.url)) {
                                                url = col.url(cellvalue, options, rowObject);
                                            } else {
                                                url = col.url;
                                            }
                                            return '<a href="' + url + '?' + $.param(rowObject) + '">' + (cellvalue || '') + '</a>'
                                        };
                                    }(col);

                                    col.unformat = function (cellvalue, options, element) {
                                        return $('a', element).html();
                                    };
                                    break;
                                case 'P2Dictionary' :
                                    var col2 = $.extend({}, col);
                                    col2.hidden = true;
                                    option.colModel.push(col2);

                                    col.index = col.name = col.id = col.id + '_DESC';
                                    col.editable = true;
                                    col.edittype = 'text';
                                    col.edittype = 'custom';
                                    col.editoptions = {
                                        custom_element: function (value, editOptions) {
                                            var node = $(this).getRowData(editOptions.rowId, true);
                                            var select = $('<select>');
                                            select.attr({
                                                style: 'width:100%;',
                                                rowid: editOptions.rowId
                                            });
                                            P2.utils.getStdCode(col.options, function (options) {
                                                $.each(options, function (index, item) {
                                                    var selected = '';
                                                    if (item.itemValue == node[editOptions.name.replace(/_DESC$/g, '')]) selected = 'selected';
                                                    select.append('<option value="' + (item.itemValue || '') + '" ' + selected + '>' + (item.itemName || '') + '</option>');
                                                });
                                            });

                                            return select;
                                        },
                                        custom_value: function (elem, oper, value) {
                                            var node = $(this).getRowData($(elem).attr('rowid'), true);
                                            if (oper === 'set') {
                                                if (value) {
                                                    node[$(elem).prop('name').replace(/_DESC$/g, '')] = value;
                                                    $(elem).val(value);
                                                }
                                            }
                                            if (oper === "get") {
                                                node[$(elem).prop('name').replace(/_DESC$/g, '')] = $(elem).val();
                                                return $('option:selected', elem).text();
                                            }
                                        }
                                    };

                                    break;
                            }
                        }
                        option.colModel.push(col);
                    }
                }
                option.onCellSelect = function (id, iCol, cellObject, e) {
                    if ($(e.target).hasClass('cbox')) {
                        $(this).jqGrid('saveCell', lastSelection, lastCol);
                    }
                    lastSelection = $(this).getInd(id);
                    lastCol = iCol;
                };

                option.data = setting.value;
                var tableNode = $('table', this);
                tableNode.after('<div id="p' + setting.id + '">');
                option.pager = 'p' + setting.id;
                tableNode.jqGrid(option);
                tableNode.navGrid('#p' + setting.id);

                if (setting.buttons) {
                    for (var j = 0, l = setting.buttons.length; j < l; j++) {
                        tableNode.navButtonAdd('#p' + setting.id, {
                            caption: setting.buttons[j].label,
                            buttonicon: setting.buttons[j].class,
                            position: 'last',
                            onClickButton: function (option) {
                                return function (e, node) {
                                    $(this).triggerHandler('fclick.' + option.id, [e, node]);
                                };
                            }(setting.buttons[j])
                        });
                    }
                }
                // 为按钮添加事件
                // $('#tb1').on('click.b1',function(even, e, node){console.log(even, e, node)});

                $(document).on('click.jqgrid', function (e) {
                    if ($(tableNode).closest('.ui-jqgrid-btable').find(e.target).length == 0) {
                        tableNode.jqGrid('saveCell', lastSelection, lastCol);
                        tableNode.jqGrid('saveRow', lastSelection);
                        if (!option.multiselect) {
                            tableNode.resetSelection();
                        }
                    }
                });

            },
            setValue: function (value) {
                var table = $('table', this);
                table.clearGridData();
                table.addJSONData(value);
            }
        }
    };
    // 以下代码没用 ============================================================================
    $.formb.plugins.jqgrid_server = $.extend({}, $.formb.plugins.jqgrid_local, {
        setValue: function (fetch) {
            var table = $('table', this);
            if ($.isFunction(fetch)) {
                table.setGridParam({fetch: fetch});
                table.trigger("reloadGrid");
            }

        }
    });

    $.formb.plugins.jqgrid_server_edit = $.extend({}, $.formb.plugins.jqgrid_local_edit, {
        setValue: function (fetch) {
            var table = $('table', this);
            if ($.isFunction(fetch)) {
                table.setGridParam({fetch: fetch});
                table.trigger("reloadGrid");
            }

        }
    });

    $.formb.service = function (service) {
        var that = this;
        if ($(service.page).length === 0) {
            $('<' + service.page + '>').css('display', 'none').appendTo('body').data('option', service);
            riot.mount(service.page, service.param);
        }

        layer.open({
            type: 1,
            title: service.title,
            area: ['80%', '80%'],
            content: $(service.page),
            btn: ['提交', '取消']
            , yes: function (index, layero) {
                var d = $(that).triggerHandler('submit.layer', $('#formData', layero).data('value'));
                /**
                 * 为表单添加提交事件
                 * $('#b1').on('submit.layer', function(even, data){
                            console.log(even, data)
                            return true;
                        })
                 */
                if (d) {
                    layer.close(index);
                }
            }, cancel: function (index) {
                $(that).triggerHandler('cancel.layer');
                /**
                 * 为表单添加取消事件
                 * $('#b1').on('cancel.layer', function(even, data){
                            console.log(even, data)
                            return true;
                        })
                 */
            }
        });
    };
}));