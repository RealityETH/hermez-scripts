#!/bin/bash -x

#ZKEVM_NET=mainnet
ZKEVM_NET=testnet
ZKEVM_DIR=/var/lib/hermez
ZKEVM_CONFIG_DIR=/etc/hermez
#ZKEVM_ADVANCED_CONFIG_DIR=/etc/hermez-advanced

# Make sure nothing conflicts
docker container prune -f
rm -rf $ZKEVM_DIR

mkdir -p $ZKEVM_CONFIG_DIR
mkdir -p $ZKEVM_ADVANCED_CONFIG_DIR
mkdir -p $ZKEVM_DIR
mkdir -p "$ZKEVM_DIR/$ZKEVM_NET"
mkdir -p "$ZKEVM_DIR/data"

if [ -F $FILE ]; then
   #curl -L https://github.com/0xPolygonHermez/zkevm-node/releases/latest/download/$ZKEVM_NET.zip > $ZKEVM_NET.zip && unzip -o $ZKEVM_NET.zip -d $ZKEVM_DIR && rm $ZKEVM_NET.zip
   curl -L https://github.com/0xPolygonHermez/zkevm-node/releases/latest/download/$ZKEVM_NET.zip > $ZKEVM_NET.zip
fi

unzip -o $ZKEVM_NET.zip -d $ZKEVM_DIR 

cp ./hermez.env $ZKEVM_CONFIG_DIR/.env

# RUN:
docker compose --env-file $ZKEVM_CONFIG_DIR/.env -f $ZKEVM_DIR/$ZKEVM_NET/docker-compose.yml up -d


# put the db migration script somewhere we can read it
sudo cp ./zkevm-node/db/scripts/single_db_server.sql /var/lib/hermez/data/init_db.sql
# Edited to add user/db creation

sudo apt install postgresql
# edit postgresql.conf and pg_hba to allow the docker address
# todo: check if we need this

sudo su - postgres
psql < /var/lib/hermez/data/init_db.sql 
exit
