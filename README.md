# Infoglobal Executive Summary Dashboard 
_Infoglobal Executive Summary Dashboard_ merupakan sebuah aplikasi berbasis web yang menampilkan informasi mengenai seluruh aktivitas proyek yang sedang berjalan di PT. Infoglobal Teknologi Semesta. Data dari _dashboard_ ini bersifat real-time dengan mengakses [API Open Project](https://www.openproject.org/docs/api/).

## Tech Stack

- Frontend: [React.js](https://react.dev/learn), [Chart.js](https://www.chartjs.org/docs/latest/)
- Backend: [Python FastAPI](https://devdocs.io/fastapi/)

## Backend Setup and Installation

1. Clone repository
```
git clone "https://github.com/dhiyarisalah/dashboard-exe-summary.git"
```
2. Masuk ke path folder backend
3. Buat virtual env Python
```
python -m venv env
```
4. Aktifkan virtual env python
```
source env/bin/activate
```
5. Install Python depedencies
```
pip3 install -r requirements.txt
```
6. Jalankan backend
```
uvicorn main:app --reload
```
