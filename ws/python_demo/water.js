// 算法题：一个一维数组，里边存的是墙的高度，生成一个二维（宽度都是1，高度是数组子元素）的墙，两个高墙中间能存水，求存水的体积


// TODO: 找最高，然后依次像两侧找，找到另一个高的的时候，累加能存水的体积，直到边缘
var arr = [2, 5, 1, 2, 3, 4, 7, 7, 6];
var len = arr.length;
var startHeight = -1;
var startIndex = -1;

for (let i = 0; i < len; i++) {
	var bfrH = ((i >= 1) ? arr[i - 1] : 0);
	var tgtH = arr[i];
	var aftH = ((i < len) ? arr[i + 1]: 0);

	// 找开始
	if (startHeight == -1) {
		// 遇到下坡路，算作坑开始
		if (tgtH > aftH) {
			// 找到了
			startHeight = tgtH;
			startIndex = i;
		}
	}
	// 找结束
	else {
		// 大于或等于坑开始的墙高度的情况下，坑结束 或
		// 遇到山峰的时候，坑结束
		if ((tgtH >= startHeight) || (bfrH <= tgtH && tgtH > aftH)
	}

}