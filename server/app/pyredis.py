from django.conf import settings
import redis, json

if settings.DATABASES['Redis']['OPEN']:
    conn_pool = redis.ConnectionPool(
        host=settings.DATABASES['Redis']['HOST'],
        port=int(settings.DATABASES['Redis']['PORT']),
        decode_responses=True,
    )

RedisCache = redis.Redis(connection_pool=conn_pool, decode_responses=True)
RedisCache.ping()
print("connect redis success")
print("connect redis success")
print("connect redis success")
print("connect redis success")
print("connect redis success")


# set a key. grab the id then have it formatted
def CampDetailKey(id):
    return f"camp_detail_{id}"


# insert to redis
if settings.DATABASES['Redis']['OPEN']:
    def SetCampDetail(id, detail):
        key = CampDetailKey(id)
        value = json.dumps(detail, ensure_ascii=False)
        RedisCache.set(key, value, ex=3600)

# query from redis
if settings.DATABASES['Redis']['OPEN']:
    def GetCamp(id):
        key = CampDetailKey(id)
        detail = (RedisCache.
                  get(key))
        if detail is not None:
            return json.loads(detail)
        return None

#  delete from redis
if settings.DATABASES['Redis']['OPEN']:
    def DelCampDetail(id):
        key = CampDetailKey(id)
        RedisCache.delete(key)
