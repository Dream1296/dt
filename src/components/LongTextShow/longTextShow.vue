<template>
    <div class="article-container_long_text" v-html="props.data">

    </div>

</template>


<script setup lang="ts">


const props = defineProps<{
    data: string,
}>();








</script>



<style>
/* 文章容器样式 */
.article-container_long_text {
    background-color: white;
    padding: 20px;
    /* 内边距稍微增加 */
    border-radius: 12px;
    /* 圆角更柔和 */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    /* 柔和且稍大的阴影 */
    margin: 0 auto;
    max-width: 820px;
    /* 容器最大宽度稍微增加 */
    transition: all 0.3s ease-in-out;
    /* 容器的动画效果 */
}

.article-container_long_text:hover {
    transform: translateY(-5px);
    /* 鼠标悬停时，容器上升一点 */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    /* 更深的阴影效果 */
}

/* 文章标题样式 */
.article-container_long_text h1 {
    font-size: 2.6rem;
    /* 稍微增大标题字体 */
    color: #f28bb3;
    /* 更柔和的粉色 */
    margin-bottom: 25px;
    /* 增加与正文的间距 */
    text-align: center;
    /* 标题居中 */
    font-weight: 600;
    /* 加粗标题 */
    letter-spacing: 1px;
    /* 字母间距，增加标题的优雅感 */
}

/* 文章段落样式 */
.article-container_long_text p {
    /* 稍微增大正文字体 */
    color: #6f4a8e;
    /* 深紫色，增加可读性 */
    margin: 5px 0 !important;
    /* 段落间隔略微增大 */
    text-align: justify;
    /* 自然对齐 */
    line-height: 1.8;
    /* 增加行间距，使文章更为舒适 */
    text-indent: 2ch;
    /* 首行缩进2个字符 */
}

/* 链接样式 */
.article-container_long_text a {
    color: #ff69b4;
    /* 热情的粉色 */
    text-decoration: none;
    font-weight: 500;
    /* 使链接更醒目 */
    transition: color 0.3s ease-in-out;
    /* 链接的渐变效果 */
}

.article-container_long_text a:hover {
    color: #ff1493;
    /* 悬浮时变为更亮的粉色 */
    text-decoration: underline;
}

/* 在图片添加样式时确保它们自适应 */
.article-container_long_text img {
    max-width: 100%;
    /* 确保图片不会超出容器 */
    border-radius: 10px;
    /* 图片边缘圆角 */
    margin-bottom: 20px;
    /* 图片与文本之间增加间隔 */
}

/* 引用或强调文本样式 */
.article-container_long_text blockquote {
    border-left: 4px solid #f28bb3;
    /* 引用框左侧粉色线条 */
    padding-left: 15px;
    color: #6f4a8e;
    font-style: italic;
    margin-bottom: 20px;
}

/* 增加一些按钮样式（如果有按钮的话） */
.article-container_long_text button {
    background-color: #ff69b4;
    /* 按钮粉色背景 */
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.article-container_long_text button:hover {
    background-color: #ff1493;
    /* 按钮悬浮效果 */
}


.end-mark_long_text {
    margin-top: 30px;
    text-align: center;
    font-size: 1.2rem;
    /* 小巧的字体大小 */
    font-weight: bold;
    color: #8b2a5c;
    /* 深粉色 */
    position: relative;
}

/*  */

.end-mark_long_text span {
    letter-spacing: 2px;
    /* 字符间距 */
    text-transform: uppercase;
    /* 全部大写 */
}

.end-mark_long_text:hover {
    color: #ff6b81;
    /* 鼠标悬停时颜色变化 */
    cursor: pointer;
}


/* 用户输入样式 */
/* 用户输入样式 */
.gpt_user {
    background-color: #f7c6d1;
    /* 淡粉色背景 */
    color: #4e1e64;
    /* 深紫色字体，增强可读性 */
    padding: 15px 20px;
    /* 增加内边距，让文本更舒适 */
    border-radius: 12px;
    /* 圆角 */
    margin-bottom: 15px;
    /* 适当的底部间距 */
    width: 85%;
    /* 宽度占85% */
    align-self: flex-end;
    /* 用户输入靠右显示 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* 柔和的阴影效果 */
    font-size: 1.2rem;
    /* 字体大小适中 */
    text-align: left;
    /* 左对齐 */
    word-wrap: break-word;
    /* 防止长单词溢出 */
    display: flex;
    /* 使用flex布局 */
    flex-direction: column;
    /* 垂直排列对话 */
    gap: 10px;
    /* 增加对话框之间的间距 */
    position: relative; /* 让时间可以相对于这个框进行定位 */
}

/* AI输出样式 */
.gpt_ai {
    background-color: #fce4ec;
    /* 淡粉色背景，比用户输入更浅 */
    color: #6a2c84;
    /* 深紫色字体，增强可读性 */
    padding: 15px 20px;
    /* 增加内边距 */
    border-radius: 12px;
    /* 圆角 */
    margin-bottom: 15px;
    /* 适当的底部间距 */
    text-align: center;
    /* 中心对齐AI文本 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* 柔和的阴影效果 */
    font-size: 1.2rem;
    /* 字体大小适中 */
    word-wrap: break-word;
    /* 防止长单词溢出 */
    display: flex;
    /* 使用flex布局 */
    flex-direction: column;
    /* 垂直排列对话 */
    gap: 10px;
    /* 增加对话框之间的间距 */
    position: relative; /* 让时间可以相对于这个框进行定位 */
}

/* 时间样式，绝对定位到对话框的顶部 */
.chatDate {
    font-size: 0.8rem;
    color: #999;
    position: absolute;
    top: 6px; /* 让时间悬浮在对话框上方 */
    right: 10px; /* 右对齐 */
}

.bold{
    font-weight:800;
}
.my_hr{
    width: 100%;
    height: 2px;
    margin-top: 5px;
    margin-bottom: 5px;

    background-color: rgb(0, 0, 0);
}


</style>