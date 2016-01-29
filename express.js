var express = require('express');
var livereload = require('express-livereload');

var app = express();

livereload(app, {
  watchDir: './app'
});

app.use(express.static('./app'));
app.use('/bower_components', express.static('./bower_components'));

app.get('/buyPal/getLuckyBagItem', function(req, res) {
  res.json({
    data: {
      "title": "卡乐比800g",
      "price": 50.00,
      "marketPrice": 100.00,
      "description": "据说是世界上最好吃的麦片",
      "id": 3,
      "pic_url": "./image/test.jpg"
    }
  });
});

app.get('/buyPal/getGroupItems', function(req, res) {
  res.json({
    data: [
        {
          "title": "卡乐比800g",
          "price": 50.00,
          "marketPrice": 100.00,
          "description": "据说是世界上最好吃的麦片",
          "id": 1,
          "pic_url": "./image/test.jpg"
        },{
          "title": "一次最多十个字啊啊啊花王护手霜夜间版",
          "price": 50.00,
          "marketPrice": 100.00,
          "description": "一次最多十个字啊啊啊花王护手霜夜间版",
          "id": 2,
          "pic_url": "./image/test.jpg"
        },{
          "title": "卡乐比800g",
          "price": 50.00,
          "marketPrice": 100.00,
          "description": "据说是世界上最好吃的麦片",
          "id": 3,
          "pic_url": "./image/test.jpg"
        },{
          "title": "花王护手霜夜间版",
          "price": 50.00,
          "marketPrice": 100.00,
          "description": "据说是世界上最好吃的麦片",
          "id": 4,
          "pic_url": "./image/test.jpg"
        }
      ]
  });
});

app.get('/noOrder', function(req, res) {
  res.json({
    data: []
  })
});

app.get('/orders', function(req, res) {
  res.json({
    data: [
      {
        "title": "卡乐比800g",
        "number": 2,
        "price": 50.00,
        "country": "韩国",
        "id": 1,
        "order_number": "YE12348743012",
        "pic_url": undefined
      },{
        "title": "一次最多十个字啊啊啊花王护手霜夜间版",
        "number": 3,
        "price": 50.00,
        "country": "香港",
        "id": 2,
        "order_number": "YE13438592345",
        "pic_url": "./image/test.jpg"
      },{
        "title": "花王护手霜夜间版",
        "number": 4,
        "price": 150.00,
        "country": "riben",
        "id": 3,
        "order_number": "YE12341431234",
        "pic_url": "./image/test.jpg"
      }
    ]
  })
});

app.get('/ordersWaitDelivery', function(req, res) {
  res.json({
    data: [
      {
        "title": "一次最多十个字啊啊啊花王护手霜夜间版",
        "number": 3,
        "price": 50.00,
        "country": "香港",
        "id": 2,
        "order_number": "YE13438592345",
        "pic_url": "./image/test3.jpg"
      },{
        "title": "花王护手霜夜间版",
        "number": 4,
        "price": 150.00,
        "country": "riben",
        "id": 3,
        "order_number": "YE12341431234",
        "pic_url": "./image/basketball.jpg"
      }
    ]
  })
});

app.get('/verifyCode', function(req, res) {
  if (req.query.verifyCode == 1111) {
    res.json({status_code: 200});
  } else {
    res.json({status_code: 406, message: "验证码错误"});
  }
});

app.get('/pass', function(req, res) {
  res.json({status_code: 200});
});

app.get('/err', function(req, res) {
  res.json({status_code: 410, message: "get, error"});
});

app.post('/pass', function(req, res) {
  res.json({status_code: 200});
});

app.post('/err', function(req, res) {
  res.json({status_code: 410, message: "post, error"});
});

app.listen(18001, function afterListen () {
	console.log('express running on http://localhost:18001');
});
