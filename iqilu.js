function main(item) {
    const orgid = item.orgid;
    const num = parseInt(item.num, 10);

    if (!orgid) {
        return { error: "缺少 orgid 参数" };
    }
    if (isNaN(num)) {
        return { error: "num 参数无效" };
    }

    const api = `https://app.litenews.cn/v1/app/play/tv/live?orgid=${orgid}`;

    const headers = {
    "User-Agent": "Mozilla/5.0 ...",
    "Referer": "https://app.litenews.cn/",
    "Accept": "application/json, text/plain, */*"
    };


    const res = ku9.request(api, "GET", 
        headers,
        "",
        false
    );

    if (res.code !== 200) {
        return { error: "请求直播接口失败" };
    }

    let data;
    try {
        data = JSON.parse(res.body);
    } catch(e) {
        return { error: "返回数据解析失败" };
    }

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        return { error: "该 orgid 无可用直播流" };
    }

    if (num < 0 || num >= data.data.length) {
        return { error: `num 超出范围：0-${data.data.length - 1}` };
    }

    const url = data.data[num].stream;

    if (!url) {
        return { error: "未获取到直播流地址" };
    }

    return { url: url };
}