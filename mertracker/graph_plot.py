import matplotlib.pyplot as plt
import csv
import os
from datetime import datetime

# 対象のキーワード（ファイル名にも使う）
keywords = ["PS5", "Switch", "iPhone"]

base_path = os.path.expanduser("~/Desktop/mertracker/mertracker/data")

data = {}

for keyword in keywords:
    filename = f"{keyword.lower()}_prices.csv"
    filepath = os.path.join(base_path, filename)

    dates = []
    prices = []

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
    else:
        print(f"⚠️ ファイルが見つかりません: {filepath}")

import matplotlib
matplotlib.rcParams['font.family'] = 'AppleGothic'  # Macで日本語対応

plt.figure(figsize=(12, 6))

for keyword, (dates, prices) in data.items():
    plt.plot(dates, prices, label=keyword)

plt.title("メルカリ価格推移（平均）")
plt.xlabel("日付")
plt.ylabel("価格（円）")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(os.path.expanduser("~/Desktop/mertracker/mertracker/mercari_prices.png"))
plt.show()