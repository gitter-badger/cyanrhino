@echo off 
del "C:\Program Files\MongoDB 2.6 Standard\data\db\mongod.lock"
mongod --repair
mongod --dbpath="C:\Program Files\MongoDB 2.6 Standard\data\db" --port=27017 --logpath="C:\Program Files\MongoDB 2.6 Standard\data\db\mongo.log"