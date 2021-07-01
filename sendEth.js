const BN = require('bn.js');
//连接钱包按钮
const wjEthEnableButton = document.querySelector('.wjEthEnableButton');
//金额
const wjEthValueInput = document.querySelector('.wjEthValueInput');
//发送
const wjEthSendButton = document.querySelector('.wjEthSendButton');
//地址输入
const wjEthInputAddress = document.querySelector('.wjEthInputAddress');
//当前操作地址
const wjCurrentAddress = document.querySelector('.wjCurrentAddress');
//当前操作链
const wjCurrentChain = document.querySelector('.wjCurrentChain');

const ether = new BN('de0b6b3a7640000', 16);
const gasPrice = new BN('4a817c800',16)

let accounts = [];
// let addresses = [];
// 预加载方法
getAccount();
checkMetaMask();


//检测小狐狸钱包状态
function checkMetaMask(){
    if (typeof window.ethereum !== 'undefined') {
        //已经安装钱包
        console.log('MetaMask is installed!');
    }
    else {
        alert('请先安装小狐狸钱包');
    }
}

//发送交易点击监听事件
wjEthSendButton.addEventListener('click', () => {
    //获取计算数量
    var count = new BN(wjEthValueInput.value,10);
    //使用一以太为单位计算总共花费
    var total =  count.mul(ether);
    var addresses = wjEthInputAddress.value.split('\n');
    console.log(addresses);

    for(var i =0 ; i < addresses.length; i++ ){
        transaction(accounts[0],addresses[i],total)
    }
});

//获取账户点击监听事件
wjEthEnableButton.addEventListener('click', () => {
    getAccount();
});

//异步获取账户信息方法
async function getAccount() {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    wjCurrentAddress.innerHTML = accounts[0];
    console.log('coderjun'+accounts);
}

//发送交易消息方法
async  function transaction (fromCount,toCount,value) {
    ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: fromCount,
                    to: toCount,
                    value: value.toString(16),
                    gasPrice: gasPrice.toString(16),
                    gas: '0x5208',
                },
            ],
        })
        .then((txHash) => console.log(txHash))   //交易hash
        .catch((error) => console.error);        //报错信息
}

//监听事件
///监听当前操作账户改变
ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    wjCurrentAddress.innerHTML = accounts[0];
    console.log(accounts);
});

//监听链改变
ethereum.on('chainChanged', function (chainString) {
    // Time to reload your interface with accounts[0]!
    var str = chainString.substr(2);
    var chainId = new BN(str,16)
    wjCurrentChain.innerHTML = chainId.toString(10);
    // console.log(chainId.toString(10));
});