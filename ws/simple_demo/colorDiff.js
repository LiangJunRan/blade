// test url: http://www.webhek.com/color-test

// TODO: 数组取唯一不同的最佳算法

var instance = false;
var timer = setInterval(function(){
	if (!instance) {
		instance = true;
		var f = true;
		while(f) {
			var l = $('#box span');
			for (var i = 0; i < (l.length - 2); i++) {
				var color = [];
				color.push($(l[i]).css('background-color'));
				color.push($(l[i + 1]).css('background-color'));
				color.push($(l[i + 2]).css('background-color'));
				if (color[0] == color[1] == color[2]) {
					// do nothing
				} else {
					f = false;
					if (color[0] != color[1]) {
						if (color[1] == color[2]) {
							$(l[i]).click();
						} else {
							if (color[0] == color[2]) {
								$(l[i+1]).click();
							} else {
								// alert('error');
							}
						}
					} else {
						if (color[1] != color[2]) {
							$(l[i+2]).click();
						} else {
							// alert('error');
						}
					}
				}
			}
		}
		instance = false;
	}
}, 1);