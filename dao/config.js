var config = {}


//Important keys to connect to azure.

config.endpoint = "https://intconstructionsqldb.documents.azure.com:443/";
config.primaryKey = "yu8sWtAHCVdbuH34MOD1nGCx5qpPn1qwPo1rjoecRlz3SWzBTeb64fA2QzCedoh0mEGS5tltugN41KoDDQF6aw==";

config.database = {
    "id": "ConstructionDevicesData"
};

config.collection = {
    "id": "ConstructionDevices"
};


module.exports = config;
