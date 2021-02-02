/**
 * @author zhangti
 * @description 几何缓冲区示例代码
 */
Cesium && (() => {
    /**
     * 笛卡尔转经纬度
     * @param {*} cartesian 
     */
    const cartesianToWGS84 = (cartesian) => {
        let ellipsoid = Cesium.Ellipsoid.WGS84
        let cartographic = ellipsoid.cartesianToCartographic(cartesian)
        return {
            lng: Cesium.Math.toDegrees(cartographic.longitude),
            lat: Cesium.Math.toDegrees(cartographic.latitude),
            alt: cartographic.height
        }
    }
    /**
     * 笛卡尔数组转经纬度数组
     * @param {*} cartesianArr 
     */
    const cartesianArrayToWGS84Array = (cartesianArr) => {

        return cartesianArr
            ? cartesianArr.map((item) => { return cartesianToWGS84(item) })
            : []
    }
    /**
     * 创建点
     * @param params
     */
    Cesium.drawPointGraphics = function (params = {}) {

        return new Promise((resolve, reject) => {

            const _viewer = params.viewer
            const _style = params.style ||
            {
                image: 'src/location4.png',
                width: 35,
                height: 40,
                clampToGround: true,
                scale: 1,
                pixelOffset: new Cesium.Cartesian2(0, -20),
            }
            let _poiEntity = new Cesium.Entity(),
                _handlers,
                _position,
                _positions = [],
                _poiObj

            _viewer && (() => {
                _handlers = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas)
                // left
                _handlers.setInputAction((movement) => {

                    let cartesian = _viewer.scene.camera.pickEllipsoid(movement.position, _viewer.scene.globe.ellipsoid)
                    cartesian && cartesian.x && (_position = cartesian, _positions.push(_position))

                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                // right
                _handlers.setInputAction((movement) => {

                    _handlers.destroy(),
                        _handlers = null,
                        resolve && (
                            resolve(cartesianArrayToWGS84Array(_positions), _poiObj))

                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                _poiEntity.billboard = _style
                _poiEntity.position = new Cesium.CallbackProperty(function () {
                    return _position
                }, false)

                _poiObj = _viewer.entities.add(_poiEntity)
            }
            )()


        });

    }
    /**
     * 画线
     * @param {*} params 
     */
    Cesium.drawLineGraphics = function (params = {}) {

        return new Promise((resolve, reject) => {

            const _viewer = params.viewer
            const _style = params.style || {}
            let _lineEntity = new Cesium.Entity(),
                _positions = [],
                _lineObj
            _viewer && (() => {

                _handlers = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);

                // left
                _handlers.setInputAction(function (movement) {

                    let cartesian = _viewer.scene.camera.pickEllipsoid(movement.position, _viewer.scene.globe.ellipsoid)

                    cartesian && cartesian.x && (
                        _positions.length == 0 && _positions.push(cartesian.clone()),
                        _positions.push(cartesian))

                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                // move
                _handlers.setInputAction(function (movement) {

                    let cartesian = _viewer.scene.camera.pickEllipsoid(movement.endPosition, _viewer.scene.globe.ellipsoid)

                    _positions.length >= 2 && (
                        cartesian && cartesian.x && (
                            _positions.pop(),
                            _positions.push(cartesian)
                        )
                    )
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                // right
                _handlers.setInputAction(function (movement) {

                    _handlers.destroy(),

                        _handlers = null,

                        resolve && (
                            resolve(cartesianArrayToWGS84Array(_positions), _lineObj)
                        )
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                _lineEntity.polyline = {
                    width: _style.width || 5
                    , material: _style.material || Cesium.Color.BLUE.withAlpha(0.8)
                    , clampToGround: _style.clampToGround || false
                }

                _lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                    return _positions
                }, false)

                _lineObj = _viewer.entities.add(_lineEntity)
            })()

        });
    }
    /**
     * 画面 
     * @param {*} params 
     */
    Cesium.drawPolygonGraphics = function (params = {}) {

        return new Promise((resolve, reject) => {

            const _viewer = params.viewer
            const _style = params.style ||
            {
                width: 3
                , material: Cesium.Color.BLUE.withAlpha(0.8)
                , clampToGround: true
            }
            let _positions = [],
                _polygon = new Cesium.PolygonHierarchy(),
                _polygonEntity = new Cesium.Entity(),
                _polyObj,
                _handler

            _viewer && (() => {
                _handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
                // left
                _handler.setInputAction(function (movement) {

                    let cartesian = _viewer.scene.camera.pickEllipsoid(movement.position, _viewer.scene.globe.ellipsoid)

                    cartesian && cartesian.x && (() => {
                        _positions.length == 0 && (
                            _polygon.positions.push(cartesian.clone()),
                            _positions.push(cartesian.clone()))

                        _positions.push(cartesian.clone()),
                            _polygon.positions.push(cartesian.clone())
                    })()
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                // mouse
                _handler.setInputAction(function (movement) {

                    let cartesian = _viewer.scene.camera.pickEllipsoid(movement.endPosition, _viewer.scene.globe.ellipsoid)

                    _positions.length >= 2 && (cartesian && cartesian.x && (
                        _positions.pop(),
                        _positions.push(cartesian),
                        _polygon.positions.pop(),
                        _polygon.positions.push(cartesian)))

                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                // right
                _handler.setInputAction(function (movement) {

                    _handler.destroy(),

                        _handler = null,

                        _positions.push(_positions[0]),

                        resolve && (
                            resolve(cartesianArrayToWGS84Array(_positions), _polyObj)
                        )
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


                _polygonEntity.polyline = _style

                _polygonEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                    return _positions
                }, false)

                _polygonEntity.polygon = {

                    hierarchy: new Cesium.CallbackProperty(function () {
                        return _polygon
                    }, false),

                    material: Cesium.Color.WHITE.withAlpha(0.1)
                    , clampToGround: _style.clampToGround || false
                }

                _polyObj = _viewer.entities.add(_polygonEntity)
            })()

        });

    }
    /**
     * 创建缓冲区图形
     * @param {*} params 
     */
    Cesium.createGraphicsBuffer = function (params = {}) {
        const _viewer = params.viewer
        let _turfPositions = params.turfPositions || []
        let _material = params.material || []
        let _animation = params.animation || false
        let _bufferEntity = new Cesium.Entity()
        let _hierarchy = new Cesium.PolygonHierarchy()
        let _radius = params.radius || 0.1
        let radius = 0
        
        const parse = (arr) => {
            var buffered = [];
            for (var i = 0; i < arr.length; i++) {
                buffered = buffered.concat(arr[i]);
            }
            return buffered
        }
        
        _bufferEntity.animation = _animation;
        _bufferEntity.polygon = {
            material: Cesium.Color.SKYBLUE.withAlpha(0.5),
            hierarchy: new Cesium.CallbackProperty(function (time, result) {
                if (_bufferEntity.animation === undefined || _bufferEntity.animation) { // 动画
                    if (radius <= _radius) {
                        radius += 0.02
                    } else {
                        radius = 0.02
                    }
                } else {
                    radius = _radius
                }
                let buffered = parse(
                    turf.buffer(_turfPositions, radius, { units: 'kilometers' }).geometry
                        .coordinates[0]
                )
                _hierarchy.positions = Cesium.Cartesian3.fromDegreesArray(buffered, Cesium.Ellipsoid.WGS84, result)
                return _hierarchy;
            }, false),
        }

        return _viewer.entities.add(_bufferEntity)
    }

    let a = 'background: #606060; color: #fff; border-radius: 3px 0 0 3px;'
    let b = 'background: #1475B2; color: #fff; border-radius: 0 3px 3px 0;'
    console.log(`%c web3d/webgis相关工作推荐邮箱 : %c zhangticcc@163.com `, a, b)
    console.log(`更多插件https://github.com/zhangti0708 %c =,=给个广告位`, b)
})();
