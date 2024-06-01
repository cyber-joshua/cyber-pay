## CyberPay Introduction

CyberPay is a mobile app which can make people pay cryptocurrencies to buy things in really life much easier, just like wechat pay.

### Why CyberPay

因为上个月大部分时间都在研究passkey，研发过程中玩下来的感受就是比eoa方便很多。发送tx只需要验一下指纹或者faceID刷一下就好，比跳浏览器钱包sign一下简洁. 特别在手机上，不管是rainbow还是metamask，connect和签名这种app之间的交互需要很长时间，一点都不丝滑。所以hackthon一开始，就想做一个手机支付app，用passkey就可以和微信支付一样方便的transfer cyptocurrencies了！

### Highlights

1. 帮助web2用户更好的进入web3！支付的整个过程不需要用户接触任何web3特有的界面或者工具，只需要一开始创建完钱包之后求个好心人给他转点币即可，剩下的就不需要web3的知识了
2. 目前能这么方便transfer token的可能只有像币安这种cex，那CyberPay就比他们decentralized很多。
3. 完成了一整套微信扫码支付的流程，包括一个简单的页面可以帮助商家generate qrcode，还有收到钱会有播报提示，不用怕自己没收到！具体细节可以看视频

### Tech

1. 一开始想用React Native做，但毕竟是新东西，坑有点多，两天完不成就还是选择了Nextjs+PWA，请用默认浏览器打开添加到主屏幕使用
2. 用passkey签名，这是之前研发过程中遇到的最大的困难，没有很官方的教程，一直在自己试，最后才生成正确格式的signature
3. 用framer motion加了很多动画在app里，毕竟本来就想做和web2一样丝滑的web3 app，加一点动画可以更smooth一点!

### How to use

1. 用手机默认浏览器打开： https://cyber-pay.vercel.app/
2. 添加到主屏幕
3. create a wallet
4. 给自己用passkey新生成的wallet address转点tokens（仅支持Cyber Testnet上的ETH和USDC）
5. https://cyber-pay.vercel.app/vendor 可以生成测试用的二维码
6. scan generated qrcode and click "Confirm" to pay
7. 可以先用这个二维码来玩一下
   <img width="260" alt="Screenshot 2024-06-01 at 22 16 22" src="https://github.com/cyber-joshua/cyber-pay/assets/153577918/80e7315d-4afc-443c-b537-114f8f5f3bcc">


### Video Link

https://drive.google.com/file/d/1f-S7-rcuSbPXK6UKXIzmk_8NLBvew1BE/view?usp=sharing

因为这个project的main feature就是想做一个生活中可以像微信支付一样方便的web3支付，所以拍了一个应用场景哈
