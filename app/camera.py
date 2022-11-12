import requests, base64
URL = "192.168.137.148:5001/image"


def getImage(task_id):
    r = requests.get(url = URL)
    data = r.json()

    with open(task_id+".png",'w+') as f:
        f.write(base64.b64decode(data))
