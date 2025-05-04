from flask import Flask, Response, render_template_string, request, jsonify
from flask_cors import CORS  # ← 追加
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from io import BytesIO
import csv
import os
import json
from collections import Counter
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # ← 追加：すべてのオリジンからのアクセスを許可

DATA_DIR = os.path.expanduser("~/Desktop/mertracker/mertracker/data")  # 必要に応じて修正

def load_price_data():
    keywords = ["PS5", "Switch", "iPhone"]
    data = {}
    for keyword in keywords:
        filename = f"{keyword.lower()}_prices.csv"
        filepath = os.path.join(DATA_DIR, filename)
        dates, prices = [], []
        if os.path.exists(filepath):
            with open(filepath, newline="") as f:
                reader = csv.reader(f)
                for row in reader:
                    if len(row) == 2:
                        price, timestamp = row
                        try:
                            prices.append(int(price))
                            dates.append(datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S"))
                        except ValueError:
                            continue
            data[keyword] = (dates, prices)
    return data

def check_price_alerts():
    print("📡 価格変動チェック中...")
    all_data = load_price_data()
    for kw, (dates, prices) in all_data.items():
        if len(prices) >= 2:
            latest = prices[-1]
            previous = prices[-2]
            percent = ((latest - previous) / previous) * 100
            if abs(percent) >= 10:
                print(f"⚠️ アラート [{kw}]: 前回比 {percent:+.2f}% → {previous}円 → {latest}円")

@app.route("/")
def index():
    return render_template_string("""
        <h1>📈 メルカリ価格推移グラフ</h1>
        <img src="/graph" alt="価格グラフ">
        <p><a href="/all">▶️ 全キーワード比較グラフへ</a> | <a href="/status">📋 ステータス</a></p>
    """)

@app.route("/graph")
def graph():
    keyword = request.args.get("keyword")
    graph_type = request.args.get("type", "line")
    days_param = request.args.get("days")
    all_data = load_price_data()
    fig, ax = plt.subplots(figsize=(12, 6))
    days = int(days_param) if days_param and days_param.isdigit() else 0

    def plot_data(dates, prices, label):
        if days > 0:
            cutoff = datetime.now() - timedelta(days=days)
            filtered = [(d, p) for d, p in zip(dates, prices) if d >= cutoff]
            if not filtered:
                return
            dates, prices = zip(*filtered)
        if graph_type == "bar":
            ax.bar(dates, prices, label=label)
        else:
            ax.plot(dates, prices, label=label, marker="o")

    if keyword and keyword in all_data:
        dates, prices = all_data[keyword]
        plot_data(dates, prices, keyword)
    else:
        for kw, (dates, prices) in all_data.items():
            plot_data(dates, prices, kw)

    ax.set_title("メルカリ価格推移（平均）")
    ax.set_xlabel("日付")
    ax.set_ylabel("価格（円）")
    ax.legend()
    ax.grid(True)
    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    plt.close(fig)
    return Response(buf.getvalue(), mimetype='image/png')

@app.route("/status")
def price_status():
    all_data = load_price_data()
    rows = []
    for kw, (dates, prices) in all_data.items():
        if len(prices) >= 2:
            latest = prices[-1]
            previous = prices[-2]
            diff = latest - previous
            percent = (diff / previous) * 100
            rows.append((kw, latest, previous, diff, percent))
        elif prices:
            latest = prices[-1]
            rows.append((kw, latest, "-", "-", "-"))
        else:
            rows.append((kw, "-", "-", "-", "-"))
    return render_template_string("""
        <h1>📋 平均価格の前回比ステータス</h1>
        <table border="1">
            <tr><th>キーワード</th><th>最新価格</th><th>前回価格</th><th>差額</th><th>変動率</th></tr>
            {% for row in rows %}
            <tr>
                <td>{{ row[0] }}</td>
                <td>￥{{ row[1] }}</td>
                <td>{% if row[2] != "-" %}￥{{ row[2] }}{% else %}-{% endif %}</td>
                <td>{% if row[3] != "-" %}{{ "+" if row[3] >= 0 else "" }}{{ row[3] }}{% else %}-{% endif %}</td>
                <td>{% if row[4] != "-" %}{{ "+" if row[4] >= 0 else "" }}{{ "%.2f" % row[4] }}%{% else %}-{% endif %}</td>
            </tr>
            {% endfor %}
        </table>
    """, rows=rows)

@app.route("/api/average-prices")
def api_average():
    all_data = load_price_data()
    result = []
    for kw, (dates, prices) in all_data.items():
        if len(prices) >= 2:
            latest = prices[-1]
            previous = prices[-2]
            diff = latest - previous
            percent = round((diff / previous) * 100, 2)
            result.append({"keyword": kw, "latest": latest, "previous": previous, "diff": diff, "percent": percent})
        elif prices:
            latest = prices[-1]
            result.append({"keyword": kw, "latest": latest, "previous": "-", "diff": "-", "percent": "-"})
        else:
            result.append({"keyword": kw, "latest": "-", "previous": "-", "diff": "-", "percent": "-"})
    return jsonify(result)

@app.route("/api/popular-keywords")
def popular_keywords():
    log_path = os.path.join(DATA_DIR, "search_logs.json")
    if not os.path.exists(log_path): return jsonify([])
    try:
        with open(log_path, "r") as f:
            logs = json.load(f)
    except Exception:
        return jsonify([])

    now = datetime.now()
    recent_logs = [log["keyword"] for log in logs if "timestamp" in log and datetime.strptime(log["timestamp"], "%Y-%m-%dT%H:%M:%S") > now - timedelta(days=1)]
    counter = Counter(recent_logs)
    top_keywords = [kw for kw, _ in counter.most_common(30)]
    return jsonify(top_keywords)

@app.route("/api/trends")
def api_trends():
    log_path = os.path.join(DATA_DIR, "search_logs.json")
    if not os.path.exists(log_path): return jsonify({"ranking": [], "surging": []})
    try:
        with open(log_path, "r") as f:
            logs = json.load(f)
    except Exception:
        return jsonify({"ranking": [], "surging": []})

    now = datetime.now()
    recent_logs = [log["keyword"] for log in logs if "timestamp" in log and datetime.strptime(log["timestamp"], "%Y-%m-%dT%H:%M:%S") > now - timedelta(days=1)]
    recent_counter = Counter(recent_logs)
    surging = [kw for kw, _ in recent_counter.most_common(30)]

    all_keywords = [log["keyword"] for log in logs if "keyword" in log]
    all_counter = Counter(all_keywords)
    ranking = [kw for kw, _ in all_counter.most_common(30)]

    return jsonify({"ranking": ranking, "surging": surging})

@app.route("/api/log", methods=["POST"])
def log_search():
    log_path = os.path.join(DATA_DIR, "search_logs.json")
    try:
        logs = []
        if os.path.exists(log_path):
            with open(log_path, "r") as f:
                logs = json.load(f)
        body = request.json
        logs.append({"keyword": body.get("keyword"), "timestamp": datetime.now().strftime("%Y-%m-%dT%H:%M:%S")})
        with open(log_path, "w") as f:
            json.dump(logs[-200:], f, indent=2, ensure_ascii=False)
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)})

if __name__ == "__main__":
    check_price_alerts()
    app.run(debug=True, port=5001)