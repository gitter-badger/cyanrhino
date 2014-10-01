@echo off


taskkill /im "node.exe" /f
taskkill /im "mongod.exe" /f

del "C:\Program Files\MongoDB 2.6 Standard\data\db\mongod.lock"
mongod --repair

exit 1