const config = require('../config');
const expect = require('expect.js');
const OAuth = require('../');

let accessToken = {};
var api = new OAuth(config.appid, config.appsecret);

describe('oauth.js', function () {
  // getAuthorizeURL
  describe('getAuthorizeURL', function () {
    var auth = new OAuth('appid', 'appsecret');
    it('should ok', function () {
      var url = auth.getAuthorizeURL('http://test.org/');
      expect(url).to.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Ftest.org%2F&response_type=code&scope=snsapi_base&state=#wechat_redirect');
    });

    it('should ok with state', function () {
      var url = auth.getAuthorizeURL('http://test.org/', 'hehe');
      expect(url).to.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Ftest.org%2F&response_type=code&scope=snsapi_base&state=hehe#wechat_redirect');
    });

    it('should ok with state and scope', function () {
      var url = auth.getAuthorizeURL('http://test.org/', 'hehe', 'snsapi_userinfo');
      expect(url).to.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Ftest.org%2F&response_type=code&scope=snsapi_userinfo&state=hehe#wechat_redirect');
    });
  });

  // getAuthorizeURLForWebsite
  describe('getAuthorizeURLForWebsite', function () {
    var auth = new OAuth('appid', 'appsecret');
    it('should ok', function () {
      var url = auth.getAuthorizeURLForWebsite('http://test.org/');
      expect(url).to.be.equal('https://open.weixin.qq.com/connect/qrconnect?appid=appid&redirect_uri=http%3A%2F%2Ftest.org%2F&response_type=code&scope=snsapi_login&state=#wechat_redirect');
    });

    it('should ok with state', function () {
      var url = auth.getAuthorizeURLForWebsite('http://test.org/', 'hehe');
      expect(url).to.be.equal('https://open.weixin.qq.com/connect/qrconnect?appid=appid&redirect_uri=http%3A%2F%2Ftest.org%2F&response_type=code&scope=snsapi_login&state=hehe#wechat_redirect');
    });

    it('should ok with state and scope', function () {
      var url = auth.getAuthorizeURLForWebsite('http://test.org/', 'hehe', 'snsapi_userinfo');
      expect(url).to.be.equal('https://open.weixin.qq.com/connect/qrconnect?appid=appid&redirect_uri=http%3A%2F%2Ftest.org%2F&response_type=code&scope=snsapi_userinfo&state=hehe#wechat_redirect');
    });
  });



  // getAccessToken
  describe('getAccessToken', function () {
    console.log(api.getAuthorizeURL(config.redirect));

    it('should invalid', async function () {
      try {
        await api.getAccessToken('code');
      } catch (err) {
        expect(err).to.be.ok();
        expect(err.name).to.be.equal('WeChatAPIError');
        expect(err.message).to.contain('invalid code');
        return;
      }
      // should never be executed
      expect(false).to.be.ok();
    });

    describe('should ok', function () {
      it('should ok', async function () {
        var token = await api.getAccessToken(config.code);
        expect(token).to.have.property('data');
        expect(token.data).to.have.keys('access_token', 'expires_in', 'refresh_token', 'openid', 'scope', 'create_at');
        accessToken = token.data;
      });
    });
  });

  //refreshAccessToken
  describe('refreshAccessToken', function () {
    it('should ok', async function () {
      var token = await api.refreshAccessToken(accessToken.refresh_token);
      expect(token.data).to.have.keys('access_token', 'expires_in', 'refresh_token', 'openid', 'scope', 'create_at');
    });
  })

  // getUser
  describe('getUser', function () {
    it('should ok', async function () {
      var data = await api.getUser(accessToken.openid);
      expect(data).to.have.keys('openid', 'nickname', 'sex', 'province', 'city', 'country', 'headimgurl', 'privilege');
    });
  })

  //verifyToken
  describe('verifyToken', function () {
    it('should ok with verifyToken', async function () {
      var data = await api.verifyToken(accessToken.openid, accessToken.access_token);
      expect(data).to.have.keys('errcode', 'errmsg');
      expect(data.errcode).to.be.equal(0);
      expect(data.errmsg).to.be.equal('ok');
    });
  });

})