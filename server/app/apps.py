# apps/apps.py

from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import json, time, hashlib
import json

from . import pymongo
from bson import binary
from bson.objectid import ObjectId

from . import pyredis

# temp DB: detail
camp_data = [

]

# temp DB: comments
comments_data = [

]

# temp DB: pic
pics = {

}


# public respond method
def response(code: int, message: str, data: any = None):
    body = {'code': code, 'message': message, 'data': {}}
    if data is not None:
        if hasattr(data, '__dict__'):
            body['data'] = data.__dict__
        else:
            body['data'] = data

    return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))


# ////layer 1: camp
@require_http_methods('GET')
def retrieveAllCamps(request):
    camps = []
    datas = pymongo.MongoDB.camps.find({}, {"_id": 1, "title": 1, "stars": 1, "desc": 1, "imgs": 1}).sort("time",-1).limit(100)
    for data in datas:
        camps.append({
            "campID": str(data["_id"]),
            "title": data["title"],
            "stars": int(data["stars"]),
            "desc": data["desc"],
            "imgs": data["imgs"],
        })

    return response(0, 'ok', camps)


# ////layer 2.1: camp -> new camp
@require_http_methods('POST')
def addCamp(request):
    if str(request.body, 'utf-8') == '':
        return response(1, " can't use empty element value")

    camp = {
        "campID": "",
        "title": "",
        "user": "",
        "stars": 0,
        "desc": "",
        "lat": 0,
        "lng": 0,
        "address": "",
        "comments": 0,
        "time": int(time.time()),
        "imgs": []
    }

    param = json.loads(request.body.decode('utf-8'))

    # titleName = "{}{}".format(param["title"], time.time())
    # camp['campID'] = hashlib.md5(titleName.encode("utf-8")).hexdigest()

    # if "campID" not in param or param["campID"] == "":
    #     return response(1, "element campID can't be empty")
    # camp["campID"] = param["campID"]

    if "title" not in param or param["title"] == "":
        return response(1, "element title can't be empty")
    camp["title"] = param["title"]

    if "user" not in param or param["user"] == "":
        return response(1, "element user can't be empty")
    camp["user"] = param["user"]

    if "stars" not in param:
        return response(1, "element stars can't be empty")
    camp["stars"] = param["stars"]

    if "desc" not in param:
        return response(1, "element desc can't be empty")
    camp["desc"] = param["desc"]

    if "lat" not in param or "lng" not in param:
        return response(1, "element latlng can't be empty")
    camp["lat"] = param["lat"]
    camp["lng"] = param["lng"]

    if "address" not in param:
        return response(1, "element address can't be empty")
    camp["address"] = param["address"]

    if "imgs" not in param:
        return response(1, "element imgs can't be empty")
    camp["imgs"] = param["imgs"]

    # camp_data.append(camp)
    pymongo.MongoDB.camps.insert_one(camp)
    return response(0, 'ok')


@require_http_methods('POST')
def uploadPic(request):
    # file process
    f = request.FILES['file']
    body = f.read()
    md5 = hashlib.md5(body).hexdigest()  # img id
    typ = f.content_type

    # mongodb operation
    img = pymongo.MongoDB.images.find_one({"md5": md5})
    # if img already in DB, it should not be add again, check before insert
    if img is not None:
        print("find md5 image")
        return response(0, "ok", {"id": str(img["_id"])})

    data = {"md5": md5, "type": typ, "body": binary.Binary(body)}
    ret = pymongo.MongoDB.images.insert_one(data)
    print("insert image")
    return response(0, "ok", {"id": str(ret.inserted_id)})


# ////layer 2.2: camp -> details

@require_http_methods('GET')
def retrieveCamp(request):
    ## pre mongoed logic
    # campID = request.GET.get("campID", "")  # Use "campID" to match the query parameter name
    # data = findCampByID(camp_data, campID)  # Use "campID" to match the variable name

    id = request.GET.get("campID", "")

    ##redis process
    # 1. query from redis, if it has
    camp = pyredis.GetCamp(id)
    if camp is not None:
        print("find by redis")
        return response(0, "ok", camp)

    ## mongo process
    camp = {}

    data = pymongo.MongoDB.camps.find_one({"_id": ObjectId(id)})
    if data is None:
        return response(1, "data doesnt exist")
    camp = {
        "campID": str(data["_id"]),
        "user": data["user"],
        "title": data["title"],
        "stars": data["stars"],
        "desc": data["desc"],
        "lat": data["lat"],
        "lng": data["lng"],
        "address": data["address"],
        "comments": data["comments"],
        "time": int(data["time"]),
        "imgs": data["imgs"],
    }

    pyredis.SetCampDetail(id, camp)
    print("find by mongodb")
    return response(0, 'ok', camp)


# def findCampByID(camp_data, campID):
#     for i in range(len(camp_data)):
#         if camp_data[i]['campID'] == campID:
#             return camp_data[i]
#     return None


@require_http_methods('GET')
def retrievePics(request):
    id = request.GET.get("id", "")
    img = pymongo.MongoDB.images.find_one({"_id": ObjectId(id)})
    if img is None:
        return response(100, 'pic does not exist')
    return HttpResponse(img['body'], img['type'])


# //// layer 3: camp -> details -> comments

@require_http_methods('POST')
def commentAdd(request):
    if str(request.body, 'utf-8') == '':
        return response(1, " can't use empty element value")

    param = json.loads(request.body.decode('utf-8'))

    comment = {
        "campID": "",
        "user": "",
        "stars": 0,
        "time": int(time.time()),
        "desc": ""
    }

    if "campID" not in param or param["campID"] == "":
        return response(1, "element campID  can't be empty")
    comment["campID"] = param["campID"]

    # check whether a camp exist before adding
    camp = pymongo.MongoDB.camps.find_one({"_id": ObjectId(param["campID"])})
    if camp is None:
        return response(1, "empty data")

    if "user" not in param or param["user"] == "":
        return response(1, "element user  can't be empty")
    comment["user"] = param["user"]

    if "stars" not in param:
        return response(1, "element stars  can't be empty")
    comment["stars"] = param["stars"]

    if "desc" not in param:
        return response(1, "element desc  can't be empty")
    comment["desc"] = param["desc"]

    pymongo.MongoDB.comments.insert_one(comment)

    # update rating
    avgStars = int(((camp["stars"] * camp["comments"]) + comment["stars"]) / (camp["comments"] + 1))
    pymongo.MongoDB.camps.update_one({"_id": ObjectId(param["campID"])},
                                     {"$inc": {"comments": 1}, "$set": {"stars": avgStars}})

    # delete camp from raids
    pyredis.DelCampDetail(param["campID"])

    return response(0, 'ok')


@require_http_methods('GET')
def retrieveComments(request):
    commentList = []
    campID = request.GET.get("campID", "")
    datas = pymongo.MongoDB.comments.find({"campID": campID}).sort("time", -1).limit(5)
    for data in datas:
        commentList.append({
            "id": str(data["_id"]),
            "campID": data["campID"],
            "user": data["user"],
            "stars": int(data["stars"]),
            "time": int(data["time"]),
            "desc": data["desc"],
        })
    return response(0, "ok", commentList)


def findCommentByCampID(id):
    coms = []
    for i in range(len(comments_data)):
        if comments_data[i]['campID'] == id:
            coms.append(comments_data[i])
    return coms
