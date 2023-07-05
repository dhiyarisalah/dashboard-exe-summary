# Infoglobal Executive Summary Dashboard 
Infoglobal Executive Summary Dashboard merupakan sebuah aplikasi berbasis web yang menampilkan informasi mengenai seluruh aktivitas proyek yang sedang berjalan di PT. Infoglobal Teknologi Semesta. Data dari dashboard ini bersifat real-time dengan mengakses API Open Project.

## Tech Stack

- Frontend: [React.js](https://react.dev/learn)
- Backend: [FastAPI](https://devdocs.io/fastapi/)

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
./env/Scripts/activate
```
4. Aktifkan virtual env python (mac)
```
./env/bin
source activate
```
5. Install Python depedencies
```
pip3 install -r requirements.txt
```
6. Jalankan backend
```
uvicorn main:app --reload
```
