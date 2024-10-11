const data = `
{
    "user": "yw",
    "name": "不爱吃糖",
    "touxian": "yw02.png",
    "text": "重构，测试，^[惊讶]^，这是一段文本^[闭嘴]^",
    "img": "./dtimg/17256117363310.png-./dtimg/17256117363311.png-./dtimg/17256117363312.png-./dtimg/17256117363313.png",
    "video": "0",
    "date": "2024-09-06T08:35:00.000Z",
    "id": 388,
    "idea": "0",
    "com": [
        {
            "date": "2024-09-06T09:11:54.000Z",
            "content": "这是一条评论",
            "dtId": 388,
            "commentsUser": "yw",
            "name": "不爱吃糖"
        },
        {
            "date": "2024-09-06T09:12:02.000Z",
            "content": "这是另一条评论",
            "dtId": 388,
            "commentsUser": "yw",
            "name": "不爱吃糖"
        },
        {
            "date": "2024-09-07T13:00:40.000Z",
            "content": "这是第3条评论",
            "dtId": 388,
            "commentsUser": "yw",
            "name": "不爱吃糖"
        },
        {
            "date": "2024-09-07T13:02:40.000Z",
            "content": "第4条",
            "dtId": 388,
            "commentsUser": "yw",
            "name": "不爱吃糖"
        }
    ],
    "showVideo": false,
    "imgs": [
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363310.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363311.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363312.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363313.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363310.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363311.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363312.png",
        "https://172.16.3.12:3010/api/dtimg?name=./dtimg/17256117363313.png"
    ],
    "imgMore":"true",
    "textArr": [
        {
            "type": "text",
            "text": "重"
        },
        {
            "type": "text",
            "text": "构"
        },
        {
            "type": "text",
            "text": "，"
        },
        {
            "type": "text",
            "text": "测"
        },
        {
            "type": "text",
            "text": "试"
        },
        {
            "type": "text",
            "text": "，"
        },
        {
            "type": "emoji",
            "text": "惊讶"
        },
        {
            "type": "text",
            "text": "，"
        },
        {
            "type": "text",
            "text": "这"
        },
        {
            "type": "text",
            "text": "是"
        },
        {
            "type": "text",
            "text": "一"
        },
        {
            "type": "text",
            "text": "\\n"
        },
        {
            "type": "text",
            "text": "文"
        },
        {
            "type": "text",
            "text": "本"
        },
        {
            "type": "emoji",
            "text": "闭嘴"
        }
    ]
}


`

export let data1 = JSON.parse(data);