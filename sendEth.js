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
//获取结果列表
const wjTxResultList = document.querySelector('.wjTxResultList');

const ether = new BN('de0b6b3a7640000', 16);
const gasPrice = new BN('4a817c800',16)
const gasAmount = '0x5208';


let accounts = [];
let txResults = [];
// let addresses = [];
// 预加载方法
getAccount();
checkMetaMask();


//检测小狐狸钱包状态
function checkMetaMask(){
    if (typeof window.ethereum !== 'undefined') {
        //已经安装钱包
        console.log('MetaMask is installed!');

        if (ethereum.isConnected){
            console.log("已经连接")
            checkXdaiNet();
        }
        else{
            console.log("还未连接")
            alert('请先连接钱包')

        }
    }
    else {
        alert('请先安装小狐狸钱包');
    }
}

//检测当前是否为Xdai网络
async function checkXdaiNet(){
    var netId = await ethereum.request({method:'net_version'});
    console.log(netId)
    if (netId == '100'){
        wjCurrentChain.innerHTML = '100';
    }
    else{
       alert('请切换到Xdai网络');
       addXdaiNew();
    }
}

//添加到Xdai网络
function addXdaiNew(){
    ethereum.request({method:'wallet_addEthereumChain',params:[
            {
                chainId:"100",
                chainName:"Xdai",
                nativeCurrency:{
                    name:"Xdai",
                    symbol:"Xdai",
                    decimals:18
                },
                rpcUrls:"https://rpc.xdaichain.com/",
                blockExplorerUrls:"https://blockscout.com/poa/xdai"
            }
        ]},).catch((error) => console.error);
}


//发送交易点击监听事件
wjEthSendButton.addEventListener('click', () => {
    //使用一以太为单位计算总共花费
    var total =  ethConut(wjEthValueInput.value);
    var addresses = wjEthInputAddress.value.split('\n');

    //清除结果列表
    txResults = [];
    
    //打包交易
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
                    gas: gasAmount,
                },
            ],
        })
        .then((txHash) => {
            //刷新列表
            txResults.push(txHash);
            var tr = wjTxResultList.insertRow(txResults.length)
            var td = tr.insertCell(0);
            td.innerHTML = txHash;
            td.onclick = function(){
                console.log(txHash);
                //跳转新的页面 https://blockscout.com/poa/xdai/tx/0x10380e58004e7319a601bd7113bc41b332bba64e79652fcb4958ee208e2d5cf8
                var baseUrl = "https://blockscout.com/poa/xdai/tx/"+txHash;

                window.open(baseUrl);
            };        
            console.log(td)   
        })   //交易hash
        .catch((error) => console.log(error));        //报错信息
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
    wjCurrentChain.innerHTML = formartChain(str);
    // console.log(chainId.toString(10));
});

ethereum.on('connect',function (accounts) {
    wjCurrentChain.innerHTML = formartChain(accounts['chainId']);
    console.log("connect"+accounts);
});

//tools
function formartChain(str) {
    var chainId = new BN(str,16);
    return chainId.toString(10);
}


function ethConut(str){
    var location = String(str).indexOf('.') + 1;
    if(location > 0) {
        //是小数 
        var length = String(str).length - location;
        //进位去除小数
        var ethValue = parseFloat(String(str))*parseInt(Math.pow(10,length).toString());
        var totoalBn = new BN(ethValue.toString(10),10)
        totoalBn.imul(ether);
        //除以之前的进位
        totoalBn.idivn(Math.pow(10,length));
        return totoalBn;
    }
    else {
        //不是小数
        var totoalBn = new BN(String(str),10);
        totoalBn.imul(ether);
        return totoalBn;
    }
  
}

