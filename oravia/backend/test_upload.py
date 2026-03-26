import requests
with open('test.mp4','rb') as f:
    resp = requests.post('http://localhost:8000/api/upload-video', files={'file': ('test.mp4', f, 'video/mp4')})
print('STATUS:', resp.status_code)
print(resp.text)
