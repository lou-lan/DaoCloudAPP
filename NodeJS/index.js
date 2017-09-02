// 引入http模块
var http = require('http');
// 引入Cheerio模块
var cheerio = require('cheerio');
// 引入sqlite3模块
var sqlite3 = require("sqlite3");

// 数据库
var db;
db = new sqlite3.Database("DaoCloudBlogDB.db", function(err){
 if (err) throw err;
});

// 定义网络爬虫的目标地址
var url = 'http://blog.daocloud.io/';

function loadBlogListDate() {
    http.get(url, function(res) {
        var html = '';
        // 获取页面数据
        console.log('====== 1.获取数据 ======');
        res.on('data', function(data) {
            html += data;
        });
        // 数据获取结束
        res.on('end', function() {
            // 通过过滤页面信息获取实际需求的轮播图信息
            console.log('====== 2.抓取信息 ======');
            var blogListData = filterBlogList(html);
            console.log('====== 3.抓取完成 ======');
            console.log('====== 4.保存数据 ======');
            saveBlogListDate(blogListData);
        });
    }).on('error', function() {
        console.log('获取数据出错！');
    });
}
loadBlogListDate()

/* 过滤页面信息 */
function filterBlogList(html) {
    if (html) {
        // 沿用JQuery风格，定义$
        var $ = cheerio.load(html);
        // 根据id获取轮播图列表信息
        var blogList = $('#main');
        // 轮播图数据
        var blogListData = [];

        /* 轮播图列表信息遍历 */
        blogList.find('article').each(function(item) {

            var article = $(this);
            // 获取DaoCloud的博客标题
            var title = article.find('.listpost-content-wrap').find('.list-post-top').find('.entry-header').find('.entry-title').find('a').text();
            var imgURL = article.find('.post-img-wrap').find('a').find('img').attr('src');
            var postedTime = article.find('.listpost-content-wrap').find('.list-post-top').find('.entry-header').find('.entry-meta').find('a').find('time').attr('datetime');
            var postURL = article.find('.listpost-content-wrap').find('.list-post-top').find('.entry-header').find('.entry-title').find('a').attr('href');
            // 向数组插入数据
            blogListData.push({
                title : title,
                imgURL : imgURL,
                postedTime : postedTime,
                postURL : postURL
            });
        });       
        return blogListData;
    } else {
        console.log('无数据传入！');
    }
}

/* 打印信息 */
function printInfo(blogListData) {
    // 遍历信息列表
    console.log('打印信息中');
    blogListData.forEach(function(item) {
        // 获取标题
        var title = item.title;
    
        // 打印信息
        console.log(title);
        
    });
}

function saveBlogListDate(blogListData) {
    db.serialize(function() {
        // 如果表不存在创建表
        db.run("CREATE TABLE IF NOT EXISTS BlogList (title text, time integer, imgURL text, postURL text)");
        
        blogListData.forEach(function(item) {
            
            // 判断数据库中是否有数据
            db.get("select COUNT(title) as countTitle from BlogList where title = ?", item.title, function(err, row) {
                if (row.countTitle == 0) {
                    var test = db.prepare("INSERT INTO BlogList(title, imgURL, time, postURL) VALUES(?, ?, ?, ?)");
                    test.run(item.title, item.imgURL, item.postedTime, item.postURL);
                    test.finalize();
                }
            });           
        })
        // db.close();
    });
}

// 创建http服务
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    db.serialize(function() {
        // 发送响应数据
        db.all("select * from BlogList ORDER BY time DESC", function(err, rows) {
            // console.log(rows);
            response.end(JSON.stringify(rows));
        });
    });
}).listen(8888)


// 定时采集数据
var period = 3600000; // 没小时
setInterval(function() {
    console.log("====== 6.定时采集 ======");
    loadBlogListDate();
}, period);