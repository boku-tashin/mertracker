# Mark Down - 中古相場トラッカー

中古品の相場を自動で収集・可視化するWebアプリです。  
メルカリの価格推移や出品数をグラフで確認できます。

## 主な機能

- ✅ メルカリの商品価格を自動取得（Selenium使用）
- 📈 平均価格の推移をグラフで可視化（Matplotlib）
- 🔍 検索ワードごとのランキング表示（人気・急上昇）
- ⭐ お気に入り機能（フロント側）
- 🕒 定時スクレイピング（スケジューラー連携）

## 技術スタック

- Frontend: Next.js, Tailwind CSS
- Backend: Flask (API)
- スクレイピング: Python + Selenium
- デプロイ: Vercel, Render
- DB: SQLite（予定）

## ローカルでの起動方法

```bash
# フロントエンド
cd new-project
npm install
npm run dev

# バックエンド
cd flask-server
pip install -r requirements.txt
python app.py
