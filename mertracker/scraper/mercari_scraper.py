from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv
import os

# キーワード一覧（自由に追加OK）
keywords = ["PS5", "Switch", "iPhone"]

# Chromeオプション設定
options = Options()
# options.add_argument("--headless=new")  # 開発中はオフで表示確認
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

print("✅ スクリプト開始")
print("🚀 Chromeドライバ起動中...")

# ドライバ起動
driver = webdriver.Chrome(options=options)

for keyword in keywords:
    url = f"https://jp.mercari.com/search?keyword={keyword}"
    print("\n--------------------------------------------")
    print(f"🔍 キーワード: {keyword}")
    print("🌐 アクセス先:", url)

    try:
        driver.get(url)

        WebDriverWait(driver, 15).until(EC.title_contains(keyword))
        print("✅ ページタイトル取得:", driver.title)

        WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'span[class^="number__"]'))
        )
        price_elements = driver.find_elements(By.CSS_SELECTOR, 'span[class^="number__"]')

        prices = []
        for elem in price_elements:
            text = elem.text.replace(",", "").strip()
            if text.isdigit():
                prices.append(int(text))

        if prices:
            avg_price = sum(prices) // len(prices)
            print(f"✅ 平均価格: ¥{avg_price}")

            filename = f"{keyword.lower()}_prices.csv"
            save_path = os.path.expanduser(f"~/Desktop/mertracker/mertracker/data/{filename}")
            os.makedirs(os.path.dirname(save_path), exist_ok=True)

            with open(save_path, mode="a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([avg_price, time.strftime("%Y-%m-%d %H:%M:%S")])
            print(f"✅ 保存完了: {save_path}")
        else:
            print("⚠️ 価格情報が見つかりませんでした")

    except Exception as e:
        print(f"❌ エラー発生（{keyword}）:", e)

driver.quit()
print("\n👋 終了しました")