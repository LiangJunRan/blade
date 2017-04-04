
// ================================================================
// 画圆环
// ================================================================

// 对象，方便改变
function RingG(option) {
	var _opts = {
		x: 0,						// 圆心横坐标
		y: 0,						// 圆心纵坐标
		radius: 120,				// 圆半径
		startAngle: Math.PI * 2.2,	// 圆环开始角度
		endAngle: Math.PI * 0.8,	// 圆环结束角度
		counterclockwise: true,		// 圆环角度是否顺时针
		lineWidth: 10,				// 圆环边的宽度
		strokeStyle: 'transparent',	// 圆环底色
		fillStyle: 'red',			// 圆环本色
		lineCap: 'round'			// 圆环端点样式
	}
	var opts = $.extend({}, _opts, option);	// 合并样式
	var that = this;
	$.each(opts, function(key){
		that[key] = opts[key];
	});
}
RingG.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();

    ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterclockwise);
	ctx.strokeStyle = this.fillStyle;
    ctx.lineCap = this.lineCap;
	ctx.stroke();
	ctx.closePath();
};
// var rg = new RingG({x: 0, y: 0, fillStyle: 'rgb(255, 120, 0)', lineWidth: 18});
// ctx.translate(cw/2, ch/2);
// rg.draw(ctx);
// ctx.translate(-cw/2, -ch/2);


// 单函数式
function draw_ring(ctx, option){
	var _opts = {
		x: 0,						// 圆心横坐标
		y: 0,						// 圆心纵坐标
		radius: 120,				// 圆半径
		startAngle: Math.PI * 2.2,	// 圆环开始角度
		endAngle: Math.PI * 0.8,	// 圆环结束角度
		counterclockwise: true,		// 圆环角度是否逆时针
		lineWidth: 10,				// 圆环边的宽度
		strokeStyle: 'transparent',	// 圆环底色
		fillStyle: 'red',			// 圆环本色
		lineCap: 'round',			// 圆环端点样式
		isShadow: false,			// 圆环是否发光
		shadowBlur: 5				// 阴影高斯模糊
	}
	var opts = $.extend({}, _opts, option);	// 合并样式

	ctx.beginPath();
    ctx.arc(0, 0, opts.radius, 0, Math.PI*2, true);
    ctx.lineWidth = opts.lineWidth;
    ctx.strokeStyle = opts.strokeStyle;
    ctx.stroke();

    ctx.beginPath();
	ctx.arc(opts.x, opts.y, opts.radius, opts.startAngle, opts.endAngle, opts.counterclockwise);
	ctx.strokeStyle = opts.fillStyle;
    ctx.lineCap = opts.lineCap;

    if (opts.isShadow == true) {
        ctx.shadowOffsetX = 0; // 阴影Y轴偏移
        ctx.shadowOffsetY = 0; // 阴影X轴偏移
        ctx.shadowBlur = opts.shadowBlur; // 模糊尺寸
        ctx.shadowColor = opts.fillStyle; // 颜色
    } else {
        ctx.shadowOffsetX = 0; // 阴影Y轴偏移
        ctx.shadowOffsetY = 0; // 阴影X轴偏移
        ctx.shadowBlur = 0; // 模糊尺寸
        ctx.shadowColor = 'transparent'; // 颜色
    }

	ctx.stroke();
	ctx.closePath();

    ctx.save();
    ctx.restore();
}
/*ctx.translate(cw/2, ch/2);
draw_ring({fillStyle: 'rgb(255, 255, 255)'});
ctx.translate(-cw/2, -ch/2);*/


// ================================================================
// 画重复直线环
// ================================================================


var DrawLine = function (movex, movey, tox, toy, strokeStyle, lineCap, lineWidth, isShadow, shadowBlur, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(movex, movey);
    ctx.lineTo(tox, toy);
    ctx.lineCap = lineCap;
    ctx.lineWidth = lineWidth;

    if (isShadow == true) {
        ctx.shadowOffsetX = 0; // 阴影Y轴偏移
        ctx.shadowOffsetY = 0; // 阴影X轴偏移
        ctx.shadowBlur = shadowBlur; // 模糊尺寸
        ctx.shadowColor = strokeStyle; // 颜色
    } else {
        ctx.shadowOffsetX = 0; // 阴影Y轴偏移
        ctx.shadowOffsetY = 0; // 阴影X轴偏移
        ctx.shadowBlur = 0; // 模糊尺寸
        ctx.shadowColor = 'transparent'; // 颜色
    }
    ctx.stroke();
    ctx.closePath();
}
function draw_repeat_lines_ring(ctx, option) {
	/**
	 * 画重复竖线环的方法
	 */
	var _opts = {
		x: 0,								// 圆心横坐标
		y: 0,								// 圆心纵坐标
		radius: 120,						// 圆半径
		linesCount: 60,						// 线的总数

		lineStartDeltaRadius: -15,			// 短线的起点，以radius为基准
		lineEndDeltaRadius: -26,			// 短线的终点，以radius为基准
		ratioOfLineToRadius: 1 / 800,		// 短线线宽宽与半径的比例

		linePlusStartDeltaRadius: 0,		// 长线的起点，以radius为基准
		linePlusEndDeltaRadius: -32,		// 长线的终点，以radius为基准
		ratioOfLinePlusToRadius: 1 / 160,	// 长线线宽与半径的比例

		strokeStyle: 'red',					// 线颜色
		lineCap: 'round',					// 线端点样式

		isShadow: false,					// 是否发光
		shadowBlur: 5						// 发光高斯模糊大小
	}

	var opts = $.extend({}, _opts, option);	// 合并样式

    for (var i = 0; i < 360; i++) {
        var angle = 360 * (i / opts.linesCount);

        // 短线起点x,y与radius的关系
        var x = Math.sin(angle * Math.PI / 180) * (opts.radius + opts.lineStartDeltaRadius) + opts.x;
        var y = opts.y - Math.cos(angle * Math.PI / 180) * (opts.radius + opts.lineStartDeltaRadius);
        // 短线终点x,y与radius的关系
        var linetox = Math.sin(angle * Math.PI / 180) * (opts.radius + opts.lineEndDeltaRadius) + opts.x;
        var linetoy = opts.y - Math.cos(angle * Math.PI / 180) * (opts.radius + opts.lineEndDeltaRadius);

        // 长线起点x,y与radius的关系
        var xPlus = Math.sin(angle * Math.PI / 180) * (opts.radius + opts.linePlusStartDeltaRadius) + opts.x;
        var yPlus = opts.y - Math.cos(angle * Math.PI / 180) * (opts.radius + opts.linePlusStartDeltaRadius);
        // 长线终点x,y与radius的关系
        var linetoxPlus = Math.sin(angle * Math.PI / 180) * (opts.radius + opts.linePlusEndDeltaRadius) + opts.x;
        var linetoyPlus = opts.y - Math.cos(angle * Math.PI / 180) * (opts.radius + opts.linePlusEndDeltaRadius);

        if (i % 5 == 0) {
            // 设置长线画线终点
            DrawLine(xPlus, yPlus, linetoxPlus, linetoyPlus, opts.strokeStyle, opts.lineCap, opts.radius * opts.ratioOfLinePlusToRadius, opts.isShadow, opts.shadowBlur, ctx);
        }
        else {
            // 设置短线画线终点
            DrawLine(x, y, linetox, linetoy, opts.strokeStyle, opts.lineCap, opts.radius * opts.ratioOfLineToRadius, opts.isShadow, opts.shadowBlur, ctx);
        }
    }
}
/*draw_repeat_lines_ring({
	x: cw / 2,
	y: ch / 2,
	radius: 300,
	lineStartDeltaRadius: -20,
	lineEndDeltaRadius: -50,
	linePlusStartDeltaRadius: -10,
	linePlusEndDeltaRadius: -50,
	strokeStyle: '#fff',
	lineCap: ''
});*/


// ================================================================
// 画突出部分圆环
// ================================================================
function draw_bulged_ring(ctx, option) {
	var _opts = {
		x: 0,						// 圆心横坐标
		y: 0,						// 圆心纵坐标
		ring_parts: [				// 组成圆环的每一部分
			{
				radius: 120,				// 圆半径
				startAngle: Math.PI * 0,	// 圆环开始角度
				endAngle: Math.PI * 0.5,	// 圆环结束角度
			}, {
				radius: 130,				// 圆半径
				startAngle: Math.PI * 0.55,	// 圆环开始角度
				endAngle: Math.PI * 0.95,	// 圆环结束角度
			}, {
				radius: 120,				// 圆半径
				startAngle: Math.PI * 1,	// 圆环开始角度
				endAngle: Math.PI * 1.5,	// 圆环结束角度
			}, {
				radius: 130,				// 圆半径
				startAngle: Math.PI * 1.65,	// 圆环开始角度
				endAngle: Math.PI * 1.95,	// 圆环结束角度
			}
		],
		link_parts: false,			// 是否使用直线连接每部分圆环的开始和结束端点
		counterclockwise: true,		// 圆环角度是否逆时针
		lineWidth: 10,				// 圆环边的宽度
		strokeStyle: 'transparent',	// 圆环底色
		fillStyle: 'red',			// 圆环本色
		lineCap: 'round',			// 圆环端点样式
		isShadow: false,			// 圆环是否发光
		shadowBlur: 5				// 发光高斯模糊大小
	}
	var opts = $.extend({}, _opts, option);	// 合并样式
	var points = [];						// 用于记录端点
	var yAxisReversal = (opts.counterclockwise ? 1 : -1);	// 如果逆时针，坐标不反转，顺时针则反转
	for (var rp = 0; rp < opts.ring_parts.length; rp ++) {
		if (opts.link_parts) {
			var startPointX = Math.cos(opts.ring_parts[rp].startAngle) * opts.ring_parts[rp].radius + opts.x;
	        var startPointY = opts.y - Math.sin(opts.ring_parts[rp].startAngle) * opts.ring_parts[rp].radius;
	        var endPointX = Math.cos(opts.ring_parts[rp].endAngle) * opts.ring_parts[rp].radius + opts.x;
	        var endPointY = opts.y - Math.sin(opts.ring_parts[rp].endAngle) * opts.ring_parts[rp].radius;
	        points.push({x: startPointX, y: startPointY * yAxisReversal});
	        points.push({x: endPointX, y: endPointY * yAxisReversal});
		}

		draw_ring(ctx, {
			x: opts.x,
			y: opts.y,
			radius: opts.ring_parts[rp].radius,
			startAngle: opts.ring_parts[rp].startAngle,
			endAngle: opts.ring_parts[rp].endAngle,
			counterclockwise: opts.counterclockwise,
			lineWidth: opts.lineWidth,
			strokeStyle: opts.strokeStyle,
			fillStyle: opts.fillStyle,
			lineCap: opts.lineCap,
			isShadow: opts.isShadow,
			shadowBlur: opts.shadowBlur
		})
	}

	// 测试用，画出坐标
	// DrawLine(0, -1000, 0, 1000, 'green', '', 0.5, false, ctx);
	// DrawLine(-1000, 0, 1000, 0, 'red', '', 0.5, false, ctx);

	// 测试用，画出端点
	// for (var i = 0; i < 8; i++) {
	// 	ctx.beginPath();
	//     ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2, true);
	//     ctx.lineWidth = opts.lineWidth;
	//     ctx.strokeStyle = 'red';
	//     ctx.closePath();
	//     ctx.stroke();
	// }

	for (var _i = 1; _i < (points.length / 2); _i++) {
		// console.log('s:[', points[_i * 2 - 1].x, points[_i * 2 - 1].y, '], \n e:[', points[_i * 2].x, points[_i * 2].y, ']', 'red', opts.lineCap, 5);
		DrawLine(points[_i * 2 - 1].x, points[_i * 2 - 1].y, points[_i * 2].x, points[_i * 2].y,
			opts.fillStyle, opts.lineCap, opts.lineWidth, opts.isShadow, opts.shadowBlur, ctx);
	}
	DrawLine(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y,
		opts.fillStyle, opts.lineCap, opts.lineWidth, opts.isShadow, opts.shadowBlur, ctx);
}