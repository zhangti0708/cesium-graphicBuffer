# cesium-graphicBuffer
基于cesium的图形缓冲区示例

----------------------------------------------------------------------------------------------------------------------------------------
### 基于cesium的图形缓冲区示例
### cesium-graphicBuffer

### 说明
##### /cesium-graphicBuffer/src/doc

### 使用

#####  在项目中引入Cesium.js

#####  然后引入 cesium-graphicBuffer.js 即可

<a href="http://zhangticcc.gitee.io/webgis/"><img alt="" height="100%" src="https://img-blog.csdnimg.cn/20210126180304472.gif" width="90%" ></a>&nbsp;

``` 
    // 初始化
    let viewer = new Cesium.Viewer("viewerContainer")

    // 参数 缓冲范围
    let radius = 1, bufferEntity = [];

    // 创建点缓冲区
    let createPointBuffer = () => {
       // 绘制点 右键结束
        Cesium.drawPointGraphics({ viewer: viewer }).then((point) => {
          // 创建缓冲区范围
          point = point[0]
          let turfPositions = turf.point([point.lng, point.lat])
          bufferEntity.push(Cesium.createGraphicsBuffer({
            viewer: viewer,
            turfPositions: turfPositions,
            radius: Number(radius)
          }))
        })
    }
    
     // 创建线 缓冲区
    let createPolylineBuffer = () => {
       // 绘制线 右键结束
        Cesium.drawLineGraphics({ viewer: viewer }).then((lines) => {
          // 创建缓冲区范围
          let _lines = []
          lines.forEach((line) => { let point = [line.lng, line.lat]; _lines.push(point) })
          let turfPositions = turf.lineString(_lines)
          bufferEntity.push(Cesium.createGraphicsBuffer({
            viewer: viewer,
            turfPositions: turfPositions,
            radius: Number(radius)
          }))
        })
    }

     // 创建面缓冲区
    let createPolygonBuffer = () => {
        // 绘制面 右键结束
        Cesium.drawPolygonGraphics({ viewer: viewer }).then((polygons) => {
          // 创建缓冲区范围
          let _polygons = []
          polygons.forEach((polygon) => { let point = [polygon.lng, polygon.lat]; _polygons.push(point) })
          let turfPositions = turf.polygon([_polygons])
          bufferEntity.push(Cesium.createGraphicsBuffer({
            viewer: viewer,
            turfPositions: turfPositions,
            radius: Number(radius)
          }))
        })
    }
```
