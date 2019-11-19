// Menu opening and closing
function menu(tName) {
    var tMenu = document.getElementById(tName).style;
    if (tMenu.display == 'none') {
        tMenu.display = "block";
    } else {
        tMenu.display = "none";
    }
}


$(document).ready(function() {
    $.getJSON($("meta[name=bmstable]").attr("content"), function(header) {
        $.getJSON(header.data_url, function(information) {
            // Branches with header.json sort
            if (header["level_order"]) {
                makeBMSTable(information, header.symbol, header["level_order"]);
                $(".tablesorter").tablesorter({
                    sortList: [
                        [0, 0],
						[2, 0]
                    ]
                });
            } else {
                makeBMSTable(information, header.symbol);
                $(".tablesorter").tablesorter({
                    sortList: [
                        [0, 0],
						[2, 0]
                    ]
                });
            }
        });
    });
});


function makeBMSTable(info, mark, order) {
    if (typeof order === 'undefined') {
        order = null;
    }

    var x = "";
    var ev = "";
    var count = 0;
    var obj = $("#table_int");

    // Sort
    if (order != "" && order != null) {

        var orderAry = [];
        for (var l = 0; l < order.length; l++) {
            orderAry.push(order[l].toString());
        }

        for (var j = 0; j < info.length; j++) {
            var index = orderAry.indexOf(info[j]["level"]);
            info[j]["_index"] = index;
        }

        info.sort(function(a, b) {
            if (a["_index"] < b["_index"]) {
                return -1;
            } else if (a["_index"] > b["_index"]) {
                return 1;
            } else if (a["title"].toLowerCase() < b["title"].toLowerCase()) {
                return -1;
            } else if (a["title"].toLowerCase() > b["title"].toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });
        for (var k = 0; k < info.length; k++) {
            delete info[k]["_index"];
        }
    } else {
        info.sort(
            function(a, b) {
                var aLv = a["level"].toString();
                var bLv = b["level"].toString();
                if (isNaN(a["level"]) == false && isNaN(b["level"]) == false) {
                    return a["level"] - b["level"];
                } else if (aLv < bLv) {
                    return -1;
                } else if (aLv > bLv) {
                    return 1;
                } else if (a["title"].toLowerCase() < b["title"].toLowerCase()) {
                    return -1;
                } else if (a["title"].toLowerCase() > b["title"].toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }

    // Table Clear
    obj.html("");
    var obj_sep = null;
    for (var i = 0; i < info.length; i++) {
        if (x != info[i].level) {
            count = 0;
            x = info[i].level;
        }
        // Main text
        var str = $("<tr class='tr_normal'></tr>");

        if (info[i].state == 1) {
            str = $("<tr class='state1'></tr>");
        }
        if (info[i].state == 2) {
            str = $("<tr class='state2'></tr>");
        }
        if (info[i].state == 3) {
            str = $("<tr class='state3'></tr>");
        }
        if (info[i].state == 4) {
            str = $("<tr class='state4'></tr>");
        }
        if (info[i].state == 5) {
            str = $("<tr class='state5'></tr>");
        }
        if (info[i].state == 6) {
            str = $("<tr class='state6'></tr>");

        }

        // Level
        $("<td width='5%'>" + mark + x + "</a></td>").appendTo(str);
        // View Pattern
        $("<td width='1%'><a href='http://www.ribbit.xyz/bms/score/view?p=1&md5=" + info[i].md5 + "' class='fas fa-lg fa-music' target='_blank'></a></td>").appendTo(str);

        // Title
        $("<td width='20%'>" + "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + info[i].md5 + "' target='_blank'>" + info[i].title + "</a></td>").appendTo(str);
        // Artist (Package Link)
        var astr = "";
        if (info[i].url != "" && info[i].url != null) {
            if (info[i].artist != "" && info[i].artist != null) {
                astr = "<a href='" + info[i].url + "' target='_blank'>" + info[i].artist + "</a>";
            } else {
                astr = "<a href='" + info[i].url + "' target='_blank'>" + info[i].url + "</a>";
            }
        } else {
            if (info[i].artist != "" && info[i].artist != null) {
                astr = info[i].artist;
            }
        }
        if (info[i].url_pack != "" && info[i].url_pack != null) {
            if (info[i].name_pack != "" && info[i].name_pack != null) {
                astr += "<br>(<a href='" + info[i].url_pack + "' target='_blank'>" + info[i].name_pack + "</a>)";
            } else {
                astr += "<br>(<a href='" + info[i].url_pack + "' target='_blank'>" + info[i].url_pack + "</a>)";
            }
        } else {
            if (info[i].name_pack != "" && info[i].name_pack != null) {
                astr += "<br>(" + info[i].name_pack + ")";
            }
        }
        $("<td width='12%'>" + astr + "</td>").appendTo(str);
        // Pattern Download
        if (info[i].personal_site != "" && info[i].personal_site != null) {
            if (info[i].name_diff != "" && info[i].name_diff != null) {
                $("<td width='3%'><a href='" + info[i].personal_site + "' target='_blank'>" + info[i].name_diff + "</a></td>").appendTo(str);
            } else {
                $("<td width='3%'><a href='" + info[i].personal_site + "' target='_blank'>作者不明</a></td>").appendTo(str);
            }
        } else {
            if (info[i].name_diff != "" && info[i].name_diff != null) {
                $("<td width='3%'>" + info[i].name_diff + "</td>").appendTo(str);
            } else {
                $("<td width='3%'></td>").appendTo(str);
            }
        }
        // Comment
        $("<td width='15%'>" + info[i].comment + "</div></td>").appendTo(str);
        str.appendTo(obj);
        count++;
    }
}