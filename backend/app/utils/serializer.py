
def serializeList(items) -> list:
    return [serializeDict(item) for item in items]


def serializeDict(item):
    item["_id"] = str(item["_id"])

    if "id" not in item or not item["id"]:
        item["id"] = item["_id"]

    return item