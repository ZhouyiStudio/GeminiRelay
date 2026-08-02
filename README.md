# GeminiRelay

一个极简的 Cloudflare Worker，用于反向代理 Google Gemini API 请求。原样转发方法、请求头、请求体、查询参数，不做任何解析或修改，方便在无法直连 Google 服务器的网络环境下访问 Gemini API。

## 特性

- **零修改转发**：请求方法（GET/POST/...）、请求头、请求体、查询参数（包括 `?key=xxx`）全部原样转发给 Gemini API
- **支持流式响应**：兼容 `streamGenerateContent` 等 SSE 流式接口
- **内置 CORS**：自动添加跨域响应头，浏览器/网页应用可直接调用
- **健康检查页**：访问根路径 `/` 会返回纯 JSON 状态信息，不含任何跳转或第三方内容，方便确认代理是否正常工作
- **无第三方依赖**：单文件，无需安装任何 npm 包

## 部署方式

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Worker**
2. 将 `gworker.js` 的内容粘贴到在线编辑器中
3. 保存并部署（Deploy）
4. （可选）在 **Settings → Triggers** 中绑定自定义域名
> [!IMPORTANT]
> 注意（不看容易失败）
> <img width="1994" height="1063" alt="QQ_1785649739292" src="https://github.com/user-attachments/assets/73ef19a9-0e3a-446e-991f-a925d269bbc8" />
> <img width="1995" height="1071" alt="QQ_1785649916061" src="https://github.com/user-attachments/assets/39726928-90cb-4159-af91-85e9cca38fd4" />
> 也可以选择服务模式：
> <img width="1995" height="1069" alt="QQ_1785650025102" src="https://github.com/user-attachments/assets/45aa2a52-f891-494a-b1c2-1b21e3aeada3" />



## 使用方法

将客户端原本请求的 Host

```
generativelanguage.googleapis.com
```

替换成你的 Worker 域名（例如 `gaiproxy.zhouyistudio.workers.dev` 或绑定的自定义域名），其余路径、参数、请求体完全不变即可。

### 示例

**原始请求：**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY
```

**代理后请求：**
```
https://gaiproxy.zhouyistudio.workers.dev/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY
```

## 健康检查

访问 Worker 根路径，确认代理是否正常运行：

```bash
curl https://gaiproxy.zhouyistudio.workers.dev/
```

正常返回：

```json
[
  {
    "status": "ok",
    "code": 200,
    "message": "Proxy is OK",
    "target": "generativelanguage.googleapis.com"
  },
  {
    "by": "Zhouyi2013",
    "github": "github.com/ZhouyiStudio"
  }
]
```

> ⚠️ 如果访问根路径时看到的不是上面这段纯 JSON，而是带有跳转按钮、广告或其他第三方域名内容，说明该域名 **没有正确指向这个 Worker**，请检查 Cloudflare 的 DNS 记录或 Worker Routes 配置，排查是否被解析到了其他服务上。

## 注意事项

- 本代理不存储、不记录任何请求内容或 API Key，纯转发
- 请妥善保管你的 Gemini API Key，不要将其硬编码在公开代码中
- 如需限制访问来源（例如只允许特定域名跨域调用），可自行修改 CORS 相关响应头配置
