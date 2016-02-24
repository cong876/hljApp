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


var orders = [
  {
    "item": [{
      "title": "卡乐比麦片1",
      "pic_urls": ["./image/test.jpg", "./image/basketball.jpg"],
      "number": 1
    },{
      "title": "卡乐比麦片2",
      "pic_urls": ["./image/basketball.jpg","./image/test.jpg"],
      "number": 1
    }],
    "number": 2,
    "price": 50.00,
    "country": "韩国",
    "seller": "王同学",
    "id": 1,
    "order_number": "YE12348743012",
    "operatorMobile": 18810541172,
    "create_time": "2016-02-18 14:00:00",
    "offer_time": "2016-02-18 18:00:00",
    "payment_time": "2016-02-18 19:00:00",
    "delivery_time": "2016-02-19 08:00:00",
    "complete_time": "2016-02-20 18:00:00",
    address: {receiving_addresses_id: 1, receiver_name: "王聪3", receiver_mobile: "18810541172",
      street_address: "西土城路十号北京邮电大学学六公寓255室", is_default: 0,
      province: {code: 101, name: "北京市"}, city: {code: 10101, name: "北京市"}, county: {code: 1010101, name: "海淀区", postcode: 100000}}
  },{
    "item": [{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/test.jpg", "./image/basketball.jpg"],
      "number": 1
    },{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/basketball.jpg","./image/test.jpg"],
      "number": 2
    }],
    "number": 3,
    "price": 250.00,
    "country": "香港",
    "seller": "陆同学",
    "id": 2,
    "order_number": "YE13438592345",
    "operatorMobile": 18810541173,
    "create_time": "2016-02-18 14:00:00",
    "offer_time": "2016-02-18 18:00:00",
    "payment_time": "2016-02-18 19:00:00",
    "delivery_time": "2016-02-19 08:00:00",
    "complete_time": "2016-02-20 18:00:00"
  },{
    "item": [{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/test.jpg", "./image/basketball.jpg"],
      "number": 3
    },{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/basketball.jpg","./image/test.jpg"],
      "number": 1
    }],
    "number": 4,
    "price": 150.00,
    "country": "日本",
    "id": 3,
    "order_number": "YE12341431234",
    "operatorMobile": 18810541174
  },{
    "item": [{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/test3.jpg", "./image/basketball.jpg"],
      "number": 1
    },{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": [],
      "number": 2
    }],
    "number": 3,
    "price": 50.00,
    "country": "香港",
    "id": 2,
    "order_number": "YE13438592346",
    "create_time": "2016-02-18 14:00:00",
    "offer_time": "2016-02-18 18:00:00",
    "payment_time": "2016-02-18 19:00:00",
    "delivery_time": "2016-02-19 08:00:00",
    "complete_time": "2016-02-20 18:00:00",
    address: {receiving_addresses_id: 1, receiver_name: "王聪3", receiver_mobile: "18810541172",
      street_address: "西土城路十号北京邮电大学学六公寓255室", is_default: 0,
      province: {code: 101, name: "北京市"}, city: {code: 10101, name: "北京市"}, county: {code: 1010104, name: "顺义区", postcode: 100000}}
  },{
    "item": [{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/test.jpg", "./image/basketball.jpg"],
      "number": 2
    },{
      "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字",
      "pic_urls": ["./image/basketball.jpg","./image/test.jpg"],
      "number": 2
    }],
    "number": 4,
    "price": 150.00,
    "country": "日本",
    "seller": "王同学",
    "id": 3,
    "order_number": "YE12341431236",
    "create_time": "2016-02-18 14:00:00",
    "offer_time": "2016-02-18 18:00:00",
    "payment_time": "2016-02-18 19:00:00",
    "delivery_time": "2016-02-19 08:00:00",
    "complete_time": "2016-02-20 18:00:00",
    address: {receiving_addresses_id: 1, receiver_name: "王聪", receiver_mobile: "18810541172",
      street_address: "成府路五道口华清嘉园5号楼302室", is_default: 1,
      province: {code: 101, name: "北京市"}, city: {code: 10101, name: "北京市"}, county: {code: 1010101, name: "海淀区", postcode: 100000}}
  }
];

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
        "pic_url": "",
        operatorMobile: 18810541172
      },{
        "title": "一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版一次最多十个字啊啊啊花王护手霜夜间版",
        "number": 3,
        "price": 250.00,
        "country": "香港",
        "id": 2,
        "order_number": "YE13438592345",
        "pic_url": "./image/test.jpg",
        operatorMobile: 18810541173
      },{
        "title": "花王护手霜夜间版",
        "number": 4,
        "price": 150.00,
        "country": "日本",
        "id": 3,
        "order_number": "YE12341431234",
        "pic_url": "./image/test.jpg",
        operatorMobile: 18810541174
      },{
        "title": "花王护手霜夜间版",
        "number": 4,
        "price": 150.00,
        "country": "日本",
        "id": 3,
        "order_number": "YE12341431234",
        "pic_url": "./image/test.jpg",
        operatorMobile: 18810541174
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
        "order_number": "YE13438592346",
        "pic_url": "./image/test3.jpg",
        "operatorMobile": 18810541174
      },{
        "title": "花王护手霜夜间版",
        "number": 4,
        "price": 150.00,
        "country": "日本",
        "id": 3,
        "order_number": "YE12341431236",
        "pic_url": "./image/basketball.jpg",
        "operatorMobile": 18810541174
      }
    ]
  })
});

app.get('/orderDetail', function(req, res) {
  var order_number = req.query.order_number;
  var dataNeed = {};
  for (i=0; i<orders.length; i++) {
    if (order_number == orders[i].order_number) {
      dataNeed = orders[i];
    }
  }
  res.json({data: dataNeed})
});


var cityList = [
  {code: 10101, name: "北京市"},
  {code: 10201, name: "哈尔滨市"},
  {code: 10202, name: "佳木斯市"},
  {code: 10203, name: "齐齐哈尔市"},
  {code: 10301, name: "长春市"},
  {code: 10302, name: "吉林市"},
  {code: 10401, name: "沈阳市"},
  {code: 10402, name: "铁岭市"}
];
var countyList = [
  {code: 1010101, name: "海淀区", postcode: 100000},
  {code: 1010102, name: "朝阳区", postcode: 100000},
  {code: 1010103, name: "丰台区", postcode: 100000},
  {code: 1010104, name: "昌平区", postcode: 100000},
  {code: 1010105, name: "顺义区", postcode: 100000},
  {code: 1020101, name: "香坊区", postcode: 150000},
  {code: 1020102, name: "道里区", postcode: 150000},
  {code: 1020103, name: "道外区", postcode: 150000},
  {code: 1020201, name: "桦南县", postcode: 154400},
  {code: 1020202, name: "桦川县", postcode: 154500},
  {code: 1020203, name: "汤原县", postcode: 154600}
];

app.get('/getAddresses', function(req, res) {
  res.json({
    data: [
      {receiving_addresses_id: 1, receiver_name: "王聪", receiver_mobile: "18810541172",
        street_address: "成府路五道口华清嘉园5号楼302室", is_default: 1,
        province: {code: 101, name: "北京市"}, city: {code: 10101, name: "北京市"}, county: {code: 1010101, name: "海淀区", postcode: 100000}},
      {receiving_addresses_id: 1, receiver_name: "王聪2", receiver_mobile: "18810541172",
        street_address: "学府小区5号楼8单元402室", is_default: 0,
        province: {code: 102, name: "黑龙江省"}, city: {code: 10202, name: "佳木斯市"}, county: {code: 1020201, name: "桦南县", postcode: 154400}},
      {receiving_addresses_id: 1, receiver_name: "王聪3", receiver_mobile: "18810541172",
        street_address: "西土城路十号北京邮电大学学六公寓255室", is_default: 0,
        province: {code: 101, name: "北京市"}, city: {code: 10101, name: "北京市"}, county: {code: 1010105, name: "顺义区", postcode: 100000}}
    ]
  });
});

app.post('/createAddress', function(req, res) {
  res.json({
    status_code: 200,
    receiving_addresses_id: Math.ceil(Math.random()*100)
  })
});

app.post('/updateAddress', function(req, res) {
  res.json({
    status_code: 200
  })
});

app.get('/getCities', function(req, res) {
  var cities = [];
  cityList.map(function(c) {
    if (c.code-req.query.province*100 < 100 && c.code-req.query.province*100 > 0) {
      cities.push(c);
    }
  });
  res.json({data: cities});
});

app.get('/getCounties', function(req, res) {
  var counties = [];
  countyList.map(function(c) {
    if (c.code-req.query.city*100 < 100 && c.code-req.query.city*100 > 0) {
      counties.push(c);
    }
  });
  res.json({data: counties});
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
