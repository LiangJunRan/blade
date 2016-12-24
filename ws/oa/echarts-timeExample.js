var stime='2016-01-01',
    etime='2016-09-01',
    time=new Date('2016-04-01');
option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:['邮件营销']
    },
    xAxis : [
        {
            type : 'time',
            min:new Date(stime.replace(/-/g,"/")),
            max:new Date(etime.replace(/-/g,"/")),
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'邮件营销',
            type:'line',
            stack: '广告',
            data:[[stime,120], [etime,220]]
        }
    ]
};