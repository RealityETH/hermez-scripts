#root
adduser ed
adduser ed admin
cp -r /root/.ssh /home/ed/.ssh
chown -R ed:ed /home/ed/.ssh

su - ed

git config --global user.email "ed@socialminds.jp"
git config --global user.name "Edmund Edgar"


# install various common packages used for docker and other stuff
sudo apt install apt-transport-https ca-certificates curl software-properties-common make unzip
sudo update-alternatives --set editor /usr/bin/vim.basic



# install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ed
# install docker-compose
sudo apt install docker-compose

# upgrade everything else and reboot so we get the new kernel
sudo apt upgrade
sudo reboot



# log in as ed this time with key forwarding
ssh -A ed@$IP_ADDRESS

# install go as per https://go.dev/doc/install
wget https://go.dev/dl/go1.20.3.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.20.3.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' | sudo tee -a /etc/profile
#export PATH=$PATH:/usr/local/go/bin
source /etc/profile
go version



#mkdir -p ~/.docker/cli-plugins/
#curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
#chmod +x ~/.docker/cli-plugins/docker-compose
#docker compose version
# install nodejs
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh 
sudo apt install nodejs
sudo corepack enable
sudo npm i -g corepack
sudo corepack prepare yarn@stable --activate
sudo yarn set version stable



# For production version

sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum

geth --dev --http --http.api eth,web3,net
cd hermez-scripts
sudo ./prod.sh

# To see what's happening
cd /var/lib/hermez/testnet
docker-compose logs -f


# Test version


git clone git@github.com:0xPolygonHermez/zkevm-node.git
cd zkevm-node/
make build-docker
cd test/
make run

# deployment test
# ends with an error which appears to be deliberate
make deploy-sc
