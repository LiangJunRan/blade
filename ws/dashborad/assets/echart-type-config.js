function get_default_options(opt) {
	var echarts_type_config = {
		"bar": {
			"textStyle": {
				"color": "#6cc5e7"
			},
			"tooltip": {},
			"legend": {
				"show": false,
				"textStyle": {
					"color": "#6cc5e7"
				}
			},
			"xAxis": {
				"data": (opt.chart.staticAxis == "x") ? xAxisData : undefined,
				"axisTick": {
					"show": false
				},
				"axisLine": {
					"show": true,
					"lineStyle": {
						"color": "#6cc5e7"
					}
				}
			},
			"yAxis": {
				"data": (opt.chart.staticAxis != "x") ? yAxisData : undefined,
				"axisTick": {
					"show": false
				},
				"axisLine": {
					"show": true,
					"lineStyle": {
						"color": "#6cc5e7"
					}
				},
				"splitLine": {
					"lineStyle": {
						"color": "#6cc5e7",
						"opacity": 0.5
					}
				}
			},
			"series": [{
				"name": "次数",
				"type": "bar",
				"barWidth": '30%',
				"data": TODO !!! (opt.chart.staticAxis != "x") ? yAxisData : undefined,
				"itemStyle": {
					"normal": {
						"color": '#d00'/* ,
						borderColor: '#09f' */
					},
					"emphasis": {
						"color": "#f00"/* ,
						borderColor: '#0ff' */
					}
				},
				"label": {
					"normal": {
						"show": true,
						"position": 'top',
						"textStyle": {
							"color": "#6cc5e7"
						}
					},
					"emphasis": {
						"show": true,
						"position": 'top',
						"textStyle": {
							"color": "#8ce5f7"
						}
					}
				}
			}]
		}
	}
	return echarts_type_config[opt.chart.type]
}