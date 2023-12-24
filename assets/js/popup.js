// Fields
let stored_data;
let info;
let web_name;
let new_item;
let point_selection = document.getElementById("point-selection");
let btn_add = document.getElementById("btn-add");
let btn_delete = document.getElementById("btn-delete");
let btn_delete_all = document.getElementById("btn-delete-all");

// Events
document.addEventListener("DOMContentLoaded", () => {
  getTabID();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {});

btn_add.addEventListener("click", () => {
  getWeb(addNewData);
});

btn_delete.addEventListener("click", () => {
  getWeb(deleteItem);
});

// Functions
function getTabID() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      var activeTab = tabs[0];
      const url = activeTab.url;
      const isWebsite = url.startsWith("http");
      web_name = document.getElementById("web-name");
      info = document.getElementById("info");

      if (!isWebsite) {
        info.remove();
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: scraping,
      });
    }
  );
}

function toCsv(posts) {
  let csvContent = "creator,text,like,cmt,share\n";
  posts.forEach((post) => {
    let row = `${post.creator},${post.text},${post.like},${post.cmt},${post.share}\n`;
    csvContent += row;
  });
  let data = new Blob([csvContent], { type: "text/csv" });
  let downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(data);
  downloadLink.download = "motivation.csv";
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
  downloadLink.remove();
}

function scraping() {
  //posts
  let posts = [];
  let texts = document.querySelectorAll(
    "div.x9f619.x1n2onr6.x1ja2u2z.x2bj2ny.x1qpq9i9.xdney7k.xu5ydu1.xt3gfkd.xh8yej3.x6ikm8r.x10wlt62.xquyuld"
  );
  texts.forEach((element) => {
    let post = {
      creator: "",
      text: "",
      like: "",
      link: "",
      cmt: "",
      share: "",
    };

    //creator
    let creator = element.querySelector("strong > span");
    if (creator == null) return;
    post.creator = creator != null ? creator.textContent : "";

    //text
    let text = element.querySelector("div.x1iorvi4.x1pi30zi.x1l90r2v.x1swvt13");
    post.text = text != null ? text.textContent : "";

    //like
    let like = element.querySelector("span.xt0b8zv.x1e558r4");
    post.like = like != null ? like.textContent : "";

    //link
    let link = element.querySelector(
      "a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm"
    );
    link.click();
    post.link = link != null ? link.href : "";

    //cmt & Share
    let cmt_Share = element.querySelectorAll(
      "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x1qjc9v5.xozqiw3.x1q0g3np.xykv574.xbmpl8g.x4cne27.xifccgj span.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j"
    );
    if (cmt_Share == null) return;

    let temp = [];
    cmt_Share.forEach((e) => {
      temp.push(e != null ? e.textContent : "");
    });

    if (temp == []) return;
    post.cmt = temp[0] != null ? temp[0].replace("bình luận", "").trim() : "";
    post.share =
      temp[1] != null ? temp[1].replace("lượt chia sẻ", "").trim() : "";

    posts.push(post);
  });

  //reels
  // let reels = [];
  // let divReel = document.querySelectorAll(
  //   "div.xal61yo.x1lq5wgf.xgqcy7u.x5pf9jr.xo71vjh.x78zum5.x1q0g3np.x1egiwwb.xl56j7k.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x16zosiy.x1db0b2.x3awd8m"
  // );
  // divReel.forEach((element) => {
  //   let reel = {
  //     creator: "",
  //     text: "",
  //     like: "",
  //     link: "",
  //     cmt: "",
  //     share: "",
  //   };

  //   //creator
  //   let creator = element.querySelector(".x65f84u a");
  //   if (creator == null) return;
  //   reel.creator = creator != null ? creator.textContent : "";

  //   //text
  //   let text = element.querySelector("div.xyamay9.xjkvuk6");
  //   reel.text = text != null ? text.textContent : "";

  //   //like
  //   let like = element.querySelector(
  //     "div.x9f619:nth-of-type(2) .x9f619 .x1s688f span.xlyipyv"
  //   );
  //   reel.like = like != null ? like.textContent : "";

  //   //link
  //   let link = element.querySelector("a.x1qjc9v5");
  //   reel.link = link != null ? link.href : "";

  //   //cmt & Share;
  //   let cmt_Share = element.querySelectorAll(
  //     ".xod5an3 > div > div span.xlyipyv"
  //   );
  //   if (cmt_Share == null) return;

  //   let temp = [];
  //   cmt_Share.forEach((e) => {
  //     temp.push(e != null ? e.textContent : "");
  //   });

  //   if (temp == []) return;
  //   reel.cmt = temp[1] != null ? temp[1] : "";
  //   reel.share = temp[2] != null ? temp[2] : "";

  //   reels.push(reel);
  // });

  // console.log(reels);

  // if (posts.length < 500) return;

  let jsonData = JSON.stringify(posts, null, 2);
  let data = new Blob([jsonData], { type: "application/json" });
  let downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(data);
  downloadLink.download = "motivation.json";
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
  downloadLink.remove();
}
