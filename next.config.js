// next.config.js
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    // fs モジュールの設定を削除
    return config;
  },
};