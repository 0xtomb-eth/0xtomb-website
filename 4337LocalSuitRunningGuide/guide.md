

## 需要运行的

### 1. dev geth

启动本地geth节点：
```shell
docker run -d --rm -ti --name geth -p 8545:8545 ethereum/client-go:v1.10.26 \
  --miner.gaslimit 12000000 \
  --http.corsdomain "http://localhost:3033" \
  --http --http.api personal,eth,net,web3,debug \
  --http.vhosts '*,localhost,host.docker.internal' --http.addr "0.0.0.0" \
  --ignore-legacy-receipts --allow-insecure-unlock --rpc.allow-unprotected-txs \
  --dev \
  --verbosity 2 \
  --nodiscover --maxpeers 0 --mine --miner.threads 1 \
  --networkid 1337
```

其中`--http.corsdomain "http://localhost:3033"`是防止0xtomb-website在请求本地geth的时候发生CORS错误

连接js console：

```shell
docker exec -it geth geth attach http://localhost:8545
```

连接到js console可以方便调试交易和打测试eth，可能用到的操作有：

#### 1. 转账
```shell
eth.sendTransaction({from: "0xa74d4bad75ff934ac5c4b16b0ad8247166d66cff", to: "0xd21934eD8eAf27a67f0A70042Af50A1D6d195E81", value: "1000000000000000000"})
```
可以用转账函数来给测试账号充测试币：from地址填写eth.coinbase返回的地址，to填测试地址。

#### 2. 查询一笔交易的receipt
```shell
eth.getTransactionReceipt("0x8cfb9e80ae13b0a21815aa5dc10953fc35a3e49389abb1d9339a6ac01b9537e3")
```

### 3. 查询pending交易
```shell
eth.eth.pendingTransactions
```

### 2. bundler

[bundler仓库](https://github.com/eth-infinitism/bundler)

### Usage: 
1. run `yarn && yarn preprocess`
2. deploy contracts with `yarn hardhat-deploy --network localhost` (部署entry point地址，但是这个仓库部署的还是上一个旧版本的entry point, **todo** 改成新版的entry point)
3. run `yarn run bundler` (启动bundler服务，把用户的uo转发提交到eth网络)

Now your bundler is active on local url http://localhost:3000/rpc    

### 3. 部署will aa工厂合约
```shell
git clone https://github.com/0xtomb-eth/account-abstraction-1
cd account-abstraction-1
npx hardhat deploy --network dev
```