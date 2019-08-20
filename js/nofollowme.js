var arrFollowing = [];
var arrFollower = [];
var NextPage;
var user = {
  id: null,
  name: null,
  sum_following: null,
  sum_follower: null,
  query_hash_following: "d04b0a864b4b54837c0d870b0e77e076",
  query_hash_follower: "c76146de99bb02f6415203be841dd25a"
};
var ClassName = {
  noFollowMe: "autounfollow",
  restart: "restart",
  resultFollower: "resultFollower",
  resultFollowing: "resultFollowing",
  stop: "stop",
  tests: "tests",
  follower: "follower"
};

$(document).ready(function() {
  // $("#autounfollow").click(function (a) {
  // chrome.runtime.sendMessage("autounfollow");
  NoFollowMe();
  // });
});

function NoFollowMe() {
  GetVar();
  if (user.id == null) {
    user.id = $("#id").val();
  }
  if (user.id != null) {
    $("title").html(`Carregando quem ${decodeURI(user.name)} segue.`);
    following.getAll();
  } else {
    alert("preciso do ID e do Query_Hash do usuário!");
    return;
  }
}

function GetVar() {
  if (document.location.toString().indexOf("?") !== -1) {
    var query = document.location
      .toString()
      // get the query string
      .replace(/^.*?\?/, "")
      // and remove any existing hash string (thanks, @vrijdenker)
      .replace(/#.*$/, "")
      .split("&");

    for (var i = 0, l = query.length; i < l; i++) {
      var aux = decodeURIComponent(query[i]).split("=");
      switch (aux[0]) {
        case "id":
          user.id = aux[1];
          break;
        case "name":
          user.name = decodeURI(aux[1]);
          break;
        case "sum_follower":
          user.sum_follower = aux[1];
          break;
        case "sum_following":
          user.sum_following = aux[1];
          break;
      }
    }
  }
}

var following = {
  fvariables: function(vfirst) {
    if (vfirst == null)
      return (
        '{"id":"' +
        user.id +
        '","include_reel":true,"fetch_mutual":false,"first":50}'
      );
    else
      return (
        '{"id":"' +
        user.id +
        '","include_reel":true,"fetch_mutual":false,"first":50,"after":"' +
        vfirst +
        '"}'
      );
    // "has_next_page":true,
  },

  BreakRequest: function(a) {
    let b = a.data.user.edge_follow.edges;
    NextPage = a.data.user.edge_follow.page_info.end_cursor;
    for (i = 0; i < b.length; i++) {
      arrFollowing.push({
        username: b[i].node.username,
        profile_pic_url: b[i].node.profile_pic_url
      });
    }
    var progress = parseInt((arrFollowing.length * 100) / user.sum_following);
    $("div#progress-bar.progress")
      .html(`<div class="progress-bar progress-bar-striped rounded" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}"
        aria-valuemin="0" aria-valuemax="${
          user.sum_following
        }">${progress}%</div>`);
    return arrFollowing;
  },
  getAll: function(vfirst) {
    $("p#follower").val("Os não seguidores de: " + user.name);
    $.ajax({
      url: "https://www.instagram.com/graphql/query/",
      type: "get",
      data: {
        query_hash: user.query_hash_following,
        variables: following.fvariables(vfirst)
      },
      beforeSend: function() {}
    })
      .done(function(msg) {
        following.BreakRequest(msg);
        if (NextPage != null) {
          setTimeout(following.getAll(NextPage), 10000);
        } else {
          $("title").html(
            `Carregando os seguidores de ${decodeURI(user.name)}.`
          );
          follower.getAll();
        }
      })
      .fail(function(jqXHR, textStatus, msg) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(msg);
      });
  }
};

var follower = {
  fvariables: function(vfirst) {
    if (vfirst == null)
      return (
        '{"id":"' +
        user.id +
        '","include_reel":true,"fetch_mutual":true,"first":50}'
      );
    else
      return (
        '{"id":"' +
        user.id +
        '","include_reel":true,"fetch_mutual":true,"first":50,"after":"' +
        vfirst +
        '"}'
      );
    // "has_next_page":true,
  },

  BreakRequest: function(a) {
    let b = a.data.user.edge_followed_by.edges;
    NextPage = a.data.user.edge_followed_by.page_info.end_cursor;
    for (i = 0; i < b.length; i++) {
      arrFollower.push({
        username: b[i].node.username,
        profile_pic_url: b[i].node.profile_pic_url
      });
    }
    var progress = parseInt((arrFollower.length * 100) / user.sum_follower);
    $("div#progress-bar.progress")
      .html(`<div class="progress-bar progress-bar-striped rounded" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}"
        aria-valuemin="0" aria-valuemax="${
          user.sum_follower
        }">${progress}%</div>`);

    return arrFollower;
  },
  getAll: function(vfirst) {
    // console.log('function UnfollowMe');
    //if (vfirst == null) vfirst = "QVFBdmhLSmNrby1uc0FEX3Q4Y0I1WFZMM2phTGJzQjBZcHZfU2FheExON2RmQ1hENDNBQkhyU2hGeHRSNGpmSHNabWNRV29sQzZSdEJfMjN2VFhPbDVTSw==";
    $.ajax({
      url: "https://www.instagram.com/graphql/query/",
      type: "get",
      data: {
        query_hash: user.query_hash_follower,
        variables: follower.fvariables(vfirst)
      },
      beforeSend: function() {}
    })
      .done(function(msg) {
        follower.BreakRequest(msg);
        if (NextPage != null) {
          setTimeout(follower.getAll(NextPage), 10000);
        } else {
          $("title").html(`Preencher os infieis de ${decodeURI(user.name)}.`);
          compare.Comparar();
        }
      })
      .fail(function(jqXHR, textStatus, msg) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(msg);
      });
  }
};

var compare = {
  Comparar: function() {
    for (let i = 0; i < arrFollowing.length; i++) {
      if (
        window.arrFollower.find(
          foll => foll.username === arrFollowing[i].username
        ) === undefined
      ) {
        $("div#resultNoFollow").append(
          compare.MontarIl(
            arrFollowing[i].profile_pic_url,
            arrFollowing[i].username
          )
        );
      }
    }
    $("title").html(
      `Abaixo estão os que ${decodeURI(user.name)} segue e não seguem de volta.`
    );
    $("div#progress-bar.progress").hide();
    $("h3").hide();
    console.log('foreach');
    
    document.querySelectorAll('div.cell').forEach(function(item) {
      item.addEventListener("click", function() {
        console.log('innerelement');
        if (item.getAttribute("class").includes("active")) {
            console.log('active');
            item.classList.remove("active");
        } else {
            console.log('removeActive');
            item.classList.add("active");
        }
      })
    });
  },
  MontarIl: function(img, name) {
    return (
      '<div class="cell">' +
      '<div class="rounded-circle canvas">' +
      '   <img class="rounded-circle" src="' +
      img +
      '">' +
      "</div>" +
      '<div class="userName">' +
      name +
      "</div>" +
      "</div>"
    );
  }
};
