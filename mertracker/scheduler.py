import schedule
import time
import subprocess

def job():
    print("📦 Mercariスクレイピング実行中...")
    result = subprocess.run(
        ["python3", "scraper/mercari_scraper.py"],
        capture_output=True,
        text=True
    )
    print(result.stdout)

# スケジューラ起動前に1回だけ実行（テスト用）
job()

# 毎時0分に実行
schedule.every().hour.at(":00").do(job)

print("🔁 スケジューラー起動中...")

while True:
    schedule.run_pending()
    time.sleep(1)