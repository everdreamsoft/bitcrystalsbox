function getExchangeRatesList() {
    chrome.storage.local.get(function (data) {
	var btcperusd = parseFloat(data.btcperusd);
	//console.log(data);
	$("#ExchangeRate").html("");
	var ratedisplay = "<table class='table table-condensed' style='margin-top: 20px;'><thead class='small tokenlistingheader' style='cursor: pointer;'><th>Symbol</th><th>Token</th><th style='text-align:center;'>Market Price per Token</th></thead><tbody>";
	ratedisplay += "<tr class='tokenlisting' style='cursor: pointer;' data-token='BTC'><td style='vertical-align:middle'><div style='width: 50px;'><img src='bitcoin_48x48.png' width='36' height='36px'></div></td><td style='vertical-align:middle'>BTC</td><td style='vertical-align:middle; text-align:center;'>1 BTC<br>$" + parseFloat(1 / btcperusd).toFixed(2) + "</td></tr>";
	//<th>Price USD</th>
	$.each(data.assetrates, function (i, item) {
	    var assetname = data.assetrates[i]["assetname"];
	    var assetprice = parseFloat(data.assetrates[i]["assetprice"]);
	    if (assetprice <= 1) {
		var assetpricedisplay = assetprice.toFixed(6);
	    } else {
		var assetpricedisplay = assetprice.toFixed(2);
	    }
	    var assetbtcprice = (btcperusd * assetprice).toFixed(8);
	    var iconname = assetname.toLowerCase();
	    ratedisplay += "<tr class='tokenlisting' style='cursor: pointer;' data-token='" + assetname + "'><td style='vertical-align:middle'><div style='width: 50px;'><img src='http://counterpartychain.io/content/images/icons/" + iconname + ".png' width='36' height='36px'></div></td><td style='vertical-align:middle'>" + assetname + "</td><td style='vertical-align:middle; text-align:center;'>" + assetbtcprice + " BTC<br>$" + assetpricedisplay + "</td></tr>";
	    //<td>$"+assetpricedisplay+"</td>
	    //var ratedisplay = "<div class='assetratedisplay' align='center'><img src='http://counterpartychain.io/content/images/icons/"+iconname+".png'><div class='lead' style='padding: 20px 0 0 0; font-size: 30px;'>"+assetname+"</div><div style='border: 1px solid #ccc; background-color: #fff; padding: 15px 5px 5px 5px; margin: 5px;'><div style='padding: 5px 0 0 0; font-size: 14px; font-style: italic;' class='lead'>Market Rate per Token</div><div style='padding: 0 0 0 0; font-size: 22px;font-weight: bold; ' class='lead'>$"+assetpricedisplay+"</div><div style='padding: 0 0 0 0; font-size: 22px;font-weight: bold; ' class='lead'>"+assetbtcprice+" BTC</div></div></div>";
	});
	ratedisplay += "</tbody></table><div style='padding-bottom: 10px; align='center'>Market Data provided by Coincap.io</div><div style='padding-bottom: 30px;' align='center'>";
	chrome.storage.local.get(function (data) {
	    if (typeof (data["assetrates_updated"]) !== 'undefined') {
		//already set
		var ratesupdated = "Last Updated " + data["assetrates_updated"];
	    } else {
		var ratesupdated = "API ERROR";
	    }
	    ratedisplay += "<span id='assetratesupdated' class='small' style='font-style: italic;'>" + ratesupdated + "</span></div>";
	    $("#ExchangeRate").html(ratedisplay);
	});
    });
}


/**
 *
 * @returns {undefined}
 * TBD if we keep it
 */
function getNews() {
    var source_html = "http://api.moonga.com/RCT/cp/cards/blockchainCards/1KrQMaMfxu4JAAcnZRYfvw5yyMT2J4Fhr6";
    $("#newsStories").html("<div align='center' style='padding-top: 30px;'>Loading...</div>");
    $.getJSON(source_html, function (data) {
	$("#newsStories").html("");
	$.each(data.posts, function (i, item) {
	    var date = data.posts[i]["publishDate"];
	    var title = data.posts[i]["title"];
	    var url = data.posts[i]["url"];
	    var image = data.posts[i]["coverImage"];
	    //console.log(image);
	    var title_display = "<a class='newslink' href='https://letstalkbitcoin.com/blog/post/" + url + "'><div class='newsArticle' align='center'><img src='" + image + "' height='240px' width='240px'><div class='lead' style='padding: 20px 0 0 0;'>" + title + "</div><div style='padding: 5px 0 10px 0;' class='small'>Published " + date.substring(0, 10) + "</div></div></a>";
	    //console.log(data);
	    $("#newsStories").append(title_display);
	});
    });
}
/**
 * Should be updated to find other bitcrystal account based on userid or email?
 *
 * @param {type} username
 * @returns {undefined}
 *
 */
function searchLTBuser(username) {
    var source_html = "https://letstalkbitcoin.com/api/v1/users?search=" + username;
    $("#ltbDirectorySearchResults").html("<div align='center' style='padding-top: 10px;'>Loading...</div>");
    $.getJSON(source_html, function (data) {
	$("#ltbDirectorySearchResults").html("");
	$.each(data.users, function (i, item) {
	    var username = data.users[i]["username"];
	    var avatar = data.users[i]["avatar"];
	    var registered = data.users[i]["regDate"];
	    if (i > 0) {
		$("#ltbDirectorySearchResults").append("<hr>");
	    }
	    $("#ltbDirectorySearchResults").append("<div style='display: inline-block; padding: 0 20px 10px 0;'><img src='" + avatar + "' height='64px' width='64px'></div>");
	    $("#ltbDirectorySearchResults").append("<div style='display: inline-block;' class='ltbDirectoryUsername'>" + username + "</div>");
	    $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>Date Registered:</i><br>" + registered.substring(0, 10) + "</div>");
	    if (data.users[i]["profile"] == null || data.users[i]["profile"]["ltbcoin-address"] == undefined) {
		$("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>BITCRYSTALS Address:</i><br>No Address Listed</div>");
	    } else {
		var ltbaddress = data.users[i]["profile"]["ltbcoin-address"]["value"];
		$("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>BITCRYSTALS Address:</i><br><div class='movetosend' style='display: inline-block;'>" + ltbaddress + "</div></div>");
	    }
	});
    });
}

function setEncryptedTest() {
    chrome.storage.local.set({
	'encrypted': true
    }, function () {
	getStorage();
    });
}


/**
 * Dont know yet what for
 * @returns {undefined}
 */
function setPinBackground() {
    var randomBackground = Math.floor(Math.random() * 6);
    var bg_link = "url('/asset/img/pin_bg/" + randomBackground + ".jpg') no-repeat 100% center fixed";
    $("#pinsplash").css("background", bg_link);
    $("#pinsplash").css("background-size", "cover");
}



function getStorage() {
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen", "setupdone", "user_id"], function (data) {
	if (data.firstopen == false) {
	    if (data.setupdone === true) {
		$(".bg").css("min-height", "200px");
		$("#welcomesplash").hide();
		if (data.user_id) {
		    //console.log("userid " + data.user_id);
		    hidelogin();
		}
		if (data.encrypted == false) {
		    existingPassphrase(data.passphrase);
		} else if (data.encrypted == true) {
		    $(".hideEncrypted").hide();
		    $("#pinsplash").show();
		    $("#priceBox").hide();
		} else {
		    newPassphrase();
		}
	    } else {
		//console.log('encryptquestion')
		welcomesplashShow();
		$('#initialsplash').hide();
		$('#encryptquestion').show();
	    }
	} else {
	    chrome.storage.local.set({
		'setupdone': false
	    }, function () {
		welcomesplashShow();
	    });
	}
    });
}

function getStorageSetup() {
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen", "setupdone", "user_id"], function (data) {
	if (data.firstopen == false) {
	    if (data.setupdone === true) {
		$(".bg").css("min-height", "200px");
		$("#welcomesplash").hide();
		if (data.encrypted == false) {
		    existingPassphrase(data.passphrase);
		} else if (data.encrypted == true) {
//		    $(".hideEncrypted").hide();
//		    $("#pinsplash").show();
//		    $("#priceBox").hide();
		} else {
		    newPassphrase();
		}

	    } else {
		//console.log('encryptquestion')
		welcomesplashShow();
		$('#initialsplash').hide();
		$('#encryptquestion').show();
	    }
	} else {
	    chrome.storage.local.set({
		'setupdone': false
	    }, function () {
		welcomesplashShow();
	    });
	}
    });
}

function welcomesplashShow() {
    $("#welcomesplash").show();
    var randomBackground = Math.floor(Math.random() * 6);
    var bg_link = "url('/asset/img/pin_bg/" + randomBackground + ".jpg') no-repeat 100% center fixed";
    $("#welcomesplash").css("background", bg_link);
    $("#welcomesplash").css("background-size", "cover");
}


function copyToClipboard(text) {
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}

//function getBlockHeight(){
//     var source_html = "https://insight.bitpay.com/api/sync";
//
//    $.getJSON( source_html, function( data ) {
//
//        var block = data.blockChainHeight;
//        return block;
//
//    });
//}

function showBTCtransactions(transactions) {
    //$("#btcbalance").html("<div style='font-size: 12px;'>You can perform "+transactions.toFixed(0)+" transactions</div><div id='depositBTC' align='center' style='margin: 5px; cursor: pointer; text-decoration: underline; font-size: 11px; color: #999;'>Deposit bitcoin for transaction fees</div>");
    if (transactions == 0) {
	$("#btcbalance").html("<div style='font-size: 12px;'>Deposit bitcoin to send tokens from this address.<span id='txsAvailable' style='display: none;'>" + transactions.toFixed(0) + "</span></div>");
    } else {
	chrome.storage.local.get(function (data) {
	    $("#btcbalance").html("<div style='font-size: 12px;'>You can perform <span id='txsAvailable'>" + transactions.toFixed(0) + "</span> transactions</div>");
	});
    }
    //var titletext = data + " satoshis";
    //$("#btcbalbox").prop('title', titletext);
    $("#btcbalbox").show();
}


/**
 * Might be disabled
 * @returns {undefined}
 */
function qrdepositDropdown() {
    var currentaddr = $("#xcpaddress").html();
    $("#btcbalance").html("Deposit bitcoin for transaction fees<div style='margin: 20px 0 10px 0; font-size: 10px; font-weight: bold;'>" + currentaddr + "</div><div id='btcqr' style='margin: 10px auto 20px auto; height: 100px; width: 100px;'></div><div>Cost per transaction is 0.00015470 BTC</div></div>");
    var qrcode = new QRCode(document.getElementById("btcqr"), {
	text: currentaddr,
	width: 100,
	height: 100,
	colorDark: "#000000",
	colorLight: "#ffffff",
	correctLevel: QRCode.CorrectLevel.H
    });
    //$("#btcbalbox").prop('title', "");
    $("#btcbalbox").show();
}


/**
 * Get bitcrystal amount
 * TODO - will be replaced by get assets
 * @param {type} pubkey
 * @returns {undefined}
 */
function getBTCBalance(pubkey) {
    //from previous version
    //var source_html = "https://insight.bitpay.com/api/addr/" + pubkey + "/balance";
    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;
    // from new version. Dont' know which is the best - enabled for test
    var source_html = "http://btc.blockr.io/api/v1/address/info/" + pubkey; //blockr
    $("#isbtcloading").html("true");
    //$.getJSON( source_html, function( data ) { //insight
    $.getJSON(source_html, function (apidata) {  //blockr
	//var bitcoinparsed = parseFloat(data) / 100000000; //insight
	//var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
	var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
	$("#isbtcloading").html("false");
	$("#btcbalhide").html(bitcoinparsed);
	//var transactions = (parseFloat(data) / 15470) ; //insight
	//var transactions = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance))/ 0.0001547; //chainso
	var transactions = (parseFloat(apidata.data.balance) / 0.0001547); //blockr
	if (transactions < 1) {
	    transactions = 0;
	}
	showBTCtransactions(transactions);
    });
}


/**
 * To be investigate
 * @param {type} pubkey
 * @param {type} currenttoken
 * @returns {undefined}
 */
function getPrimaryBalanceXCP(pubkey, currenttoken) {

    $("#xcpbalance").html("<div id='currentbalance'>Loading...</div>");
    //("#xcpbalance").html("<div id='currentbalance'>0</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 16px; font-weight: bold;'>" + enhancedassetname + "</div><div style='margin-top: 5px; font-size: 11px; font-style: italic;'>" + currenttoken + "</div>");

    //    var source_html = "https://insight.bitpay.com/api/sync";
    //
    //    $.getJSON( source_html, function( data ) {
    //
    //        var block = data.blockChainHeight;
    //
    //    });
    //    chrome.storage.local.get('unconfirmedtx', function (data)
    //        {
    //            if(isset(data)){
    //                $.each(data.tx
    //        }, function(){
    //
    //        });
    //console.log(pubkey);
    //console.log(currenttoken);
    if (currenttoken == "XCP") {
	//var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
	var source_html = "http://counterpartychain.io/api/address/" + pubkey;
	$.getJSON(source_html, function (data) {
	    //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance);
	    var assetbalance = data.xcp_balance;
	    if (typeof assetbalance === 'undefined') {
		assetbalance = 0;
	    }
	    //TODO - to be improved - replace temporary currenttoken
	    assetbalance = parseFloat(assetbalance).toString();
	    $("#isdivisible").html("yes");
	    $("#xcpbalance").html("<span id='currentbalance'>" + assetbalance + "</span><span class='unconfirmedbal'></span><br><div style='font-size: 22px; font-weight: bold;'><span id='currenttoken'>" + currenttoken + "</span>");
	    $('#assetbalhide').html(assetbalance);
	    getRate(assetbalance, pubkey, currenttoken);
	    //TODO - check this
	    currenttokenpending(currenttoken);
	});
    } else {
	var source_html = "https://counterpartychain.io/api/balances/" + pubkey;
	//var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
	$.getJSON(source_html, function (data) {
	    $.each(data.data, function (i, item) {
		var assetname = data.data[i].asset;
		if (assetname == currenttoken) {
		    var assetbalance = data.data[i].amount;
		    if (assetbalance.indexOf('.') !== -1) {
			$("#isdivisible").html("yes");
		    } else {
			$("#isdivisible").html("no");
		    }
		    assetbalance = parseFloat(assetbalance).toString();
		    //TODO - to be improved - replace temporary currenttoken
		    if (assetname.substr(0, 1) == "A") {
			var enhancedassetname = $("#xcpbalance").data("enhanced");
			//var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance);
			$("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 16px; font-weight: bold;'>" + enhancedassetname + "</div><div style='margin-top: 5px; font-size: 11px; font-style: italic;'>" + currenttoken + "</div>");
		    } else {
			$("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
		    }
		    $('#assetbalhide').html(assetbalance);
		    getRate(assetbalance, pubkey, currenttoken);
		    currenttokenpending(currenttoken);
		}
	    });
	});
    }
    if (typeof assetbalance === 'undefined') {
	//TODO - to be improved - replace temporary currenttoken

	if (currenttoken.substr(0, 1) == "A") {
	    var enhancedassetname = $("#xcpbalance").data("enhanced");
	    $("#xcpbalance").html("<div id='currentbalance'>0</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 16px; font-weight: bold;'>" + enhancedassetname + "</div><div style='margin-top: 5px; font-size: 11px; font-style: italic;'>" + currenttoken + "</div>");
	} else {
	    $("#xcpbalance").html("<div id='currentbalance'>0</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
	}
	$('#assetbalhide').html(0);
	getRate(0, pubkey, currenttoken);
	currenttokenpending(currenttoken);
    }
}


/**
 * To be investigate
 * @param {type} pubkey
 * @returns {undefined}
 */
function getPrimaryBalanceBTC(pubkey) {
    //var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;
    var source_html = "http://btc.blockr.io/api/v1/address/info/" + pubkey;
    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
    $.getJSON(source_html, function (apidata) {  //blockr
	//$.getJSON( source_html, function( data ) {  //insight
	//var bitcoinparsed = parseFloat(data) / 100000000; //insight
	var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
	//var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
	$("#xcpbalance").html(bitcoinparsed + "<br><div style='font-size: 22px; font-weight: bold;'>BTC</div>");
//        if (bitcoinparsed.toFixed(8) == 0) {
//            $("#btcsendbox").hide();
//        } else {
//            $("#btcsendbox").show();
//        }
	getRate(bitcoinparsed, pubkey, "BTC");
    });
}


function getPrimaryBalance(pubkey) {
    var addressbox = $("#sendtoaddress").val();

    if (addressbox.length == 0) {
	$("#btcsendbox").hide();
    }
    var currenttoken = $(".currenttoken").html();
    if (currenttoken != "BTC") {
	getPrimaryBalanceXCP(pubkey, currenttoken);
    } else {
	getPrimaryBalanceBTC(pubkey);
    }
}




function getRate(assetbalance, pubkey, currenttoken) {
    //if ($("#ltbPriceFlipped").html() == "...") {
    //$.getJSON( "https://api.bitcoinaverage.com/ticker/USD/", function( data ) {
    //$.getJSON("http://btc.blockr.io/api/v1/exchangerate/current", function (data) {
    var link = "http://coinmarketcap-nexuist.rhcloud.com/api/bcy/price";
    if (currenttoken == "BTC") {
	link = "http://coinmarketcap-nexuist.rhcloud.com/api/btc/price";
    }
    //console.log(currenttoken);
    $.getJSON(link, function (data) {
	//var btcprice = 1 / parseFloat(data.last);
	var btcprice = parseFloat(data.usd);
	$("#ltbPrice").html(Number(btcprice.toFixed(5).toLocaleString('en')));
	//var btcpriceflipped = data.last;
	var btcpriceflipped = btcprice;
	$("#ltbPriceFlipped").html("$" + Number(btcprice.toFixed(3).toLocaleString('en')));
	$("#ltbPrice").data("btc", {price: btcprice.toFixed(6)});
	if (currenttoken == "BTC") {
	    //var usdValue = parseFloat(data.last) * parseFloat(assetbalance);
	    var usdValue = parseFloat(btcpriceflipped) * parseFloat(assetbalance);
	    $("#xcpfiatValue").html(usdValue.toFixed(2));
	    $("#priceSrc").html('USD/BTC');
	    $("#switchtoxcp").hide();
	    $("#fiatvaluebox").show();
	} else {
	    if (currenttoken == "BITCRYSTALS") {
		var usdValue = parseFloat(btcpriceflipped) * parseFloat(assetbalance);
		$("#xcpfiatValue").html(usdValue.toFixed(2));
		$("#priceSrc").html('USD/BCY');
		$("#switchtoxcp").hide();
		$("#fiatvaluebox").show();
	    } else {
		$("#fiatvaluebox").hide();
		$("#switchtoxcp").show();
	    }
	}
	chrome.storage.local.set({
	    'btcperusd': btcprice
	}, function () {
	});
	$.getJSON("http://www.coincap.io/front/", function (data) {
	    var j = 0;
	    var assetrates = new Array();
	    $.each(data, function (i, item) {
		var assetname = data[i].short;
		var assetprice = data[i].price;
		if (assetname == "LTBC") {
		    assetname = "LTBCOIN";
		    assetrates[j] = [assetname, assetprice];
		    j++;
		}
		if (assetname == "XCP") {
		    assetrates[j] = [assetname, assetprice];
		    j++;
		}
	    });
	    $.getJSON("http://www.coincap.io/front/xcp", function (data) {
		$.each(data, function (i, item) {
		    var assetname = data[i].short;
		    var assetprice = data[i].price;
		    if (assetname != "LTBC" && assetname != "XCP") {
			assetrates[i + j] = [assetname, assetprice];
		    }
		});
		var currentdate = new Date();
		var datetime = (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + " at " + currentdate.getHours() + ":" + padprefix(currentdate.getMinutes(), 2);
		chrome.storage.local.set({
		    'assetrates': assetrates,
		    'assetrates_updated': datetime
		});
	    });
	});
    });
    //} 
//    else {
//	console.log($("#ltbPrice").data("btc").price);
//	if (currenttoken == "BTC") {
//	    var ltbrate = $("#ltbPrice").data("btc").price;
//	    var usdrate = parseFloat(ltbrate);
//	    var usdValue = usdrate * parseFloat(assetbalance);
//	    $("#xcpfiatValue").html(usdValue.toFixed(2));
//	    $("#switchtoxcp").hide();
//	    $("#fiatvaluebox").show();
////	} else if (currenttoken == "BTC") {
////	    //var btcrate = $("#btcPrice").html();
////	    //var usdValue = btcrate * parseFloat(assetbalance);
////	    //$("#xcpfiatValue").html(usdValue.toFixed(2));
////	    $("#fiatvaluebox").hide();
////	    $("#switchtoxcp").show();
//	} else {
//	    if (currenttoken == "BITCRYSTALS"){
//		var ltbrate = $("#ltbPrice").data("btc").price;
//		var usdrate = parseFloat(ltbrate);
//		var usdValue = usdrate * parseFloat(assetbalance);
//		$("#xcpfiatValue").html(usdValue.toFixed(2));
//		$("#switchtoxcp").hide();
//		$("#fiatvaluebox").show();
//	    } else {
//		$("#fiatvaluebox").hide();
//		$("#switchtoxcp").show();
//	    }
//	}
//    }
    getBTCBalance(pubkey);
}

function convertPassphrase(m) {
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    var derived = HDPrivateKey.derive("m/0'/0/" + 0);
    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
    var pubkey = address1.toString();
    return pubkey;

}

function assetDropdown(m) {
    $(".addressselect").html("");
    $("#bindwalletaddresses").html("");
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    chrome.storage.local.get(function (data) {
	var totaladdress = data["totaladdress"];
	var addresslabels = data["addressinfo"];
	for (var i = 0; i < totaladdress; i++) {
	    var derived = HDPrivateKey.derive("m/0'/0/" + i);
	    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
	    var pubkey = address1.toString();

	    $(".addressselect").append("<option label='" + addresslabels[i].label + "' title='" + pubkey + "'>" + pubkey + "</option>");
	    $("#bindwalletaddresses").append("<option label='" + addresslabels[i].label + "' title='" + pubkey + "'>" + pubkey + "</option>");
	    if (i == 0) {
		$('#displaycurrentkey').html(pubkey);
		$('#currentaddressname').html(addresslabels[i].label);
		$(".addressselect").attr("title", pubkey);
	    }

	    //.slice(0,12)
	    //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
	}
	$(".addressselect").append("<option label='--- Add New Address ---' title='add'>add</option>");
	updateAddressDropDown();
    });
}


function dynamicAddressDropdown(addresslabels, type) {
    var string = $("#newpassphrase").html();
    var array = string.split(" ");
    m = new Mnemonic(array);
    var currentsize = $('#walletaddresses option').size();
    if (type == "newlabel") {
	currentsize = currentsize - 1;
	var addressindex = $("#walletaddresses option:selected").index();
    }
    $(".addressselect").html("");

    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    for (var i = 0; i < currentsize; i++) {
	var derived = HDPrivateKey.derive("m/0'/0/" + i);
	var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
	var pubkey = address1.toString();
	//$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
	$(".addressselect").append("<option label='" + addresslabels[i].label + "' title='" + pubkey + "'>" + pubkey + "</option>");
    }
    $(".addressselect").append("<option label='--- Add New Address ---' title='add'>add</option>");

    if (type == "newaddress") {
	getBTCBalance(pubkey);
	$('#displaycurrentkey').html(pubkey);
	var newaddress_position = parseInt(currentsize) - 1;
	var newaddress_select = "#walletaddresses option:eq(" + newaddress_position + ")";
	var newaddress_val = $(newaddress_select).val();
	$("#xcpaddress").html(newaddress_val);
	getPrimaryBalance(newaddress_val);
    } else {
	var newaddress_position = addressindex;
    }
    var newaddress_select = "#walletaddresses option:eq(" + newaddress_position + ")";
    $(newaddress_select).attr('selected', 'selected');
    updateAddressDropDown();
}


function newPassphrase() {
    m = new Mnemonic(128);
    m.toWords();
    var str = m.toWords().toString();
    var res = str.replace(/,/gi, " ");
    var phraseList = res;
    $("#newpassphrase").html(phraseList);
    $("#yournewpassphrase").html(phraseList);
    //Update - set only 1 adress
    var addressinfo = [{label: "Address 1"}];
    chrome.storage.local.set({
	'passphrase': phraseList,
	'encrypted': false,
	'firstopen': false,
	'addressinfo': addressinfo,
	'totaladdress': 5
    }, function () {
	//resetFive();
	$(".hideEncrypted").show();
	var pubkey = convertPassphrase(m);
	$("#xcpaddressTitle").show();
	$("#xcpaddress").html(pubkey);
	getPrimaryBalance(pubkey);
	assetDropdown(m);
	$('#allTabs a:first').tab('show');
    });
}


function existingPassphrase(string) {
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    $("#newpassphrase").html(string);
    var pubkey = convertPassphrase(m2);
    $("#xcpaddressTitle").show();
    $("#xcpaddress").html(pubkey);
    getPrimaryBalance(pubkey);
    checkImportedLabels(m2, assetDropdown);
    $('#allTabs a:first').tab('show')
}


function manualPassphrase(passphrase) {
    //    var string = $('#manualMnemonic').val().trim().toLowerCase();
    //    $('#manualMnemonic').val("");
    $('#walletyesererror').html("");
    var string = passphrase.trim().toLowerCase();
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    $("#newpassphrase").html(string);
    //console.log(m2);

    try {

	var pubkey = convertPassphrase(m2);

	chrome.storage.local.set({
	    'passphrase': string,
	    'encrypted': false,
	    'firstopen': false
	}, function () {
	    console.log(pubkey);
	    $("#xcpaddressTitle").show();
	    $("#xcpaddress").html(pubkey);
	    getPrimaryBalance(pubkey);
	    $('#walletyes').hide();
	    $('#encryptquestion').show();
	    assetDropdown(m2);
	    $(".hideEncrypted").show();
	    $("#manualPassBox").hide();
	    $('#allTabs a:first').tab('show');
	});
    } catch (err) {
	console.log(err);
	$('#walletyesererror').html("The Passphrase is not valid.");
    }

}


function loadAssets(add) {
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+add;
    var source_html = "https://counterpartychain.io/api/balances/" + add + "?description=1";
    //console.log(source_html);
    var xcp_source_html = "http://counterpartychain.io/api/address/" + add;
    //console.log(xcp_source_html);
    var btc_source_html = "https://insight.bitpay.com/api/addr/" + add + "/balance";
    //console.log(btc_source_html);
    $("#alltransactions").html("<div align='center' style='margin: 40px 0 40px 0;' class='lead'>Loading...</div>");
    $("#allassets").html("<div align='center' style='margin: 40px 0 40px 0;' class='lead'>Loading...</div>");
    $.getJSON(xcp_source_html, function (data) {
	//var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance);
	var xcpbalance = parseFloat(data.xcp_balance).toFixed(8);
	if (xcpbalance == 'NaN' || typeof xcpbalance === 'undefined') {
	    xcpbalance = 0;
	}
	//console.log(data);
//	https://counterpartychain.io/api/balances/1PFZZFLhJ2dC5jG8tDTmcnmJZh3W1RfCzx?description=1
//	http://counterpartychain.io/api/address/1PFZZFLhJ2dC5jG8tDTmcnmJZh3W1RfCzx
//	https://insight.bitpay.com/api/addr/1PFZZFLhJ2dC5jG8tDTmcnmJZh3W1RfCzx/balance
	$.getJSON(source_html, function (data) {

	    $("#allassets").html("<div class='col-xs-6'><div class='asset'><div class='row btcasset'><div class='col-xs-3' style='margin-left: -10px;'><img src='asset/img/bitcoin_48x48.png'></div><div class='col-xs-9 assetdata'><div class='assetname'>BTC</div><div class='assetqtybox'><div class='assetqty' style='background-color: #EBC481;' id='btcassetbal'></div></div></div><div class='hovereffect'><div class='inner'><div class='movetowallet'>Send</div></div></div></div></div></div>");
	    var isbtcloading = $("#isbtcloading").html();
	    if (isbtcloading == "true") {
		var btcbalance = "...";
		$("#btcassetbal").html(btcbalance);
		$.getJSON(btc_source_html, function (data_btc) {
		    var bitcoinparsed = parseFloat(data_btc) / 100000000;
		    $("#isbtcloading").html("false");
		    $("#btcassetbal").html(bitcoinparsed);
		});
	    } else {
		var btcbalance = $("#btcbalhide").html();
		$("#btcassetbal").html(btcbalance);
	    }
	    var xcpicon = "http://counterpartychain.io/content/images/icons/xcp.png";
	    if (xcpbalance != 0) {
		xcpbalance = parseFloat(xcpbalance);
		$("#allassets").append("<div class='col-xs-6'><div class='asset'><div class='row xcpasset'><div class='col-xs-3' style='margin-left: -10px;'><img src='" + xcpicon + "'></div><div class='col-xs-9 assetdata'><div class='assetname'>XCP</div><div class='assetqtybox'><div class='assetqty' style='background-color: #CF5151;'>" + xcpbalance + "</div></div></div><div class='hovereffect'><div class='inner'><div class='movetowallet'>Send</div></div></div></div></div></div>");
	    }
	    var totalassets = data.data;
	    var countnumeric = 0;
	    var addressbvam = new Array();
	    if (data.success != 0) {
		for (var i = 0; i < totalassets.length; i++) {
		    var assetdescription = data.data[i].description;
		    var assetname = data.data[i].asset;
		    var assetbalance = data.data[i].amount;
		    if (assetdescription.substr(0, 6) == "TOKNID" && assetname.substring(0, 4) == "A111") {
			countnumeric++;
			var bvamhash = assetdescription.substr(7);
			addressbvam = addressbvam.concat({asset: assetname, amount: assetbalance, hash: bvamhash, data: ""});
		    }
		}

		//console.log("Total BVAM: " + countnumeric);
		checkBvam(addressbvam, countnumeric, function (matchingdata, missing) {

		    //console.log("missing: " + missing);
		    var allbvamdata = new Array();
		    $.each(data.data, function (i, item) {
			var assetname = data.data[i].asset;
			var assetbalance = data.data[i].amount; //.balance for blockscan
			//console.log(assetbalance);
			var assetdescription = data.data[i].description;
			if (assetbalance.indexOf(".") == -1) {
			    var divisible = "no";
			} else {
			    var divisible = "yes";
			}
			assetbalance = parseFloat(assetbalance);
			var iconname = assetname.toLowerCase();
			var iconlink = "http://counterpartychain.io/content/images/icons/" + iconname + ".png";
			if (assetname.charAt(0) != "A") {
			    var classname = 'singleasset';
			    if (assetname == "BITCRYSTALS") {
				classname = 'bcyasset';
			    }
			    var assethtml = "<div class='col-xs-6'><div class='asset'><div class='row " + classname + "'><div class='col-xs-3' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='" + iconlink + "'></div></div><div class='col-xs-9 assetdata'><div class='archiveasset'>Archive</div><div class='assetname'>" + assetname + "</div><div class='assetqtybox'><div class='assetqty amountbg'>" + assetbalance + "</div> <div class='" + assetname + "-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>" + divisible + "</div></div><div class='hovereffect'><div class='inner'><div class='movetowallet'>Send</div></div></div></div></div></div>";

			    //3082B0
			    $("#allassets").append(assethtml);
			}
		    });
		    $.each(matchingdata, function (i, item) {
//
//
//                    if (assetname.substring(0, 4) == "A111") {
//
//                        console.log(assetname);
//
//
//                            var checkprefix = (assetdescription).substr(0,6);
//
//                            var hash = (assetdescription).substr(7);
//
//                            console.log(hash);
//
//                            console.log(checkprefix);
//
//                            if(checkprefix == "TOKNID") {
			var hash = matchingdata[i]["hash"];
			var assetname = matchingdata[i]["asset"];
			var assetbalance = matchingdata[i]["amount"];
			var iconlink = "http://counterpartychain.io/content/images/icons/xcp.png";
			if (assetbalance.indexOf(".") == -1) {
			    var divisible = "no";
			} else {
			    var divisible = "yes";
			}
			if (matchingdata[i]["data"] != "") {
			    //local bvam
			    var isvaliddata = validateEnhancedAssetJSON(matchingdata[i]["data"]);
			    console.log("Calculated Local JSON Hash: " + isvaliddata);
			    console.log("Stored Local JSON Hash: " + hash);
			    if (isvaliddata != hash) {
				var jsondata = new Array();
				var jsondata = {ownername: matchingdata[i]["data"]["ownername"], ownertwitter: matchingdata[i]["data"]["ownertwitter"], owneraddress: matchingdata[i]["data"]["owneraddress"], asset: matchingdata[i]["data"]["asset"], assetname: matchingdata[i]["data"]["assetname"], assetdescription: matchingdata[i]["data"]["assetdescription"], assetwebsite: matchingdata[i]["data"]["assetwebsite"]};
				var isvaliddata = validateEnhancedAssetJSON(jsondata);
				console.log("Re-ordered Calculated Local JSON Hash: " + isvaliddata);
				console.log("Stored Local JSON Hash: " + hash);
			    }
			    if (isvaliddata == hash && matchingdata[i]["data"]["asset"] == assetname) {
				var enhancedname = matchingdata[i]["data"]["assetname"];
				var assethtml = "<div class='col-xs-6'><div class='asset'><div class='row enhancedasset'><div class='col-xs-3' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='" + iconlink + "'></div></div><div class='col-xs-9 assetdata'><div class='archiveasset'>Archive</div><div style='width: 200px;' class='assetname-enhanced' data-numeric='" + assetname + "'>" + enhancedname + "</div><div class='movetowallet'>Send</div><div style='margin: 5px 0 8px 9px; width: 200px; font-size: 11px; font-style: italic;'>" + assetname + "</div><div class='assetqtybox'><div class='assetqty' style='background-color: #6B8A62;'>" + assetbalance + "</div> <div class='" + assetname + "-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>" + divisible + "</div></div></div>";
				$("#allassets").append(assethtml);
			    }
			} else {
			    //get bvam
			    $.getJSON("http://xcp.ninja/hash/" + hash + ".json", function (data) {
				var isvaliddata = validateEnhancedAssetJSON(data);
				console.log("Calculated Remote JSON Hash: " + isvaliddata);
				console.log("Stored Remote JSON Hash: " + hash);
				if (isvaliddata == hash && data.asset == assetname) {
				    var assethtml = "<div class='col-xs-6'><div class='asset'><div class='row enhancedasset'><div class='col-xs-3' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='" + iconlink + "'></div></div><div class='col-xs-9 assetdata'><div class='archiveasset'>Archive</div><div style='width: 200px;' class='assetname-enhanced' data-numeric='" + assetname + "'>" + data.assetname + "</div><div class='movetowallet'>Send</div><div style='margin: 5px 0 8px 9px; width: 200px; font-size: 11px; font-style: italic;'>" + assetname + "</div><div class='assetqtybox'><div class='assetqty' style='background-color: #6B8A62;'>" + assetbalance + "</div> <div class='" + assetname + "-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>" + divisible + "</div></div></div></div></div>";
				    allbvamdata = allbvamdata.concat({hash: hash, data: data});
				    if (missing == 1) {
					addBvam(allbvamdata);
					console.log(allbvamdata);
				    } else {
					missing--;
				    }
				    $("#allassets").append(assethtml);
				}
			    }).fail(function () {
				if (missing == 1) {
				    addBvam(allbvamdata);
				    console.log(allbvamdata);
				} else {
				    missing--;
				}
			    });
			}
//                            }
//                   }
		    });
		});
	    } else {
		var classname = 'bcyasset';
		var iconname = "BITCRYSTALS";
		var iconlink = "http://counterpartychain.io/content/images/icons/" + iconname.toLowerCase() + ".png";
		var assethtml = "<div class='col-xs-6'><div class='asset'><div class='row " + classname + "'><div class='col-xs-3' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='" + iconlink + "'></div></div><div class='col-xs-9 assetdata'><div class='archiveasset'>Archive</div><div class='assetname'>BITCRYSTALS</div><div class='assetqtybox'><div class='assetqty amountbg'>0</div> <div class='BITCRYSTALS-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>no</div></div><div class='hovereffect'><div class='inner'><div class='movetowallet'>Send</div></div></div></div></div></div>";

		//3082B0
		$("#allassets").append(assethtml);
	    }
	    var xcp_mempool_html = "https://counterpartychain.io/api/mempool";
	    $.getJSON(xcp_mempool_html, function (data) {
		if (data.success == 1 && data.total > 0) {
		    var currentaddr = $("#xcpaddress").html();
		    $.each(data.data, function (i, item) {
			if (currentaddr == data.data[i].source || currentaddr == data.data[i].destination) {
			    if (currentaddr == data.data[i].source) {
				var debitorcredit = "-";
			    }
			    if (currentaddr == data.data[i].destination) {
				var debitorcredit = "+";
			    }
			    var assetqty = debitorcredit + (data.data[i].quantity * 1);
			    var assetname = data.data[i].asset;
			    var assetnameclass = "." + assetname + "-pending";
			    if ($(assetnameclass).html() != '') {
				var currentunconf = $(assetnameclass).html();
				var result = currentunconf.substring(1, currentunconf.length - 1);
				console.log(result);
				var combinetxs = parseFloat(result) + parseFloat(assetqty);
				console.log(combinetxs);
				if (combinetxs > 0) {
				    var unconftxs = "+" + combinetxs;
				} else {
				    var unconftxs = combinetxs;
				}
				$(assetnameclass).html("(" + unconftxs + ")")
			    } else {
				$(assetnameclass).html("(" + assetqty + ")");
			    }
			    var currentunconf = $(assetnameclass).html();
			    var result = parseFloat(currentunconf.substring(1, currentunconf.length - 1));
			    if (result > 0) {
				$(".assetqty-unconfirmed").css("color", "#9CFFA7");
			    } else {
				$(".assetqty-unconfirmed").css("color", "#FA9B9B");
			    }
			}
		    });
		}
	    });
	    //  $( "#allassets" ).append("<div style='height: 20px;'></div>");
	    //loadTransactions(add);
	});
    });
}


/*function updateBTC(pubkey){
 
 var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
 
 $.getJSON( source_html, function( data ) {
 $("#xcpbalance").html(data);
 });
 };*/



function makedSignedMessage(msg, addr, sig) {
    var qtHdr = [
	"<pre>-----BEGIN BITCOIN SIGNED MESSAGE-----",
	"-----BEGIN BITCOIN SIGNATURE-----",
	"-----END BITCOIN SIGNATURE-----</pre>"
    ];
    return qtHdr[0] + '\n' + msg + '\n' + qtHdr[1] + '\nVersion: Bitcoin-qt (1.0)\nAddress: ' + addr + '\n\n' + sig + '\n' + qtHdr[2];
}


function getprivkey(inputaddr, inputpassphrase) {
//var inputaddr = $('#inputaddress').val();
//var string = inputpassphrase.val().trim().toLowerCase();
//string = string.replace(/\s{2,}/g, ' ');
    var array = inputpassphrase.split(" ");
    m2 = new Mnemonic(array);
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m2.toHex(), bitcore.Networks.livenet);
    for (var i = 0; i < 50; i++) {
	var derived = HDPrivateKey.derive("m/0'/0/" + i);
	var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
	var pubkey = address1.toString();
	if (inputaddr == pubkey) {
	    var privkey = derived.privateKey.toWIF();
	    break;
	}
    }
    return privkey;
}


function signwith(privkey, pubkey, message) {
//var message = "Message, message";
    var p = updateAddr(privkey, pubkey);
    if (!message || !p.address) {
	return;
    }
    message = fullTrim(message);
    var sig = sign_message(p.key, message, p.compressed, p.addrtype);
    sgData = {"message": message, "address": p.address, "signature": sig};
    signature_final = makedSignedMessage(sgData.message, sgData.address, sgData.signature);
    return signature_final;
}


function twodigits(n) {
    return n > 9 ? "" + n : "0" + n;
}


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
//    var year = a.getFullYear();
//    var month = a.getMonth() + 1;
//    var date = a.getDate();
//    var hour = a.getHours();
//    var min = a.getMinutes();
//    var sec = a.getSeconds();
    var time = a.toLocaleDateString() + " | " + a.toLocaleTimeString();
    //var time = twodigits(date) + '-' + twodigits(month) + '-' + year + ' | ' + twodigits(hour) + ':' + twodigits(min) + ':' + twodigits(sec);
    return time;
}


function loadTransactionsBTC(add, callback) {
    var source_html = "http://btc.blockr.io/api/v1/address/txs/" + add;
    $.getJSON(source_html, function (data) {
	var btctxs = new Array();
//        for (var i = 0; i < 100; i++) {
	$.each(data.data.txs, function (i, item) {
	    var tx = data.data.txs[i]["tx"];
	    var time_utc = data.data.txs[i]["time_utc"];
	    var confirmations = data.data.txs[i]["confirmations"];
	    var amount = data.data.txs[i]["amount"];
	    if (amount > 0) {
		amount = "+" + amount;
	    }
	    var time_date = new Date(time_utc);
	    var time_unix = time_date.getTime();
	    time_unix = parseFloat(time_unix) / 1000;
	    btctxs.push({assetname: "BTC", address: "", tx: tx, time_utc: time_unix, amount: amount});
	});
//        }
	callback(add, btctxs);
    });
}

function loadTransactions(add, btctxs) {
    loadBvam(function (bvamdata, hashname, hashhash) {
	loadTransactionsBTC(add, function (add, btctxs) { //{"address":"1CWpnJVCQ2hHtehW9jhVjT2Ccj9eo5dc2E","asset":"LTBCOIN","block":348621,"quantity":"-50000.00000000","status":"valid","time":1426978699,"tx_hash":"dc34bbbf3fa02619b2e086a3cde14f096b53dc91f49f43b697aaee3fdec22e86"}
	    var source_html = "https://counterpartychain.io/api/transactions/" + add;
	    $.getJSON(source_html, function (data) {
		var alltxs = new Array();
		var xcptxs = new Array();
		console.log(data);
		if (data.success != 0) {
		    $.each(data.data, function (i, item) {
			var assetname = data.data[i].asset;
			var address = data.data[i].address;
			var quantity = data.data[i].quantity;
			var time = data.data[i].time;
			var tx = data.data[i].tx_hash;
			xcptxs.push({assetname: assetname, address: address, tx: tx, time_utc: time, amount: quantity});
		    });
		    var alltxs = xcptxs.concat(btctxs);
		} else {
		    var alltxs = btctxs;
		}
		console.log(alltxs);
		alltxs.sort(function (a, b) {
		    return b.time_utc - a.time_utc;
		});
		var j;
		for (var i = 0; i < alltxs.length; i++) {
		    for (var j = 0; j < alltxs.length; j++) {
			if (i != j) {
			    if (alltxs[i]["tx"] == alltxs[j]["tx"]) {
				if (alltxs[i].assetname == "BTC") {
				    alltxs.splice(i, 1);
				} else if (alltxs[j].assetname == "BTC") {
				    alltxs.splice(j, 1);
				}
			    }
			}
		    }
		}
		$("#alltransactions").html("");
		for (var i = 0; i < 100; i++) {
		    //$.each(alltxs, function(i, item) {
		    if (alltxs[i] !== undefined) {
			var assetname = alltxs[i]["assetname"];
			//if (assetname.charAt(0) != "A") {
			var address = alltxs[i].address;
			var quantity = alltxs[i].amount;
			var time = alltxs[i].time_utc;
			var translink = "https://counterpartychain.io/transaction/" + alltxs[i].tx;
			var addlink = "https://counterpartychain.io/address/" + address;
			if (parseFloat(quantity) < 0) {
			    var background = "senttrans";
			    var transtype = "<span class='small'>Sent to </span>";
			} else {
			    var background = "receivedtrans";
			    var transtype = "<span class='small'>Received from </span>";
			}
			if (assetname != "BTC") {
			    if (assetname.charAt(0) == "A") {
				if (typeof (hashname[assetname]) !== 'undefined') {
				    var assetname_localbvam = hashname[assetname];
				    var assethtml = "<div class='" + background + "'><div class='row'><div class='col-xs-6'><div class='assetnumerictrans'>" + assetname_localbvam + "<div style='font-size: 11px; font-style: italic; font-weight: normal;'>" + assetname + "</div></div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='addresstrans'>" + transtype + "<br><a href='" + addlink + "'>" + address.substring(0, 12) + "...</a></div></div></div><div class='small' style='width: 100%; text-align: right; margin: -18px 0 0 -14px;'><a href='" + translink + "'>" + timeConverter(time) + "</a></div></div>";
				} else {
				    var assethtml = "<div class='" + background + "'><div class='row'><div class='col-xs-6'><div class='assetnumerictrans' style='font-size: 12px;'>" + assetname + "</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='addresstrans'>" + transtype + "<br><a href='" + addlink + "'>" + address.substring(0, 12) + "...</a></div></div></div><div class='small' style='width: 100%; text-align: right; margin: -18px 0 0 -14px;'><a href='" + translink + "'>" + timeConverter(time) + "</a></div></div>";
				}
			    } else {
				var assethtml = "<div class='" + background + "'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>" + assetname + "</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='addresstrans'>" + transtype + "<br><a href='" + addlink + "'>" + address.substring(0, 12) + "...</a></div><div class='small' style='bottom: 0;'><a href='" + translink + "'>" + timeConverter(time) + "</a></div></div></div></div>";
			    }
			} else {
			    translink = "https://chain.so/tx/BTC/" + alltxs[i].tx;
			    var assethtml = "<div class='btctrans'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>" + assetname + "</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='small' style='margin-top: 54px;'><a href='" + translink + "''>" + timeConverter(time) + "</a></div></div></div></div>";
			}
			$("#alltransactions").append(assethtml);
			//}
		    }
		    //});
		}
		//            $( "#alltransactions" ).append("<div style='height: 20px;'></div>");
	    });
	});
    });
}

function loadBvam(callback) {
    chrome.storage.local.get(function (data) {
	if (typeof (data["bvam"]) !== 'undefined') {
	    var hashname = new Array();
	    var hashhash = new Array();
	    var allbvam = data["bvam"];
	    for (var i = 0; i < allbvam.length; i++) {
		var asset = allbvam[i]["data"]["asset"];
		var name = allbvam[i]["data"]["assetname"];
		var hash = allbvam[i]["hash"];
		hashname[asset] = name;
		hashhash[asset] = hash;
	    }
	} else {
	    var allbvam = "";
	}
	console.log(hashname);
	console.log(hashhash);
	callback(allbvam, hashname, hashhash);
    });
}

//function loadTransactions(add, btctxs) {
//    loadTransactionsBTC(add, function (add, btctxs) { //{"address":"1CWpnJVCQ2hHtehW9jhVjT2Ccj9eo5dc2E","asset":"LTBCOIN","block":348621,"quantity":"-50000.00000000","status":"valid","time":1426978699,"tx_hash":"dc34bbbf3fa02619b2e086a3cde14f096b53dc91f49f43b697aaee3fdec22e86"}
//	var source_html = "https://counterpartychain.io/api/transactions/" + add;
//	$.getJSON(source_html, function (data) {
//	    var alltxs = new Array();
//	    var xcptxs = new Array();
//	    $.each(data.data, function (i, item) {
//		var assetname = data.data[i].asset;
//		var address = data.data[i].address;
//		var quantity = data.data[i].quantity;
//		var time = data.data[i].time;
//		var tx = data.data[i].tx_hash;
//		xcptxs.push({assetname: assetname, address: address, tx: tx, time_utc: time, amount: quantity});
//	    });
//	    var alltxs = xcptxs.concat(btctxs);
//	    console.log(alltxs);
//	    alltxs.sort(function (a, b) {
//		return b.time_utc - a.time_utc;
//	    });
//	    var j;
//	    for (var i = 0; i < alltxs.length; i++) {
////                j = i - 1;
//		for (var j = 0; j < alltxs.length; j++) {
//		    if (alltxs[i]["tx"] == alltxs[j]["tx"]) {
//			if (alltxs[i].assetname == "BTC") {
//			    alltxs.splice(i, 1);
//			} else if (alltxs[j].assetname == "BTC") {
//			    alltxs.splice(j, 1);
//			}
//		    }
//		}
//	    }
//	    $("#alltransactions").html("");
//	    for (var i = 0; i < 100; i++) {
//		//$.each(alltxs, function(i, item) {
//		if (alltxs[i] !== undefined) {
//		    var assetname = alltxs[i]["assetname"];
//		    //if (assetname.charAt(0) != "A") {
//		    var address = alltxs[i].address;
//		    var quantity = alltxs[i].amount;
//		    var time = alltxs[i].time_utc;
//		    var translink = "https://counterpartychain.io/transaction/" + alltxs[i].tx;
//		    var addlink = "https://counterpartychain.io/address/" + address;
//		    if (parseFloat(quantity) < 0) {
//			var background = "senttrans";
//			var transtype = "<span class='small'>Sent to </span>";
//		    } else {
//			var background = "receivedtrans";
//			var transtype = "<span class='small'>Received from </span>";
//		    }
//		    if (assetname != "BTC") {
//			if (assetname.charAt(0) == "A") {
//			    var assethtml = "<div class='" + background + "'><div class='row'><div class='col-xs-6'><div class='assetnumerictrans'>" + assetname + "</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='addresstrans'>" + transtype + "<br><a href='" + addlink + "'>" + address.substring(0, 12) + "...</a></div><div class='small' style='bottom: 0;'><a href='" + translink + "'>" + timeConverter(time) + "</a></div></div></div></div>";
//			} else {
//			    var assethtml = "<div class='" + background + "'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>" + assetname + "</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='addresstrans'>" + transtype + "<br><a href='" + addlink + "'>" + address.substring(0, 12) + "...</a></div><div class='small' style='bottom: 0;'><a href='" + translink + "'>" + timeConverter(time) + "</a></div></div></div></div>";
//			}
//		    } else {
//			translink = "https://chain.so/tx/BTC/" + alltxs[i].tx;
//			var assethtml = "<div class='btctrans'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>" + assetname + "</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>" + quantity + "</div></div><div class='col-xs-6'><div class='small' style='margin-top: 54px;'><a href='" + translink + "''>" + timeConverter(time) + "</a></div></div></div></div>";
//		    }
//		    $("#alltransactions").append(assethtml);
//		    //}
//		}
//		//});
//	    }
////            $( "#alltransactions" ).append("<div style='height: 20px;'></div>");
//	});
//    });
//}


function isAdressValid() {
    var sendtoaddress = $("#sendtoaddress").val();
    sendtoaddress = sendtoaddress.replace(/^\s+|\s+$/g, "");
    if (bitcore.Address.isValid(sendtoaddress)) {
	return true;
    } else {
	var userid = $("#sendtoaddress").val().toLowerCase();
	$.getJSON("http://api.moonga.com/RCT/cp/members/playerWallets/" + userid, function (data) {
	    console.log(data);
	});
	return false;
    }
}

function sendtokenaction() {
    var currentbuttonlabel = $("#sendtokenbutton").html();
    //$("#sendtokenbutton").html("Sending...");
    $("#sendtokenbutton").prop('disabled', true);
//            var assetbalance = $("#xcpbalance").html();
//            var array = assetbalance.split(" ");
//            var currentbalance = parseFloat(array[0]);
    var assetbalance = $("#assetbalhide").html();
    var currentbalance = parseFloat(assetbalance);
    var pubkey = $("#xcpaddress").html();
    var currenttoken = $(".currenttoken").html();
    var sendtoaddress = $("#sendtoaddress").val();
    sendtoaddress = sendtoaddress.replace(/^\s+|\s+$/g, "");
    var sendtoamount_text = $("#sendtoamount").val();
    var sendtoamount = parseFloat(sendtoamount_text);
    if ($("#isdivisible").html() == "no") {
	sendtoamount = Math.floor(sendtoamount) / 100000000;
    }
    console.log(sendtoamount);
    var minersfee = 0.0001;
    if (currenttoken == "BTC") {
	var totalsend = sendtoamount + minersfee;
	var btcbalance = $("#btcbalhide").html();
	currentbalance = parseFloat(btcbalance);
//                console.log("totalsend: "+totalsend);
//                console.log("sendtoamount: "+sendtoamount);
//                console.log("currentbalance: "+currentbalance);
    } else {
	var totalsend = parseFloat(sendtoamount);
    }
    if (bitcore.Address.isValid(sendtoaddress)) {
	if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric(sendtoamount) == false) {
	    $("#sendtokenerroramount").html("Invalid Amount");
	    //$("#sendtoamount").val("Invalid Amount");
	    $("#sendtokenbutton").html("Refresh to continue");
	} else {
	    if (totalsend > currentbalance) {
		$("#sendtokenerroramount").html("Insufficient Funds");
		//$("#sendtoamount").val("Insufficient Funds");
		$("#sendtokenbutton").html("Refresh to continue");
	    } else {
		var txsAvailable = $("#txsAvailable").html();
		if (currenttoken == "BTC") {
		    sendBTC(pubkey, sendtoaddress, sendtoamount, minersfee);
		} else if (txsAvailable > 1) {
		    var btc_total = 0.0000547; //total btc to receiving address
		    var msig_total = 0.000078; //total btc to multisig output (returned to sender)
		    var mnemonic = $("#newpassphrase").html();
		    $("#sendtokenbutton").html("Sending...");
		    //sendXCP(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, msig_total, minersfee, mnemonic);
		    sendXCP_opreturn(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, minersfee, mnemonic);
		    //setUnconfirmed(pubkey, currenttoken, sendtoamount);
		}
		$("#sendtoaddress").prop('disabled', true);
		$("#sendtoamount").prop('disabled', true);
		//$("#sendtokenbutton").html("Sent! Refresh to continue...");
	    }
	}
    } else {
	var success = false;
	//var userid = $("#sendtoaddress").val().toLowerCase();

	var source_html = "https://spellsofgenesis.com/api/";
	var method = "?get_wallet_address";
	var parameter = {login: sendtoaddress};
	//console.log('test');
	$.post(source_html + method, parameter, function (data) {
	    console.log(data);
	    if (data.error) {
		console.log(data);
	    } else {
		if (data.xcp_pubkey === null) {
		    console.log("error");
		    $("#sendtokenerroraddress").html("Invalid account or address");
		    //$("#sendtoaddress").val("Invalid Address");
		    $("#sendtokenbutton").html("Refresh to continue");
		} else {
		    if (bitcore.Address.isValid(data.xcp_pubkey)) {
			if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric(sendtoamount) == false) {
			    $("#sendtokenerroramount").html("Invalid Amount");
			    //$("#sendtoamount").val("Invalid Amount");
			    $("#sendtokenbutton").html("Refresh to continue");
			} else {
			    if (totalsend > currentbalance) {
				$("#sendtokenerroramount").html("Insufficient Funds");
				//$("#sendtoamount").val("Insufficient Funds");
				$("#sendtokenbutton").html("Refresh to continue");
			    } else {
				var txsAvailable = $("#txsAvailable").html();
				if (currenttoken == "BTC") {
				    sendBTC(pubkey, data.xcp_pubkey, sendtoamount, minersfee);
				} else if (txsAvailable > 1) {
				    $("#sendtoaddress").val(data.xcp_pubkey);
				    var btc_total = 0.0000547; //total btc to receiving address
				    var msig_total = 0.000078; //total btc to multisig output (returned to sender)
				    var mnemonic = $("#newpassphrase").html();
				    $("#sendtokenbutton").html("Sending...");
				    //sendXCP(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, msig_total, minersfee, mnemonic);
				    sendXCP_opreturn(pubkey, data.xcp_pubkey, currenttoken, sendtoamount, btc_total, minersfee, mnemonic);
				    //setUnconfirmed(pubkey, currenttoken, sendtoamount);
				}
				$("#sendtoaddress").prop('disabled', true);
				$("#sendtoamount").prop('disabled', true);
				//$("#sendtokenbutton").html("Sent! Refresh to continue...");
			    }
			}
		    } else {
			$("#sendtokenerroraddress").html("Invalid account or address");
			//$("#sendtoaddress").val("Invalid Address");
			$("#sendtokenbutton").html("Refresh to continue");
		    }
		}

	    }
	}, 'json');


//	$.getJSON("http://api.moonga.com/RCT/cp/members/playerWallets/" + userid, function (data) {
//	    success = true;
//	    $("#sendtoaddress").val(data.Members["wallet_key"]);
//	    $("#debug").html('Wallet key gen ' + data.Members["wallet_key"]);
//	    sendtokenaction();
//	});
//	setTimeout(function () {
//	    if (!success) {
//		$("#sendtoaddress").val("Invalid Address");
//		$("#sendtokenbutton").html("Refresh to continue");
//	    }
//	}, 1500);
    }
}




function resetFive() {
    var addressinfo = [{label: "Address 1"}, {label: "Address 2"}, {label: "Address 3"}, {label: "Address 4"}, {label: "Address 5"}];
    chrome.storage.local.set({
	'totaladdress': 5,
	'addressinfo': addressinfo
    }, function () {
	var string = $("#newpassphrase").html();
	var array = string.split(" ");
	m = new Mnemonic(array);
	var pubkey = convertPassphrase(m);
	$("#xcpaddressTitle").show();
	$("#xcpaddress").html(pubkey);
	getPrimaryBalance(pubkey);
	assetDropdown(m);
	$('#allTabs a:first').tab('show');
    });
}


function setChainsoOn() {
    chrome.storage.local.get(function (data) {
	if (typeof (data["chainso_detect"]) !== 'undefined') {
	    //already set
	    var detect = data["chainso_detect"];
	    if (detect == "no") {
		var detect = "no";
		chrome.storage.local.set({
		    'chainso_detect': detect
		}, function () {
		    $('#turnoffchainso').html("Enable Chain.so Token Detection");
		});
	    } else {
		var detect = "yes";
		chrome.storage.local.set({
		    'chainso_detect': detect
		}, function () {
		    $('#turnoffchainso').html("Disable Chain.so Token Detection");
		});
	    }
	} else {
	    var detect = "yes";
	    chrome.storage.local.set({
		'chainso_detect': detect
	    }, function () {
		$('#turnoffchainso').html("Disable Chain.so Token Detection");
	    });
	}
    })
}


function setInitialAddressCount() {
    setChainsoOn();
    chrome.storage.local.get(function (data) {
	if (typeof (data["totaladdress"]) !== 'undefined') {
	    //already set
	    var newtotal = parseInt(data["totaladdress"]);
	} else {
	    var newtotal = 5;
	}
	if (typeof (data["addressinfo"]) !== 'undefined') {
	    //already set
	    var addressinfo = data["addressinfo"];
	} else {
	    var addressinfo = [{label: "Address 1"}, {label: "Address 2"}, {label: "Address 3"}, {label: "Address 4"}, {label: "Address 5"}];
	}
	chrome.storage.local.set({
	    'totaladdress': newtotal,
	    'addressinfo': addressinfo
	}, function () {
	    //show new address
	});
    });
}


function addTotalAddress(callback) {
    chrome.storage.local.get(function (data) {
	var newtotal = parseInt(data["totaladdress"]) + 1;
	var addressinfo = data["addressinfo"];
	var newlabel = "Address " + newtotal;
	addressinfo.push({label: newlabel});
	chrome.storage.local.set({
	    'totaladdress': newtotal,
	    'addressinfo': addressinfo
	}, function () {
	    callback(addressinfo, "newaddress");
	});
    });
}


function insertAddressLabel(newlabel, callback) {
    chrome.storage.local.get(function (data) {
	var addressinfo = data["addressinfo"];
	var addressindex = $("#walletaddresses option:selected").index();
	addressinfo[addressindex].label = newlabel;
	chrome.storage.local.set({
	    'addressinfo': addressinfo
	}, function () {
	    $("#addresslabeledit").toggle();
	    $("#pocketdropdown").toggle();
	    callback(addressinfo, "newlabel");
	});
    });
}


function currenttokenpending(token) {
    var xcp_mempool_html = "https://counterpartychain.io/api/mempool";
    $.getJSON(xcp_mempool_html, function (data) {
	if (data.success == 1 && data.total > 0) {
	    var currentaddr = $("#xcpaddress").html();
	    var totalunconfirmed = 0;
	    $.each(data.data, function (i, item) {
		if (currentaddr == data.data[i].source || currentaddr == data.data[i].destination) {
		    var assetname = data.data[i].asset;
		    if (token == assetname) {
			if (currentaddr == data.data[i].source) {
			    totalunconfirmed -= parseFloat(data.data[i].quantity);
			}
			if (currentaddr == data.data[i].destination) {
			    totalunconfirmed += parseFloat(data.data[i].quantity);
			}
			if (totalunconfirmed > 0) {
			    $("#currenttoken-pending").css("color", "#679967");
			} else {
			    $("#currenttoken-pending").css("color", "#FA7A7A");
			}
		    }
		}
	    });
	    var totalqty = totalunconfirmed * 1;
	    if (totalunconfirmed > 0) {
		$("#currenttoken-pending").html("(+" + totalqty + ")");
	    } else if (totalunconfirmed < 0) {
		$("#currenttoken-pending").html("(" + totalqty + ")");
	    }
	}
    });
}


//function setUnconfirmed(sendaddress, sendasset, sendamount) {
//
//    var currentbalance = parseFloat($("#assetbalhide").html());
//    var finalbalance = currentbalance - parseFloat(sendamount);
//    var unconfirmedamt = parseFloat(sendamount)*(-1);
//
//
//
//    var tx = {asset: sendasset, txamount: unconfirmedamt, postbalance: finalbalance};
//
//    var txfinal = {address: sendaddress, tx: tx};
//
//    chrome.storage.local.get(function(data) {
//        if(typeof(data["unconfirmedtx"]) !== 'undefined' && data["unconfirmedtx"] instanceof Array) {
//            data["unconfirmedtx"].push(txfinal);
//        } else {
//            data["unconfirmedtx"] = [txfinal];
//        }
//
//        chrome.storage.local.set(data);
//
//
//
//    });
//
//}


function loadAddresslist() {
    var string = $("#newpassphrase").html();
    var array = string.split(" ");
    m = new Mnemonic(array);
    var currentsize = $('#walletaddresses option').size();
    currentsize = currentsize - 1;
    var addressindex = $("#walletaddresses option:selected").index();


    $(".addressselectnoadd").html("");
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    chrome.storage.local.get(function (data) {
	var addresslabels = data.addressinfo;
	for (var i = 0; i < currentsize; i++) {
	    var derived = HDPrivateKey.derive("m/0'/0/" + i);
	    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
	    var pubkey = address1.toString();
//	    if (i === 0) {
//		$('#displaycurrentkey').html(pubkey);
//		$('#currentaddressname').html(addresslabels[i].label);
//	    }
	    //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
	    $(".addressselectnoadd").append("<option label='" + addresslabels[i].label + "' title='" + pubkey + "'>" + pubkey + "</option>");
	}
	//updateAddressDropDown();
    });
}

//function loadAddresslistForLabelUpdate() {
//    var string = $("#newpassphrase").html();
//    var array = string.split(" ");
//    m = new Mnemonic(array);
//    var currentsize = $('#walletaddresses option').size();
//    currentsize = currentsize - 1;
//    var addressindex = $("#walletaddresses option:selected").index();
//    var val = $('#walletaddresses :selected').val();
//
//    $(".addressselectnoadd").html("");
//    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
//    chrome.storage.local.get(function (data) {
//	var addresslabels = data.addressinfo;
//	
//	for (var i = 0; i < currentsize; i++) {
//	    var derived = HDPrivateKey.derive("m/0'/0/" + i);
//	    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
//	    var pubkey = address1.toString();
//	    if (pubkey === val) {
//		
//		return;
//	    }
//	    //newPocketLabel
////	    if (i === 0) {
////		$('#displaycurrentkey').html(pubkey);
////		$('#currentaddressname').html(addresslabels[i].label);
////	    }
//	    //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
//	    $(".addressselectnoadd").append("<option label='" + addresslabels[i].label + "' title='" + pubkey + "'>"+ pubkey + "</option>");
//	}
//	//updateAddressDropDown();
//    });
//}


//function loadSwapbots() {
//
//
//
//     var swapbots_public_html = "http://swapbot.tokenly.com/api/v1/public/bots";
//
//            $.getJSON( swapbots_public_html, function( data ) {
//
//                if (data.length > 0) {
//
//                    var allbots = [];
//
//                    $.each(data, function(i, item)  {
//
//                            allbots.push(data[i].id);
//
//                    });
//
//                    console.log(allbots);
//                }
//            });
//
//}


function loadFeatureRequests() {
    var issues_public_html = "https://api.github.com/repos/loon3/Tokenly-Pockets/issues";
    $.getJSON(issues_public_html, function (data) {
	$("#FundDevBody").html("");
	if (data.length > 0) {
	    $("#FundDevBody").append("<div class='h3' style='padding: 10px 0 10px 0;'>Fund Development</div><div style='padding: 10px;'><img src='funddev-icon.png'></div><div style='padding: 10px 15px 15px 15px;'>Below is a list of proposed features for Tokenly Pockets. When a proposed feature reaches its funding goal, it is added to the <span style='font-weight: bold;'><a href='https://github.com/loon3/Tokenly-Pockets/labels/feature%20queue'>feature queue</a></span> and completed in the order in which it's added.</div><div>To fund the features below,<br>you need <a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'><span style='font-weight: bold;'>POCKETCHANGE</span> <img src='pc-icon.png'></a></div><hr><div style='padding: 15px 0 5px 0; font-size: 18px; font-style: italic;'>Proposed Features:</div>");
	    var allfeatures = [];
	    $.each(data, function (i, item) {
		var info = data[i].labels[2];
		if (info != undefined) {
		    if (info['name'] == "new feature") {
			var address = data[i].labels[0]['name'];
			var budget = data[i].labels[1]['name'];
			var title = data[i].title;
			var body = data[i].body;
			var url = data[i].html_url;
			var propnum = data[i].number;
			//color: #fff; background-color: #2d3c93;
			$("#FundDevBody").append("<div style='margin: 20px 20px 40px 20px; padding: 10px 10px 5px 10px; border: 3px solid #aaa; background-color: #f8f8f8;'><div style='padding: 5px; background-color: #fff; border: 2px solid #aaa;'><div style='padding: 5px 0 0 0; font-size: 24px;'>" + title + "</div><div class='small' style='padding: 10px 0 0 0; margin-top: -10px; font-weight: bold;'><a href='" + url + "'>View on Github</a></div><div style='padding: 20px 10px 10px 10px;'>" + body + "</div></div><div style='margin: 10px -4px 5px -4px;'><div style='padding: 5px; font-size: 14px; height: 28px;'>Goal: <span style='font-weight: bold; font-size: 16px;'>" + addCommas(budget.substr(1)) + "</span> <div style='display: inline-block;'><img src='pc-icon.png'></div></div><div style='padding: 5px; font-size: 14px; height: 28px;'>Funded: <span style='font-style: italic;'><span style='font-weight: bold; font-size: 18px;' class='pct-" + address + "'></span></span> ( <span style='font-weight: bold; font-style: italic; font-size: 16px;' class='" + address + "'>0</span> <div style='display: inline-block;'><img src='pc-icon.png'> )</div></div></div><div style='padding: 10px 0 5px 0; font-size: 12px; font-style: italic;'>Contribute to Feature:</div><div class='btn-group' role='group' aria-label='...'><button data-address='" + address + "' data-token='POCKETCHANGE' data-title='" + title + "' class='btn btn-warning  movetosendFundDev'>Send POCKETCHANGE <img src='pc-icon-white.png'></button></div><div style='padding: 5px; font-size: 11px; font-weight: bold;'><a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'>Get POCKETCHANGE</a></div></div>");
			//$("#FundDevBody").append("<div style='margin: 20px 20px 40px 20px; padding: 10px 10px 5px 10px; border: 3px solid #aaa; background-color: #f8f8f8;'><div style='padding: 5px; background-color: #fff; border: 2px solid #aaa;'><div style='padding: 5px 0 0 0; font-size: 24px;'>"+title+"</div><div class='small' style='padding: 10px 0 0 0; margin-top: -10px; font-weight: bold;'><a href='"+url+"'>View on Github</a></div><div style='padding: 20px 10px 10px 10px;'>"+body+"</div></div><div style='margin: 10px -4px 5px -4px;'><div style='padding: 5px; font-size: 14px; height: 28px;'>Funded: <span style='font-weight: bold; font-style: italic; font-size: 16px;' class='"+address+"'>0</span> <div style='display: inline-block;'><img src='pc-icon.png'></div></div></div><div style='padding: 10px 0 5px 0; font-size: 12px; font-style: italic;'>Contribute to Feature:</div><div class='btn-group' role='group' aria-label='...'><button data-address='"+address+"' data-token='POCKETCHANGE' data-title='"+title+"' class='btn btn-warning  movetosendFundDev'>Send POCKETCHANGE <img src='pc-icon-white.png'></button></div><div style='padding: 5px; font-size: 11px; font-weight: bold;'><a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'>Get POCKETCHANGE</a></div></div>");
			returnTokenBalance(address, "POCKETCHANGE", function (pcbalance) {
			    var issueclass = "." + address;
			    var issuepctclass = ".pct-" + address;
			    var pcbalnum = parseInt(pcbalance);
			    var budgetnum = parseInt(budget.substr(1));
			    var fundedpct = (pcbalnum / budgetnum) * 100;
			    //if (fundedpct < 1) {
			    fundedpct = fundedpct.toFixed(1);
			    //}
			    console.log(fundedpct);
			    $(issueclass).html(addCommas(pcbalance));
			    $(issuepctclass).html(fundedpct + "%");
			    allfeatures.push({title: title, body: body, url: url, pocketchange: pcbalance});
			});
		    }
		}
	    });
	    console.log(allfeatures);
	    $("#FundDevBody").append("<div style='height: 20px; line-height: 20px; margin: 10px 0 50px 0;'>Have an idea for a new feature?<br><a href='https://github.com/loon3/Tokenly-Pockets/issues/new' style='font-weight: bold;'>Create an issue on Github!</a></div>");
//                   return allfeatures;
	}
    });
}


function returnTokenBalance(address, currenttoken, callback) {
    var source_html = "https://counterpartychain.io/api/balances/" + address;
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    $.getJSON(source_html, function (data) {
	if (data.data != undefined) {
	    $.each(data.data, function (i, item) {
		var assetname = data.data[i].asset;
		if (assetname == currenttoken) {
		    var assetbalance = data.data[i].amount;
		    assetbalance = parseFloat(assetbalance).toString();
		    callback(assetbalance);
		}
	    });
	} else {
	    callback(0);
	}
    });
}


function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
	x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


function loadSwaplist(currenttoken) {
    var swaplist_body = "<tr><td colspan='3'><div style='margin: auto; text-align: center;'><div style='padding: 0 0 0 0; width: 100%; text-align: center;'></div><div id='" + currenttoken + "-swapbotlist' style='margin: 15px 0 10px 0;'><table class='table table-hover' style='width: 260px; margin: 15px; border: 2px solid #ccc;'><thead><th style='text-align: center;'>Token</th><th style='text-align: center;'>Price per " + currenttoken + "</th></thead><tbody>";
    var source_html = "http://swapbot.tokenly.com/api/v1/public/availableswaps?inToken=" + currenttoken + "&sort=cost";
    $.getJSON(source_html, function (data) {
	$.each(data, function (i, item) {
	    if (data[i].bot["state"] == "active") {
		var receive_token = data[i].swap["out"];
		var receive_token_rate = parseFloat(data[i].swap["rate"]).toFixed(8);
		var receive_token_cost = data[i].swap["cost"];
		var bot_url = data[i].bot["botUrl"];
		swaplist_body += "<tr class='swapbotselect' data-url='" + bot_url + "'><td>" + receive_token + "</td><td><div>" + receive_token_rate + "</div></td></tr>";
	    }
	});
	swaplist_body += "</tbody></table></div></div></td></tr>";
	$(".swaplistbody").html(swaplist_body);
    });
}


function validateEnhancedAssetJSON(jsondata) {
    var jsonstring = JSON.stringify(jsondata);
    console.log(jsonstring);
    var firstSHA = Crypto.SHA256(jsonstring)
    var hash160 = Crypto.RIPEMD160(Crypto.util.hexToBytes(firstSHA))
    var version = 0x41 // "T"
    var hashAndBytes = Crypto.util.hexToBytes(hash160)
    hashAndBytes.unshift(version)
    var doubleSHA = Crypto.SHA256(Crypto.util.hexToBytes(Crypto.SHA256(hashAndBytes)))
    var addressChecksum = doubleSHA.substr(0, 8)
    var unencodedAddress = "41" + hash160 + addressChecksum
    var address = Bitcoin.Base58.encode(Crypto.util.hexToBytes(unencodedAddress))
    return address
}


function exportAddresses() {
    chrome.storage.local.get(function (data) {
	var addresslabels = data.addressinfo;
	var string = $("#newpassphrase").html();
	var array = string.split(" ");
	m = new Mnemonic(array);
	var currentsize = $('#walletaddresses option').size();
	var exportfiledata = new Object();
	currentsize -= 1;
	var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
	for (var i = 0; i < currentsize; i++) {
	    var derived = HDPrivateKey.derive("m/0'/0/" + i);
	    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
	    var pubkey = address1.toString();
	    if (i == 0) {
		var firstkey = pubkey;
	    }
	    var currentlabel = addresslabels[i].label;
	    addresslabels[i].address = pubkey;
	}
	console.log(firstkey);
	// Convert object to a string.
	var result = JSON.stringify(addresslabels);
	// Save as file
	var url = 'data:application/json;base64,' + btoa(result);
	var file = firstkey.substr(0, 8);
	chrome.downloads.download({
	    url: url,
	    filename: file + '.json'
	});
    });
}


function checkImportedLabels(m, callback) {
    chrome.storage.local.get(function (data) {
	if (typeof (data["imported_labels"]) !== 'undefined' && data["imported_labels"] != false) {
	    var newlabels = data["imported_labels"];
	    var newqty = newlabels.length;
	    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
	    var derived = HDPrivateKey.derive("m/0'/0/0");
	    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
	    var pubkey = address1.toString();
//         console.log(newlabels[0].address);
//         console.log(pubkey);
	    if (newlabels[0].address == pubkey) {
		var newinfo = [];
		$.each(newlabels, function (i, item) {
		    newinfo.push({"label": newlabels[i].label});
		});
		chrome.storage.local.set({
		    'addressinfo': newinfo,
		    'totaladdress': newqty,
		    'imported_labels': false
		}, function () {
		    callback(m);
		});
	    } else {
		callback(m);
	    }
	} else {
	    callback(m);
	}
    });
}


//
//function checkBvamStorage() {
//
//    chrome.storage.local.get(function(data) {
//
//        if(typeof(data["bvam"]) === 'undefined') {
//               //not set
//
//            chrome.storage.local.set(
//                    {
//
//                        'bvam': []
//
//                    });
//
//        }
//
//    });
//}


function addBvam(newbvamdata) {
    chrome.storage.local.get(function (data) {
	if (typeof (data["bvam"]) === 'undefined') {
	    var allbvam = new Array();
	} else {
	    var allbvam = data["bvam"];
	}
	allbvam = allbvam.concat(newbvamdata);
	chrome.storage.local.set(
		{
		    'bvam': allbvam
		}, function () {
	});
    });
}


function getBvam(asset, callback) {
    chrome.storage.local.get(function (data) {
	if (typeof (data["bvam"]) !== 'undefined') {
	    var allbvam = data["bvam"];
	    for (var j = 0; j < allbvam.length; j++) {
		if (allbvam[j]["data"]["asset"] == asset) {
		    callback(allbvam[j]["data"]["assetname"]);
		}
	    }
	}
    });
}


function checkBvam(assetlist, countnumeric, callback) {
    chrome.storage.local.get(function (data) {
	if (typeof (data["bvam"]) === 'undefined') {
	    var allbvam = new Array();
	} else {
	    var allbvam = data["bvam"];
	}
	console.log(allbvam);
	var storedbvam = new Array();
	for (var i = 0; i < assetlist.length; i++) {
	    for (var j = 0; j < allbvam.length; j++) {
		if (assetlist[i]["hash"] == allbvam[j]["hash"]) {
		    assetlist[i]["data"] = allbvam[j]["data"];
		    countnumeric--;
		}
	    }
	}
	callback(assetlist, countnumeric);
    });
}


function showBindWallet(email, pwd, user_id) {
    //first check if already bind
    //if (!checkifwalletbind(email, user_id)) {
    welcomesplashShow();
    $('#initialsplash').hide();
    $('#bindwallet').show();
    $('#bindwalletform').submit(function (e) {
	e.preventDefault();
	var source_html = "https://spellsofgenesis.com/api/";
	var method = "?bind_wallet_address";
	var parameter = {login: email, password: pwd, xcp_pubkey: $('#bindwalletaddresses').val()};
	$.post(source_html + method, parameter, function (data) {
	    console.log(data);
	    if (data.error) {
		//$('#loginformerror').show();
		$('#bindwalleterror').html(data.error);
	    } else {
		if (data.message) {
		    if (data.message === "success") {
			$('#bindwalleterror').html('');
			$('#bindwallet').hide();
			saveuserid(user_id, email);
		    } else {
			$('#bindwalleterror').html(data.message);
		    }
		} else {
		    $('#bindwalleterror').html('Unknown error');
		}
	    }
	}, 'json');
    });
    //}
}

function checkifwalletbind(email, user_id, pwd) {
    var source_html = "https://spellsofgenesis.com/api/";
    var method = "?get_wallet_address";
    var parameter = {login: email};
    $.post(source_html + method, parameter, function (data) {
	console.log(data);
	if (data.error) {
	    $('#loginformerror').show();
	    $('#loginformerror').html(data.error);
	} else {
	    if (data.xcp_pubkey !== null && (data.xcp_pubkey.length > 5)) {
		console.log(data.xcp_pubkey);
		var isSameWallet = false;
		var linkedadress;
		var string = $("#newpassphrase").html();
		var array = string.split(" ");
		m = new Mnemonic(array);
		var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
		chrome.storage.local.get(function (dataStorage) {
		    var totaladdress = dataStorage["totaladdress"];

		    //var addresslabels = data["addressinfo"];
		    for (var i = 0; i < totaladdress; i++) {
			var derived = HDPrivateKey.derive("m/0'/0/" + i);
			var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
			var pubkey = address1.toString();
			console.log(pubkey);
			if (pubkey == data.xcp_pubkey) {
			    isSameWallet = true;
			    linkedadress = pubkey;
			    console.log(pubkey + " - " + data.xcp_pubkey);
			}
		    }
		    if (isSameWallet) {
			saveuserid(user_id, email, linkedadress);
		    } else {
			$('#loginformerror').show();
			$('#loginformerror').html("Your Spells Of Genesis account is already linked to another address from another wallet");
		    }
		});

	    } else {
		showBindWallet(email, pwd, user_id);
	    }
	}
    }, 'json');
}

function updateAddressDropDown() {
    var source_html = "https://spellsofgenesis.com/api/";
    var method = "?get_wallet_address";
    chrome.storage.local.get(["user_email"], function (data) {

	if (data.user_email) {
	    var parameter = {login: data.user_email};
	    $.post(source_html + method, parameter, function (data) {
		//loop address list
		if (data.xcp_pubkey !== null) {
		    var list = $('#walletaddresses > option');
		    $.each(list, function () {
			console.log($(this).val());
			if ($(this).val() === data.xcp_pubkey) {
			    console.log("yeah " + $(this).attr('label'));
			    var tempText = $(this).attr('label');
			    $(this).attr('label', tempText + " - SOG linked address");
			}
		    });
		}


	    });
	}
    });
}

function showAssetsCards(allCards, userCards) {
    var userCardsAvailable = true;
    var firstCards = "";
    var remainingCards = "";
    if (userCards.success === 0) {
	userCardsAvailable = false;
    }

    //$("#availableCards").html("");
    $.each(allCards, function (i, item) {
	//console.log(item);
	var assetName = item.asset_name;
	if (assetName != null) {
	    var owned = false;
	    var quantity = 0;
	    if (userCardsAvailable) {

		$.each(userCards.data, function (j, itemUser) {
		    if (item.asset_name === itemUser.asset) {
			owned = true;
			quantity = parseFloat(itemUser.amount);
			//return false;
		    }
		});
	    }
	    //console.log(item);
	    $("#cardGrid").append(formatCard(item, owned, quantity));
//	    if (!owned) {
//		$("#cardGrid").append("<div class='grid-item card_holder'><div class='card_asset'><div class='card_bg'><img class='img_grey' src='http://api.moonga.com/gw_admin/img/cards/generated/card_" + item.card_id + "_small.png'><div class='cardtitle'>" + item.name + "</div></div></div></div>");
//	    }
	}
    });

    var $grid = $('#cardGrid').isotope({
	itemSelector: '.grid-item',
	percentPosition: true,
	transitionDuration: '0.8s',
	layoutMode: 'fitRows',
	getSortData: {
	    name: '.card_name',
	    power: '.card_power parseInt',
	    solidity: '.card_solidity parseInt',
	    element: '.card_element_id',
	    skill: '.card_skill parseInt'
	}
    });


    var iso = $grid.data('isotope');
    $grid.isotope('reveal', iso.items);

    $('.sort-by-button-group').on('click', 'button', function () {
	$('.sort-by-button-group').children().removeClass('active');
	$('#cardGrid').children().removeClass('is-expanded');
//	$.each(buttonList, function(i, item){
//	    item.button('toggle');
//	});
	//console.log(buttonList);
	var sortByValue = $(this).attr('data-sort-by');
	$(this).button('toggle');
	$grid.isotope({sortBy: sortByValue});
    });



    $grid.on('click', '.card_asset', function () {
	var isExpended = false;
	if ($(this).parent('.grid-item').hasClass('is-expanded')) {
	    isExpended = true;
	}
	$('#cardGrid').children().removeClass('is-expanded');
	if (!isExpended) {
	    $(this).parent('.grid-item').toggleClass('is-expanded');
	    $(this).find('.datainfo').show();
	} 
	$grid.isotope('layout');
	var item = $(this);
	$grid.one('layoutComplete', function () {
	    $('html, body').animate({
		scrollTop: item.offset().top - 90
	    }, 200);
	});

    });

    $('.card_bg').hover(function () {
	if (!$(this).parent().parent('.grid-item').hasClass('is-expanded')) {
	    $(this).find('.datainfo').slideToggle("fast");
	}
    }, function () {
	if (!$(this).parent().parent('.grid-item').hasClass('is-expanded')) {
	    $(this).find('.datainfo').slideToggle("fast");
	}
    });
    //console.log($grid);
// manually trigger initial layout
    //$grid.isotope();
//    $grid.imagesLoaded().progress( function() {
//	$grid.isotope('layout');
//    });
}

function formatCard(card, owned, quantityCard) {
    var extraClass = "img_grey";
    var quantity = "";
    if (owned) {
	extraClass = "";
	quantity = "<div class='col-xs-12 text-center'>"
		+ "<p>Quantity: <span>" + quantityCard + "</span></p>"
		+ "</div>";
    }
    var cardFormatted = "<div class='grid-item card_holder'>"
	    + "<div class='card_asset'>"
	    + "<div class='card_bg'>"
	    + "<div class='cardtitle'>"
	    + "<p class='card_name'>" + card.name + "</p>"
	    + "<div class='row datainfo'>"
	    + "<div class='col-xs-6'>"
	    + "<p>Power: <span class='card_power'>" + card.power + "</span></p>"
	    + "<p>Solidity: <span class='card_solidity'>" + card.solidity + "</span></p>"
	    + "</div>"
	    + "<div class='col-xs-6'>"
	    + "<p><span class='card_element_id'>" + getElement(card.element_id) + "</span></p>"
	    + "<p>Skill: <span class='card_skill'>" + card.skill + "</span></p>"
	    + "</div>"
	    + quantity
	    + "<div class='col-xs-12 text-center'>"
	    + "<a target='_blank' href='" + card.purchase_link + "' class='btn " + getButton(card.status) + " btn-sm btn_order'>" + getTitleButton(card.status) + "</a>"
	    + "</div>"
	    + "</div>"
	    + "</div>"
	    + "<img class='" + extraClass + "' src='http://api.moonga.com/gw_admin/img/cards/generated/card_" + card.card_id + "_small.png'>"
	    + "</div>"
	    + "</div>"
	    + "</div>";
    return cardFormatted;
}

function getElement(elementId) {
    if (elementId === 0) {
	return "None";
    }
    if (elementId === 1) {
	return "Water";
    }
    if (elementId === 2) {
	return "Fire";
    }
    if (elementId === 3) {
	return "Ice";
    }
    if (elementId === 4) {
	return "Earth";
    }
    if (elementId === 5) {
	return "Light";
    }
    if (elementId === 6) {
	return "Dark";
    }
    if (elementId === 7) {
	return "Ether";
    }
}

function getButton(status) {
    //console.log(status);
    var buttonClass = 'btn-default';
    var enable = "disabled";
    if (status === 'out_of_stock') {
	buttonClass = 'btn-default';
	enable = "disabled";
    }
    if (status === 'coming_soon') {
	buttonClass = 'btn-soon';
	enable = "disabled";
    }
    if (status === 'partner') {
	buttonClass = 'btn-partner';
	enable = "";
    }
    if (status === 'premium') {
	buttonClass = 'btn-premium';
	enable = "";
    }
    if (status === 'public') {
	buttonClass = 'btn-public';
	enable = "";
    }
    if (status === 'on_hold') {
	buttonClass = 'btn-hold';
	enable = "";
    }
    return buttonClass + " " + enable;
}

function getTitleButton(status) {
    var title = '';
    if (status === 'out_of_stock') {
	title = "Out of stock";
    }
    if (status === 'coming_soon') {
	title = "Coming soon";
    }
    if (status === 'partner') {

	title = "Partner store";
    }
    if (status === 'premium') {
	title = "Premium store";
    }
    if (status === 'public') {
	title = "Purchase now";
    }
    if (status === 'on_hold') {
	title = "On hold";
    }
    return title;
}

function getUserCards() {
    /**
     * 1. Get all available cards
     * 2. if connected, get user's cards
     * 3. Parse first array and check for each if user owns it
     * 4. Display
     */

    var source_html = "https://spellsofgenesis.com/api/";
    var method = "?get_sog_cards";
    var parameter = {};
    //1
    $.post(source_html + method, parameter, function (data) {
	//2
	var address = $("#xcpaddress").html();
	var source_html = "https://counterpartychain.io/api/balances/" + address + "?description=1";
	$.getJSON(source_html, function (dataAsset) {
	    console.log(dataAsset);
	    showAssetsCards(data, dataAsset);
	});


//	chrome.storage.local.get(["user_id", "user_email"], function (dataStorage) {
//	    if (dataStorage.user_id && dataStorage.user_email) {
//		var method = "?get_user_cards";
//		var parameter = {login: dataStorage.user_email};
//		$.post(source_html + method, parameter, function (dataUser) {
//		    if (dataUser.error) {
//			showAssetsCards(data, null);
//		    } else {
//			showAssetsCards(data, dataUser);
////			$("#allcards").html("");
////			$.each(data.cards, function (i, item) {
////			    //console.log(item);
////			    $("#allcards").append("<div class='col-xs-6 card_holder'><div class='card_asset'><div class='card_bg'><div class='cardtitle'>" + item.asset + "</div><img src='http://api.moonga.com/gw_admin/img/cards/generated/card_" + item.moonga_id + "_small.png'></div></div></div>");
////			});
//			//$("#allcards").html("<div class='col-xs-6'><div class='asset'><div class='row btcasset'><div class='col-xs-3' style='margin-left: -10px;'><img src='asset/img/bitcoin_48x48.png'></div><div class='col-xs-9 assetdata'><div class='assetname'>BTC</div><div class='assetqtybox'><div class='assetqty' style='background-color: #EBC481;' id='btcassetbal'></div></div></div><div class='hovereffect'><div class='inner'><div class='movetowallet'>Send</div></div></div></div></div></div>");
//		    }
//		}, 'json');
//	    } else {
//		showAssetsCards(data, null);
//	    }
//	});
    });
}



function checkIfConnected() {
    chrome.storage.local.get(["user_id", "user_email"], function (data) {
	//console.log(data);
	if (data.user_id && data.user_email) {
	    return data;
	} else {
	    return null;
	}
    });
}

function saveuserid(user_id, email, linkedadress) {
    chrome.storage.local.set({
	'user_id': user_id,
	'user_email': email,
	'linked_address': linkedadress
    }, function () {
	$("#welcomesplash").hide();
	$("#priceBox").show();
	$('#alreadyconnected').html("Your Spells Of Genesis account has been linked to the previously selected address of this wallet.");
	hidelogin();
	updateAddressDropDown();
    });
}

function hidelogin() {
    $('#sogaccountmessage').hide();
    $('#form_login').hide();
    $('#alreadyconnected').show();
}

function reloadContent() {
    //on adress select change, reload
    var address = $("#xcpaddress").html();
    //balance load
    getPrimaryBalance(address);

    //asset + transaction tab

    //$("#alltransactions").hide();
    if ($('#assettransactiontoggle').html() == "View Tokens") {
	loadTransactions(address);
    } else {
	loadAssets(address);
    }

    //reload game cards
    $("#cardGrid").html("<div class='grid-sizer'></div>");
    $('.sort-by-button-group').children().removeClass('active');
    $('#defaultbtn').addClass('active');
    var grid = Isotope.data('#cardGrid');

    //var grid = $('#cardGrid').data('isotope');
    if (grid != null) {
	console.log(grid);
	$('#cardGrid').unbind('click');
	grid.destroy();
    }
    getUserCards();
}


//function FindAsset(asset) {
//                    var string = $("#newpassphrase").html();
//                    var array = string.split(" ");
//                    m = new Mnemonic(array);
//
//                    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
//
//                        for (var i = 0; i < 5; i++) {
//
//
//
//                            var derived = HDPrivateKey.derive("m/0'/0/" + i);
//                            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
//
//                            var pubkey = address1.toString();
//
//                            var source_html = "https://counterpartychain.io/api/balances/" + pubkey; //counterpartychain api
//
//                            $.getJSON( source_html, function( data ) {
//
//                                console.log(data);
//
//                                if(data.success == 1){
//
//                                 $.each(data.data, function(i, item) {
//
//                                    var assetname = data.data[0]["asset"];
//
//                                    if (assetname == asset) { //asset from API
//
//                                        return pubkey;
//
//                                    }
//
//                                 });
//
//                                }
//
//
//
//
//                            });
//                        }
//
//
//}
