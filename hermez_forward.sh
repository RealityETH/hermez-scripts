# This script will forward all the ports that appeared to be listening on hermez to localhost
# TODO: Pare this down to whichever ones we need, eg we want RPC so we can send transactions

if [ $# -eq 0 ]
then
 echo "Usage: ./hermez_forward <server_ip>"
 exit 0
fi

IP=$1

ssh -4 -N \
    -L 5433:127.0.0.1:5433 \
    -L 8123:127.0.0.1:8123 \
    -L 8133:127.0.0.1:8133 \
    -L 8545:127.0.0.1:8545 \
    -L 8546:127.0.0.1:8546 \
    -L 50052:127.0.0.1:50052 \
    -L 50061:127.0.0.1:50061 \
    -L 50071:127.0.0.1:50071 \
    -L 50081:127.0.0.1:50081 \
    -L 9091:127.0.0.1:9091 \
    -L 9092:127.0.0.1:9092 \
    -L 9093:127.0.0.1:9093 \
    -L 9094:127.0.0.1:9094 \
    -L 6060:127.0.0.1:6060 \
root@$IP
