function set_init_value() {
    $.each($('input.slider'), function() {
        var p_name = $(this).attr('name');
        $('body').data()[p_name] = $(this).val();
    });
}

function event_bind() {
    $("input.slider").on('change', function() {
        var p_name = $(this).attr('name');
        $('body').data()[p_name] = $(this).val();
        draw('canvas');
        show_info();
    });
}

function show_info() {
    var info_list = [];
    $.each($('body').data(), function(key) {
        info_list.push(key + ': ' + this);
    });
    var info_str = info_list.join('\n');
    $('pre.info').html(info_str);
}
