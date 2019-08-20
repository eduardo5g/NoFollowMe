var user = {
    id: null,
    name:null,
    sum_following: null,
    sum_follower: null,
    query_hash_following: "d04b0a864b4b54837c0d870b0e77e076",
    query_hash_follower: "c76146de99bb02f6415203be841dd25a"
}

var ClassName = {
    divtitle: "divtitle",
    UserID: "UserID",
    noFollowMe: "autounfollow",
    restart: "restart",
    result: "result",
    stop: "stop",
    tests: "tests"
};
function buttonFunctions(button) {
    if ("string" == typeof button) {
        switch (button) {
            case ClassName.noFollowMe:
                fnoFollowMe(null);
                break;
            case ClassName.restart:
                frestart()
                break;
            case ClassName.stop:
                fStop()
                break;
        }
    }
}
function frestart() {
    console.log('function restart extension');
    // chrome.tabs.executeScript({ code: reload });
}
function fStop() {
    stop = true;
}
document.addEventListener('DOMContentLoaded', function () {
    iniciar();
});
function iniciar() {
    $("input#" + ClassName.UserID).change(function () {
        $("button#" + this.className.noFollowMe).html('Qm n me segue')
    });
    $("button#" + ClassName.noFollowMe).click(function (a) {
        console.log('start');
        if ($("input#UserID").val().length < 2) {
            $("button#" + ClassName.noFollowMe).html('Insira o IG');
            return;
        }
        $.ajax({
            url: 'https://www.instagram.com/' + $("input#UserID").val() + '/',
            type: 'get',
            data: {
            },
            beforeSend: function () { }
        })
            .done(function (msg) {
                let StartString = 'window._sharedData = ';
                let StartFind = msg.indexOf(StartString) + StartString.length;

                var UserObject = JSON.parse(msg.substring(StartFind, msg.indexOf(';</script>', StartFind + 1)));
                var graphqlUser = UserObject.entry_data.ProfilePage[0].graphql.user;
                url = "/nofollow.html?id=" + graphqlUser.id + 
                "&name=" + graphqlUser.full_name +
                "&sum_follower=" + graphqlUser.edge_followed_by.count + 
                "&sum_following=" + graphqlUser.edge_follow.count;

                console.log('send post')

                chrome.tabs.create({ url: encodeURI(url) });
            })
            .fail(function (jqXHR, textStatus, msg) {
                alert('IG de usuário não encontrado!')
                console.log(jqXHR);
                console.log(textStatus);
                console.log(msg);
            });

    });
    $("button#" + ClassName.divtitle).click(function (a) {
        // chrome-extension://iihdndfohfldlfdjednjpeckmpiaipgg/nofollow.html?id=16150797782
        chrome.tabs.create({
            url: "https://www.instagram.com/eduardobits/"
        })
    });
    $("#" + ClassName.restart).click(function (a) {
        buttonFunctions(ClassName.restart);
    });
    $("#" + ClassName.stop).click(function (a) {
        buttonFunctions(ClassName.stop);
    })
}
