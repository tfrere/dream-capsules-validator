import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import $ from "jquery";
import { tokens } from "./tokenDatas.js";

const $walletConnectButton = $("#wallet-connect-connection");
const $metamaskConnectButton = $("#metamask-connection");

const $beforeConnection = $("#before-connection");
const $afterConnection = $("#after-connection");
const $form = $("#form");

const handleConnection = (address) => {
  $form.text(`Bonjour ${address}`);
  $beforeConnection.addClass("hidden");
  $afterConnection.removeClass("hidden");

  let ownedTokens = tokens.filter((tokenData) => {
    if (tokenData.owner.toLowerCase() === address.toLowerCase()) {
      return true;
    }
    return false;
  });

  const ownedRarity = ownedTokens.map((token) => {
    return token.attributes[2].value;
  });

  let message = ``;

  if (ownedRarity.includes("Legendary")) {
    message += rewardCommon;
    message += rewardLegendary;
    message += rewardEpic;
    message += rewardThanks;
    message += snapshotTime;
  } else if (ownedRarity.includes("Epic")) {
    message += rewardCommon;
    message += rewardEpic;
    message += rewardThanks;
    message += snapshotTime;
  } else if (ownedRarity.includes("Rare")) {
    message += rewardCommon;
    message += rewardThanks;
    message += snapshotTime;
  } else if (ownedRarity.includes("Common")) {
    message += rewardCommon;
    message += rewardThanks;
    message += snapshotTime;
  } else {
    message += rewardNothing;
    message += snapshotTime;
  }
  $form.html(message);
};

$metamaskConnectButton.on("click", () => {
  $metamaskConnectButton.text("connection");
  window.setTimeout(() => {
    window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
      // all "0xbb2D629A8a41Ab55Ca41276837C8bdF6115CFEe5"
      // obvious "0xB7734b5C378FD169d2b9720d0D5AC1A7b30f9FC9"
      // const activeOwnerAddress = "0xbb2D629A8a41Ab55Ca41276837C8bdF6115CFEe5"; // "0xbb2D629A8a41Ab55Ca41276837C8bdF6115CFEe5" res[0]
      // metamask : 0x6e984fa53e108d26cf18e43a6a043bef2c02f94f
      // opensea  : 0x6e984fa53E108d26Cf18e43a6A043bef2C02F94f

      // handleConnection("0xbb2D629A8a41Ab55Ca41276837C8bdF6115CFEe5"); //test2
      handleConnection(res[0]); //test2
    });
  }, 1000);
});

$walletConnectButton.on("click", () => {
  connector.createSession();
});

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal
});

connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];

  console.log("acounts -> ", accounts, "chainid -> ", chainId);
});

// // Check if connection is already established
// if (!connector.connected) {
//   // create new session
//   connector.createSession();
// }

// // Subscribe to connection events
// connector.on("connect", (error, payload) => {
//   if (error) {
//     throw error;
//   }

//   // Get provided accounts and chainId
//   const { accounts, chainId } = payload.params[0];
// });

// connector.on("session_update", (error, payload) => {
//   if (error) {
//     throw error;
//   }

//   // Get updated accounts and chainId
//   const { accounts, chainId } = payload.params[0];
// });

// connector.on("disconnect", (error, payload) => {
//   if (error) {
//     throw error;
//   }

//   // Delete connector
// });

const snapshotTime = `<small>The rewards are attributed based on a snapshot made on June 21st, 2022</small>`;

const rewardNothing = `
<p>You don't have any DreamCapsules.</p>
`;

const rewardCommon = `
<h4>Thank you for collecting.</h4>

<p>You are eligible to join the private channel in <a target="_blank" href='https://discord.gg/zBpnCjSzRC'>our discord</a> (go to #collabland and connect with your wallet).</p>
`;

const rewardOwner = `
<h5>Dream Capsules Book</h5>

<p>You are also eligible to receive the Dream Capsules Collection Book.</p>

<p>You can either ask for a free digital copy by filling <a target="_blank" href='https://forms.gle/PsQRkxQLFeEWgzSCA'>this form</a></p>

<p>Or have it printed and sent to you by ordering it on<a target="_blank" href='https://obviousprints.bigcartel.com/product/dream-book'>this link</a>.</p>
`;

const rewardEpic = `
<h5>Epic Print(s)</h5>

<p>You are eligible to receive a printed version of your Epic artwork(s) at home. To do so, please fill in <a target="_blank" href="https://forms.gle/FBXsKPXsDD5uHVki6">this survey</a></p>

<p>You will also need to choose an option to receive your print:
You can either retrieve it in Paris by completing <a target="_blank" href="https://forms.gle/QF9NmJzLAbgpBmP88">this form</a>
Or have it sent to you by ordering it on <a target="_blank" href="http://obviousprints.bigcartel.com/product/dream-capsules-epic-print">this link</a>.</p>

<p>Please only complete these once, even if you have more than one Epic artwork.</p> 
`;

const rewardLegendary = `
<h5>Legend !</h5>

<p>You are eligible to receive a NFT artwork of your own dream ! Please fill in <a target="_blank" href="https://forms.gle/SG55CeBQYvu4Qn1h8">this survey</a>.</p>

<p>If you have more than one legendary dream capsule, you can complete it more than once.</p>
`;

const rewardThanks = `<h5>Thank you again !</h5>`;
