# 音乐系统接口文档

## 基础信息
- **基础URL**: `http://localhost:8085/music`
- **请求格式**: `application/x-www-form-urlencoded;charset=UTF-8`
- **超时时间**: 5000ms
- **响应格式**: JSON格式

## 1. 用户相关接口 (ConsumerController)

### 1.1 用户登录
- **接口**: `GET /consumer/login/status`
- **请求参数**:
  - `username`: 用户名 (必填)
  - `password`: 密码 (必填)
- **响应数据**:
```json
{
  "code": 1,  // 1-成功, -1-失败
  "userMsg": {
    "id": 1,
    "username": "test",
    "password": "123456",
    "sex": 0,
    "phoneNum": "13800138000",
    "email": "test@example.com",
    "birth": "1990-01-01",
    "introduction": "用户简介",
    "location": "北京",
    "avator": "/music/avatorImages/xxx.jpg",
    "createTime": "2025-10-15 10:00:00",
    "updateTime": "2025-10-15 10:00:00"
  }
}
```

### 1.2 用户注册
- **接口**: `POST /consumer/add`
- **请求数据**: Consumer对象
  - `username`: 用户名 (必填)
  - `password`: 密码
  - `sex`: 性别 (0-女, 1-男)
  - `phoneNum`: 手机号
  - `email`: 邮箱
  - `birth`: 生日
  - `introduction`: 简介
  - `location`: 地区
- **响应数据**:
```json
{
  "code": 1,  // 1-成功, 0-失败
  "msg": "注册成功",
  "userMsg": {用户对象}
}
```

### 1.3 更新用户信息
- **接口**: `POST /consumer/update`
- **请求数据**: Consumer对象 (JSON格式)
  - `id`: 用户ID (可选，有则更新，无则新增)
  - `username`: 用户名
  - `password`: 密码
  - `sex`: 性别
  - `phoneNum`: 手机号
  - `email`: 邮箱
  - `birth`: 生日
  - `introduction`: 简介
  - `location`: 地区
- **响应数据**:
```json
{
  "success": true
}
```

### 1.4 客户端更新用户信息
- **接口**: `GET /consumer/client/update`
- **请求参数**: Consumer对象字段
  - `id`: 用户ID (可选)
  - `username`: 用户名 (必填)
  - `password`: 密码
  - `sex`: 性别
  - `phoneNum`: 手机号
  - `email`: 邮箱
  - `birth`: 生日
  - `introduction`: 简介
  - `location`: 地区
- **响应数据**:
```json
{
  "code": 1,  // 1-成功, -1-失败
  "msg": "用户账号名格式，不能为空！！"
}
```

### 1.5 获取用户详情
- **接口**: `GET /consumer/detail`
- **请求参数**:
  - `id`: 用户ID (必填)
- **响应数据**:
```json
{
  "code": 1,
  "consumer": {用户对象}
}
```

### 1.6 用户列表查询
- **接口**: `GET /consumer/list`
- **请求参数**:
  - `name`: 用户名 (模糊查询，可选)
  - `pageNum`: 页码 (默认1)
  - `size`: 每页大小 (默认4)
- **响应数据**:
```json
{
  "list": [用户对象数组],
  "total": 100
}
```

### 1.7 删除用户
- **接口**: `GET /consumer/delete`
- **请求参数**:
  - `id`: 用户ID (必填)
- **响应数据**:
```json
{
  "success": true
}
```

### 1.8 更新用户头像
- **接口**: `POST /consumer/avatar/update`
- **请求数据**:
  - `file`: 头像文件 (MultipartFile)
  - `id`: 用户ID (必填)
- **响应数据**:
```json
{
  "code": 1,  // 1-成功, 0-失败
  "msg": "修改头像成功",
  "avator": "/music/avatorImages/xxx.jpg"
}
```

## 2. 歌手相关接口 (SingerController)

### 2.1 歌手列表查询
- **接口**: `GET /singer/list`
- **请求参数**:
  - `name`: 歌手名 (模糊查询，可选)
  - `pageNum`: 页码 (默认1)
  - `size`: 每页大小 (默认10)
- **响应数据**:
```json
{
  "list": [歌手对象数组],
  "total": 50
}
```

### 2.2 按性别查询歌手
- **接口**: `GET /singer/sex/detail`
- **请求参数**:
  - `sex`: 性别 (必填，0-女, 1-男, 2-组合)
- **响应数据**:
```json
{
  "list": [歌手对象数组]
}
```

## 3. 歌曲相关接口 (SongController)

### 3.1 根据歌曲ID查询
- **接口**: `GET /song/detail`
- **请求参数**:
  - `id`: 歌曲ID (必填)
- **响应数据**:
```json
{
  "song": {
    "id": 1,
    "singerId": 1,
    "name": "歌曲名",
    "introduction": "歌曲简介",
    "createTime": "2025-10-15 10:00:00",
    "updateTime": "2025-10-15 10:00:00",
    "pic": "/music/img/songPic/xxx.jpg",
    "lyric": "歌词内容",
    "url": "/music/song/xxx.mp3"
  }
}
```

### 3.2 根据歌手ID查询歌曲
- **接口**: `GET /song/singer/detail`
- **请求参数**:
  - `singerId`: 歌手ID (必填)
- **响应数据**:
```json
{
  "list": [歌曲对象数组]
}
```

### 3.3 根据歌曲名模糊查询
- **接口**: `GET /song/singerName/detail`
- **请求参数**:
  - `name`: 歌曲名 (模糊查询，必填)
- **响应数据**:
```json
{
  "list": [歌曲对象数组]
}
```

## 4. 文件上传接口 (FileController)

### 4.1 头像上传
- **接口**: `POST /file/avatar/upload`
- **请求数据**:
  - `file`: 头像文件 (MultipartFile)
- **响应数据**:
```json
{
  "success": true,
  "path": "/music/avatorImages/xxx.jpg"
}
```

### 4.2 音乐文件上传
- **接口**: `POST /file/music/upload`
- **请求数据**:
  - `file`: 音乐文件 (MultipartFile)
- **响应数据**:
```json
{
  "success": true,
  "path": "/music/song/xxx.mp3"
}
```

## 5. 评论相关接口 (ConsumerController.CommentController)

### 5.1 根据歌单ID查询评论
- **接口**: `GET /comment/songList/detail`
- **请求参数**:
  - `songListId`: 歌单ID (必填)
- **响应数据**:
```json
{
  "code": 1,
  "list": [评论对象数组]
}
```

## 通用响应格式
所有接口都遵循统一的响应格式：
```javascript
{
  "code": 200,        // 状态码 (1-成功, 0/-1-失败)
  "message": "success", // 消息
  "data": {}          // 实际数据
}
```

## 数据实体结构

### Consumer (用户实体)
```json
{
  "id": 1,
  "username": "用户名",
  "password": "密码",
  "sex": 0,
  "phoneNum": "手机号",
  "email": "邮箱",
  "birth": "生日",
  "introduction": "简介",
  "location": "地区",
  "avator": "头像路径",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

### Singer (歌手实体)
```json
{
  "id": 1,
  "name": "歌手名",
  "sex": 0,
  "pic": "头像路径",
  "birth": "生日",
  "location": "地区",
  "introduction": "简介"
}
```

### Song (歌曲实体)
```json
{
  "id": 1,
  "singerId": 1,
  "name": "歌曲名",
  "introduction": "歌曲简介",
  "createTime": "创建时间",
  "updateTime": "更新时间",
  "pic": "歌曲图片",
  "lyric": "歌词",
  "url": "歌曲文件路径"
}
```

## 注意事项
1. 所有POST请求使用`application/x-www-form-urlencoded`格式
2. GET请求参数通过URL查询字符串传递
3. 文件上传使用`multipart/form-data`格式
4. 接口支持跨域请求
5. 错误状态码处理：401(未登录)、403(权限不足)、404(资源不存在)