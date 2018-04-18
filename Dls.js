



function Dls(option){
	this.map = option.map;
	this.points = option.points;
	this.isShow = false;
	this.index = 0;
	this.timer=null,
	this.count = null,
	this.currentCount = 0;
	this.isGensui = false;
	this.prePoint = option.points[0];
	var points = this.points;

	if(!this.cuLine){
		this.cuLine = new BMap.Polyline(points,{
			strokeColor: "black",
			strokeWeight: 5,
			strokeOpacity: 1
		})
	}

	if(!this.label){
		this.label = new BMap.Label("", {
			offset: new BMap.Size(40, 20)
		});
		this.label.setStyle({
			color: '#444444',
			backgroundColor: '#f8f8f8',
			border: '1px solid #bbbbbb',
			borderRadius: '5px'
		})
	}

	if(!this.icon){
		this.icon = new BMap.Icon("car.png", new BMap.Size(40, 20), {
			anchor: new BMap.Size(20, 10),
			imageSize: new BMap.Size(40, 20),
		});
	}

	if(!this.marker){
		this.marker = new BMap.Marker(points[0], {
			icon: this.icon
		});
	}

	this.marker.setLabel(this.label);

}

Dls.prototype = {
	constructor:Dls,
	init:function(){
		var points = this.points;
		
		if(!this.cuLine){
			this.cuLine = new BMap.Polyline(points,{
				strokeColor: "black",
				strokeWeight: 5,
				strokeOpacity: 1
			})
		}
		
		if(!this.label){
			this.label = new BMap.Label("", {
				offset: new BMap.Size(40, 20)
			});
			label.setStyle({
				color: '#444444',
				backgroundColor: '#f8f8f8',
				border: '1px solid #bbbbbb',
				borderRadius: '5px'
			})
		}
		
		if(!this.icon){
			this.icon = new BMap.Icon("car.png", new BMap.Size(40, 20), {
				anchor: new BMap.Size(20, 10),
				imageSize: new BMap.Size(40, 20),
			});
		}
		
		if(!this.marker){
			this.marker = new BMap.Marker(points[0], {
				icon: this.icon
			});
		}
		
		this.marker.setLabel(this.label);
		

        //点亮操作按钮
       /* playBtn.disabled = false;
        resetBtn.disabled = false;
        
        map.centerAndZoom(points[0], )*/
    },

    show:function(){
    	var points = this.points;
    	var minLng = points[0].lng;
    	var maxLng = points[0].lng;
    	var minLat = points[0].lat;
    	var maxLat = points[0].lat;
    	points.forEach(pot=>{
    		if (pot.lng > maxLng) maxLng = pot.lng;
    		if (pot.lng < minLng) minLng = pot.lng;
    		if (pot.lat > maxLat) maxLat = pot.lat;
    		if (pot.lat < minLat) minLat = pot.lat;
    	})
    	this.map.setZoom(this.getZoom(maxLng, minLng, maxLat, minLat));
    	this.centerPoint = new BMap.Point((points[0].lng + points[points.length - 1].lng) / 2, (points[0].lat + points[
    		points.length - 1].lat) / 2);
    	this.map.panTo(this.centerPoint);
    	this.map.addOverlay(this.cuLine);
    	this.map.addOverlay(this.marker);
    	this.isShow = true;

    },

    getZoom:function(maxLng, minLng, maxLat, minLat) { //计算缩放级别
    	var zoom = [
    	"50",
    	"100",
    	"200",
    	"500",
    	"1000",
    	"2000",
    	"5000",
    	"10000",
    	"20000",
    	"25000",
    	"50000",
    	"100000",
    	"200000",
    	"500000",
    	"1000000",
    	"2000000"
        ]; //级别18到3。
        var pointA = new BMap.Point(maxLng, maxLat); // 创建点坐标A
        var pointB = new BMap.Point(minLng, minLat); // 创建点坐标B
        var distance = this.map.getDistance(pointA, pointB).toFixed(1); //获取两点距离,保留小数点后两位
        for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        	if (zoom[i] - distance > 0) {
                return 18 - i + 3; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
            }
        }
    },

    clear:function(){
    	if(this.isShow){
    		this.map.removeOverlay(this.marker);
    		this.map.removeOverlay(this.cuLine);
    		this.isShow = false;
    	}else{
    		alert("没有需要清除的东西")
    	}
    },

    

    
    play:function(){
    	var point; //在这里确定下一个要跳的点和index增不增
    	var points = this.points;
    	var map = this.map;
    	if (this.index == points.length - 1) {
    		return
    	}
    	this.setRotation(points[this.index - 1] || points[0], points[this.index], points[this.index + 1] || points[points.length - 1], this.marker,map)
    	var projection = map.getMapType().getProjection();
    	var init_pos = projection.lngLatToPoint(points[this.index]);
    	var target_pos = projection.lngLatToPoint(points[this.index + 1]);
        //如果发现有count就执行
        if (typeof this.count != 'undefined') {
        	if (this.count > this.currentCount && this.count >= 1) {
        		var x = this.linear(init_pos.x, target_pos.x, this.currentCount, this.count);
        		var y = this.linear(init_pos.y, target_pos.y, this.currentCount, this.count);
        		point = projection.pointToLngLat(new BMap.Pixel(x, y));
                //console.log(point)
                this.currentCount++;
            } else {
            	if (this.count <= this.currentCount) {
            		point = points[this.index + 1] || points[points.length - 1];
            	} else {
            		point = points[this.index]
            	}
                //console.log(point)
                this.index++;
                this.count = undefined;
                this.currentCount = 0;
                if (this.isGensui) {
                	map.panTo(point);
                }
            }
        } else {
            //计算points[index]  和pointt[index+1] 之间的count
            this.count = Math.round(Math.sqrt(Math.pow(init_pos.x - target_pos.x, 2) + Math.pow(init_pos.y - target_pos.y, 2)) /
            	(1000 / (1000 / 10)));
            point = points[this.index]
        }

        if (this.index > 0 || this.currentCount > 0) {
        	map.addOverlay(new BMap.Polyline([this.prePoint, point], {
        		strokeColor: "red",
        		strokeWeight: 1,
        		strokeOpacity: 1
        	}));
        }
        this.prePoint = point;
        //console.log(point)
        this.label.setContent("经度: " + point.lng + "<br>纬度: " + point.lat);
        this.marker.setPosition(point);

        //move(points[index],points[index+1]||points[points.length-1])
        //index++;

        if (this.index < points.length) {
        	this.timer = setTimeout( (function(lu){return function(){lu.play()}})(this),10)
        } else {
        	map.panTo(point);
        	this.timer= null;
        }
    },

    pause:function(){
    	if(this.timer){
    		window.clearTimeout(this.timer)
    	}
    },

    reset:function(){
    	this.pause();
        this.index = 0;
        this.marker.setPosition(this.points[0]);
        this.map.panTo(this.centerPoint);
        this.prePoint = this.points[0]
    },


    setRotation:function(prePos, curPos, targetPos, me,map){
    	var deg = 0;
    	var atan,
        //start!
        curPos = map.pointToPixel(curPos);
        targetPos = map.pointToPixel(targetPos);

        if (targetPos.x != curPos.x) {
        	var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
        	atan = Math.atan(tan);
        	deg = atan * 360 / (2 * Math.PI);
            //degree  correction;
            if (targetPos.x < curPos.x) {
            	deg = -deg + 90 + 90;
            } else {
            	deg = -deg;
            }
            //console.log(car)
            me.setRotation(-deg);

        } else {
        	var disy = targetPos.y - curPos.y;
        	var bias = 0;
        	if (disy > 0)
        		bias = -1
        	else
        		bias = 1
        	me.setRotation(-bias * 90);
        }
        return;
    },

    linear:function(initPos, targetPos, currentCount, count){
    	var b = initPos,
    	c = targetPos - initPos,
    	t = currentCount,
    	d = count;
    	return c * t / d + b;
    }
}

