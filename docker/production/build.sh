mkdir client/src

cp -r ../../client/package*.json client/src
cp -r ../../client/public client/src
cp -r ../../client/src client/src
cp -r ../../client/tsconfig*.json client/src

cp -r ../../server/package*.json server/src
cp -r ../../server/src server/src
cp -r ../../server/tsconfig*.json server/src

docker-compose build

rm -r client/src
rm -r server/src
