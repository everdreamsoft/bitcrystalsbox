var bitcore = require('bitcore');

$(document).ready(function () {

    setInitialAddressCount();

    setPinBackground();
    
    $('#inputPin').focus();
    

    $('#alltransactions').hide();

    $('#yourtxid').on('click', 'a', function () {
	chrome.tabs.create({url: $(this).attr('href')});
	return false;
    });

    $('#alltransactions').on('click', 'a', function () {
	chrome.tabs.create({url: $(this).attr('href')});
	return false;
    });


    $('#newsStories').on('click', 'a', function () {
	chrome.tabs.create({url: $(this).attr('href')});
	return false;
    });

    $('#FundDevBody').on('click', 'a', function () {
	chrome.tabs.create({url: $(this).attr('href')});
	return false;
    });


    $("#tutorial_splash").click(function () {
	$("#tutorial_splash").hide();
    });


    $('#shapeshiftButton').click(function () {
	var selectedaddress = $("#getbtcAddress").val();
	chrome.tabs.create({url: "https://shapeshift.io/shifty.html?destination=" + selectedaddress + "&amp;apiKey=da63a102dd3dbbf683d7123c90ce66dad4b7b9c5636bb5c842b6bf207be84195b2a8199dc933aeb7e83ca3a234551673753b0e9c6e53f529e37abc919d108691&amp;amount="});
    });

    $("#pinsplash").hide();
    $("#infoPage").hide();
    $('#alltransactions').hide();

    getStorage();
    //setEncryptedTest();

    //on open
    var manifest = chrome.runtime.getManifest();

    var infobutton = "<div style='display: inline-block; padding-left: 5px;'><a id='infoButton' href='#'><img src='asset/img/info-icon.png' height='16' width='16'></a></div>";

    $("#infoButton").click(function(){
	var randomBackground = Math.floor(Math.random() * 6);
	var bg_link = "url('/asset/img/pin_bg/" + randomBackground + ".jpg') no-repeat 100% center fixed";
	$("#infoPage").css("background", bg_link);
	$("#infoPage").css("background-size", "cover");
	$("#infoPage").show();
    });
    
    $('#infoPageCloseButton').click(function(){
	$("#infoPage").hide();
    })
    
    $("#nameversionvalue").html("BitCrystals Box v" + manifest.version);


    var JsonFormatter = {
	stringify: function (cipherParams) {
	    // create json object with ciphertext
	    var jsonObj = {
		ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
	    };

	    return JSON.stringify(jsonObj);
	},
	parse: function (jsonStr) {
	    // parse json string
	    var jsonObj = JSON.parse(jsonStr);

	    // extract ciphertext from json object, and create cipher params object
	    var cipherParams = CryptoJS.lib.CipherParams.create({
		ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
	    });

	    return cipherParams;
	}
    };

    $("#pinsplashform").submit(function (e) {
	//console.log(e.target.id);
	//if (e.target.id != "form_login") {
	    e.preventDefault();
	    //};

	    // $("#pinButton").click(function () {

	    var pin = $("#inputPin").val();

	    $("#inputPin").val("");

	    chrome.storage.local.get(["passphrase"], function (data)  {
		var decrypted = CryptoJS.AES.decrypt(data.passphrase, pin, {format: JsonFormatter});
		try {
		    var decrypted_passphrase = decrypted.toString(CryptoJS.enc.Utf8);

		    console.log(decrypted_passphrase.length);

		    if (decrypted_passphrase.length > 0) {
			$('#pinsplashformerror').html("");
			$("#pinsplash").hide();
			$(".hideEncrypted").hide();

			$("#priceBox").show();

			existingPassphrase(decrypted.toString(CryptoJS.enc.Utf8));

		    } else {
			$('#pinsplashformerror').html("Invalid password");
		    }
		} catch (err) {
		    $('#pinsplashformerror').html("Invalid password");
		}
	    });
	//}
    });

    $('#myTab a').click(function (e) {
	e.preventDefault();
	$(this).tab('show');
    });

    $("#walletaddresses").change(function () {
	$("#btcbalance").html("<div style='font-size: 12px;'>Thinking...</div>");
	var addr = $(this).val();
	$(".addressselect").attr("title", addr);
	if (addr == "add") {

//            chrome.storage.local.get(function(data) {
//
//                var addresslabels = data["addressinfo"];

	    //dynamicAddressDropdown(addresslabels);

	    addTotalAddress(dynamicAddressDropdown);

//            }); 

	} else {

	    console.log(addr);
	    $("#displaycurrentkey").html(addr);
	    $('#currentaddressname').html($('#walletaddresses :selected').attr('label'));
	    //    chrome.storage.local.set(
	    //                    {
	    //                        'lastAddress': addr
	    //                    }, function () {

	    $("#xcpaddress").html(addr);
	    reloadContent();
	    //getPrimaryBalance(addr);

//                    });
	}

    });




    $('#yesEncryptButton').click(function () {

	$('#encryptquestion').hide();
	$('#encryptyes').show();
	$('#inputSplashPass').focus();

    });

    $('#setpinatsplash').click(function () {
	//e.preventDefault();
	var password = $("#inputSplashPass").val();
	if (password.length >= 6) {
	    chrome.storage.local.get(["passphrase"], function (data) {
		var encrypted = CryptoJS.AES.encrypt(data.passphrase, password, {format: JsonFormatter});
		chrome.storage.local.set({
			    'passphrase': encrypted,
			    'encrypted': true,
			    'setupdone': true
			}, function () {
			//getStorageSetup();
		    $("#welcomesplash").hide();
		    //$("#tutorial_splash").show();
		    $(".hideEncrypted").hide();
		    $(".bg").css("min-height", "200px");
		    existingPassphrase(data.passphrase);
		});
	    });
	} else {
	    if (isNaN(password)){
		$('#passwordentererror').html('The password cannot be empty');
	    } else {
		$('#passwordentererror').html('The password is too short');
	    }
	}
    });

    $('#encryptyesform').submit(function(e){
	e.preventDefault();
    });
    
    $('#walletyesform').submit(function(e){
	e.preventDefault();
	
	var passphrase = $('#inputSetSplashPassphrase').val();
	//check if valid assphrase
	manualPassphrase(passphrase);
    });
    
    $('#walletnoform').submit(function(e){
	e.preventDefault();
    });
    
    

    $('#setupWalletButton').click(function () {
	$('#walletquestion').show();
	$('#initialsplash').hide();
    });

    $('#yesExistingWallet').click(function () {
	$('#walletquestion').hide();
	$('#walletyes').show();
	$('#inputSetSplashPassphrase').focus();
    });

    $('#noExistingWallet').click(function () {
	newPassphrase();

	$('#walletquestion').hide();
	$('#walletno').show();
    });

    $('#writeDownButton').click(function () {
	$('#walletno').hide();
	$('#encryptquestion').show();
    });



    $('#copyButton').click(function () {

	var address = $("#xcpaddress").html();

	copyToClipboard(address);

	//$('#xcpaddressTitle').hide();
	$('#addresscopied').show();
	setTimeout(function () {
	    $('#addresscopied').hide();
	    //$('#xcpaddressTitle').show();
	}, 1500);

    });

    $('#exportAddresses').click(function () {
	exportAddresses();

    });

    $('#importAddresses').click(function () {

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	    chrome.tabs.executeScript(tabs[0].id, {file: "asset/js/import_addresses.js"}, function () {

		if (chrome.extension.lastError) {
		    var errorMsg = chrome.extension.lastError.message;
		    if (errorMsg == "Cannot access a chrome:// URL") {
			$("#hiddenaddlab").show();
		    }
		}

	    });
	});


    });




    $('#AddressesAndLabels').click(function () {
	$('#AddressesAndLabelsOptions').toggle();

	$('#hiddenaddlab').hide();
    });


//    $('#setpassphraseatsplash').click(function () {
//	
//    });

    $('#noEncryptButton').click(function () {
	chrome.storage.local.set({
	    'firstopen': false,
	    'setupdone': true
	}, function () {
	    $('#encryptquestion').hide();
	    getStorage();
	    $("#welcomesplash").hide();
	    //$("#tutorial_splash").show();

	});
    });
    
    

    $('#assettransactiontoggle').click(function ()
    {
	var currentaddr = $("#xcpaddress").html();
	if ($('#assettransactiontoggle').html() == "View Tokens") {
	    $('#assettransactiontoggle').html("View Token Transaction History");
	    $('#alltransactions').hide();
	    $('#allassets').show();
	     loadAssets(currentaddr);
	} else {
	    $('#assettransactiontoggle').html("View Tokens");
	    $('#alltransactions').show();
	    $('#allassets').hide();
	    
	    loadTransactions(currentaddr);
	}
    });

//    $('.resetAddress').click(function ()
//    {
//	//newPassphrase();
//	chrome.storage.local.clear();
//	location.reload();
//    });

    $('#resetwallet').click(function () {
	$('#resetwalletblock').toggle();
    });
    $('#resetwalletconfirmation').click(function () {
	chrome.storage.local.clear();
	location.reload();
    });
    
    $('#pinresetwallet').click(function () {
	$('#pinresetwalletblock').toggle();
    });
    $('#pinresetwalletconfirmation').click(function () {
	chrome.storage.local.clear();
	location.reload();
    });

    $('#loginsog').click(function () {
	$('#loginsogblock').toggle();
    });

    $('#form_login').submit(function (e) {
	e.preventDefault();
	$('#loginformerror').hide();
	var email = $('#email').val();
	var pwd = $('#password').val();
	if (email && pwd){
	    //next step, check if valid
	    console.log("yeah");
	    var source_html = "https://spellsofgenesis.com/api/";
	    var method = "?get_user_id";
	    var parameter = {login: email, password: pwd}; 
	    $.post(source_html+method, parameter, function (data){
		console.log(data);
		if (data.error){
		    
		    $('#loginformerror').show();
		    $('#loginformerror').html("The email or the password is not correct");
		} else {
		    if (data.user_id){
			//go to next page
			//showBindWallet(email, pwd, data.user_id);
			checkifwalletbind(email, data.user_id, pwd);
		    }
		}
	    }, 'json');
	} else {
	    $('#loginformerror').show();
	    $('#loginformerror').html("The email or the password cannot be empty");
	}
    });


    $('#testaction').click(function(){
//	var source_html = "https://spellsofgenesis.com/api/";
//	var method = "?get_sog_cards ";
//	var parameter = {}; 
//	console.log('test');
//	$.post(source_html+method, parameter, function (data){
//	    console.log(data);
//	    if (data.error){
//		console.log(data);
//	    } else {
//		console.log(data);
//
//	    }
//	}, 'json');

//	var list = $('#walletaddresses > option');
//	$.each(list, function(){
//	    console.log($(this).val());
//	});

	chrome.storage.local.get(function (data) {
		    var totaladdress = data["totaladdress"];
		    console.log(data);
		    //var addresslabels = data["addressinfo"];
//		    for (var i = 0; i < totaladdress; i++) {
//			var derived = HDPrivateKey.derive("m/0'/0/" + i);
//			var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
//			var pubkey = address1.toString();
//			if (pubkey === data.xcp_pubkey){
//			    isSameWallet = true;
//			}
//		    }
		});

//	var address = $("#xcpaddress").html();
//	var source_html = "https://counterpartychain.io/api/balances/" + address + "?description=1";
//	$.getJSON(source_html, function (data) {
//	    console.log(data);
//	});
    });

    $('.addlabbuttons').click(function ()
    {


	$('#AddressesAndLabelsOptions').hide();



    });

    $('.resetFive').click(function ()
    {
	resetFive();
    });

    $('#revealPassphrase').click(function () {
	if ($("#newpassphrase").is(":visible")) {
	    $("#passphrasebox").hide();
	    $("#revealPassphrase").html("Reveal Passphrase");
	} else {
	    chrome.storage.local.get(["encrypted"], function (data) {
		if (data.encrypted === true) {
		    $("#passphrasepin").show();
		} else {
		    $("#passphrasebox").show();
		    $("#revealPassphrase").html("Hide Passphrase");
		}
	    });  
	}
    });
    
    $('#passphrasepinform').submit(function (e) {
	e.preventDefault();
	var pin = $("#passphrasepinInput").val();
	$("#passphrasepinInput").val("");
	chrome.storage.local.get(["passphrase"], function (data)  {
	    var decrypted = CryptoJS.AES.decrypt(data.passphrase, pin, {format: JsonFormatter});
	    try {
		var decrypted_passphrase = decrypted.toString(CryptoJS.enc.Utf8);
		console.log(decrypted_passphrase.length);
		if (decrypted_passphrase.length > 0) {
		    $('#passphrasepinformerror').html("");
		    $("#passphrasepin").hide();
		    $("#passphrasebox").show();
		    $("#revealPassphrase").html("Hide Passphrase");
		} else {
		    $('#passphrasepinformerror').html("Invalid password");
		}
	    } catch (err) {
		$('#passphrasepinformerror').html("Invalid password");
	    }
	});
    });

    $('#manualPassphrase').click(function ()
    {
	if ($("#manualPassBox").is(":visible")) {
	    $("#manualPassBox").hide();
	    //$("#revealPassphrase").html("Reveal Passphrase");
	} else {
	    $("#manualPassBox").show();
	    //$("#newpassphrase").hide();
	    //$("#revealPassphrase").html("Hide Passphrase");
	}
    });

    $('#encryptPassphrase').click(function ()
    {
	if ($("#encryptPassphraseBox").is(":visible")) {
	    $("#encryptPassphraseBox").hide();
	    //$("#revealPassphrase").html("Reveal Passphrase");
	} else {
	    $("#encryptPassphraseBox").show();
	    //$("#newpassphrase").hide();
	    //$("#revealPassphrase").html("Hide Passphrase");
	}
    });

    $('#sendAssetButton').click(function () {
	$("#btcsendbox").toggle();
	if ($("#moreBTCinfo").is(":visible")) {
	    $("#moreBTCinfo").hide();
	}
    });

    $('#manualAddressButton').click(function ()
    {
	var passphrase = $('#manualMnemonic').val();
	$('#manualMnemonic').val("");
	manualPassphrase(passphrase);
    });

    $(document).on("click", '#depositBTC', function (event)
    {
	if ($("#btcsendbox").is(":visible")) {
	    $("#btcsendbox").hide();
	}


	if ($("#moreBTCinfo").length) {

	    $("#moreBTCinfo").toggle();



	} else {

	    var currentaddr = $("#xcpaddress").html();
	    $("#btcbalance").append("<div id='moreBTCinfo'><div style='margin: 20px 0 10px 0; font-size: 10px; font-weight: bold;'>" + currentaddr + "</div><div id='btcqr' style='margin: 10px auto 20px auto; height: 100px; width: 100px;'></div><div>Cost per transaction is 0.0001547 BTC</div></div>");
	    var qrcode = new QRCode(document.getElementById("btcqr"), {
		text: currentaddr,
		width: 100,
		height: 100,
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.H
	    });
	}
    });


    $(document).on("click", '#saveLabelButton', function (event)
    {

	var newlabel = $("#newPocketLabel").val();

	var labelfixed = newlabel.replace(/'/g, '');

	insertAddressLabel(labelfixed, dynamicAddressDropdown);

    });

    $(document).on("click", '#newLabelButton', function (event){
	var currentlabel = $('#walletaddresses option:selected').attr('label');
	$("#newPocketLabel").val(currentlabel); //.slice(0, -18)
	$("#addresslabeledit").toggle();
	$("#pocketdropdown").toggle();

    });
    
    $(document).on("click", '#saveLabelButtonCancel', function (event) {
	$("#addresslabeledit").toggle();
	$("#pocketdropdown").toggle();

    });


    $(document).on("click", '#helpButton', function (event)
    {
	var ontab = $("ul#allTabs li.active a#walletLink").html();

	if (ontab !== undefined) {

	    $("#btcsendbox").hide();
	    $("#moreBTCinfo").hide();
	    //$("#tutorial_splash").show();

	}
    });



    $(document).on("click", '.tokenlistingheader', function (event)
    {

	$(".tokenlistingbody").remove();
    });

    $(document).on("click", '.swapbotselect', function (event)
    {
	console.log($(this).data("url"));


	chrome.tabs.create({url: $(this).data("url")});
	return false;
    });

    $(document).on("click", '.tokenlisting', function (event)
    {

	var currenttoken = $(this).data("token");

	if ($("div:contains('" + currenttoken + " Swapbots')").length) {

	    $(".tokenlistingbody").remove();

	} else {

	    if ($('.tokenlistingbody').length) {

		$(".tokenlistingbody").remove();

	    }

	    var row = $(this).closest('tr');

	    $("<tr class='tokenlistingbody' style='background-color: #2EA1CC;'><td colspan='3'><div class='lead' style='text-align: center; width: 100%; color: #fff; margin: 17px 0 0 0; padding: 3px; font-size: 24px;'>" + currenttoken + " Swapbots</div><div class='swaplistbody' style='width: 100%; margin: auto; text-align: center;'><div style='padding: 20px; color: #fff;'>Loading...</div></div></td></tr>").insertAfter(row);


	    loadSwaplist(currenttoken);


	}

    });

    $(document).on("click", '#refreshWallet', function (event)
    {
	$("#currenttoken-pending").html("");

	$("#ltbDirectorySearchResults").html("");
	$("#ltbUserSearch").val("");
	//$("#searchLTBuser").text("Search");

	$("#freezeUnconfirmed").css("display", "none");
	$("#mainDisplay").css("display", "block");

	//$("#sendtokenbutton").html("Send Token");
	$("#sendtokenbutton").prop('disabled', true);
	$("#sendtoaddress").prop('disabled', false);
	$("#sendtoamount").prop('disabled', true);

	$("#sendtoaddress").val("");
	$("#sendtoamount").val("");
	$(".sendlabel").html("");
	
	$("#sendtokenerroraddress").html("");
	$("#sendtokenerroramount").html("");

	var assetbalance = $("#xcpbalance").html();
	var array = assetbalance.split(" ");


	var pubkey = $("#xcpaddress").html();
	var currenttoken = $(".currenttoken").html();

	$("#sendtokenbutton").html("Send " + currenttoken);

	getRate(array[0], pubkey, currenttoken);

	getPrimaryBalance(pubkey);

	currenttokenpending(currenttoken);
    });

    $('#switchtoxcp').click(function ()
    {
	$("#currenttoken-pending").html("");
	$(".currenttoken").html("BITCRYSTALS");
	$("#sendtokenbutton").html("Send BITCRYSTALS");
	var pubkey = $("#xcpaddress").html();
	getPrimaryBalance(pubkey);
	$('#allTabs a:first').tab('show');
    });


//  $('#txHistory').click(function ()
//  {
//    var address = $("#xcpaddress").html();
//    chrome.tabs.create(
//    {
//      url: "http://blockscan.com/address/" + address
//    });
//  });

    $('#contact').click(function ()
    {
	chrome.tabs.create({url: "mailto:support@letstalkbitcoin.com"});
    });


    $('#refresharrow').click(function ()
    {
	var pubkey = $("#xcpaddress").html();
	getPrimaryBalance(pubkey);
    });


    $(document).on("click", '.movetowallet', function (event)
    {
	$("#currenttoken-pending").html("");
	var temp = $(this).parent().parent();
	var assetdata = temp.prev();
	var $assetdiv;
	if (assetdata.hasClass('assetdata')){
	    $assetdiv = assetdata.find('.assetname');
	} else {
	    $assetdiv = $(this).prev();
	}
	var isnumeric = $assetdiv.data("numeric");

	if (isnumeric != undefined) {

	    var currentasset = isnumeric;

	    var enhancedassetfullname = $assetdiv.html();

//          if (enhancedassetfullname.length > 24) {
//          
//            var enhancedassetname = enhancedassetfullname.substr(0, 24) + "...";
//              
//          } else {

	    var enhancedassetname = enhancedassetfullname;

//          }      

	    $("#xcpbalance").data("enhanced", enhancedassetname);

	    $("#sendtokenbutton").html("Send");

	} else {

	    var currentasset = $assetdiv.html();

	    $("#sendtokenbutton").html("Send " + currentasset);

	}

	$(".currenttoken").html(currentasset);

	var qtypending = $("." + currentasset + "-pending").html();

	$("#currenttoken-pending").html(qtypending);

	//$(".currenttoken").html("WORKS");



	var pubkey = $("#xcpaddress").html();


	getPrimaryBalance(pubkey);




	$('#allTabs a:first').tab('show');

    });




    $(document).on("click", '.movetosend', function (event)
    {

	var sendaddress = $(this).text();

	var username = $(this).data("user");

	$("#sendtoaddress").val(sendaddress);

	$(".sendlabel").html(username);

	$("#btcsendbox").show();
	$("#moreBTCinfo").hide();

	$('#allTabs a:first').tab('show');

    });

    $(document).on("click", '.movetosendFundDev', function (event)
    {

	$("#currenttoken-pending").html("");

	var currentasset = $(this).data("token");
	var title = $(this).data("title");
	$(".currenttoken").html(currentasset);

	var qtypending = $("." + currentasset + "-pending").html();

	$("#currenttoken-pending").html(qtypending);

	//$(".currenttoken").html("WORKS");

	$("#sendtokenbutton").html("Send " + currentasset);

	var pubkey = $("#xcpaddress").html();

	//var pubkey = FindAsset(currentasset);

	$(".sendlabel").html(title);

	getPrimaryBalance(pubkey);

	var sendaddress = $(this).data("address");

	$("#sendtoaddress").val(sendaddress);

	$("#btcsendbox").show();
	$("#moreBTCinfo").hide();



	$('#allTabs a:first').tab('show');

    });



    $('#inventoryTab').click(function () {
	var address = $("#xcpaddress").html();
	//$("#alltransactions").hide();
	if ($('#assettransactiontoggle').html() == "View Tokens") {
	    loadTransactions(address);
	} else {
	    loadAssets(address);
	}
    });
    
    $('#gameTab').click(function (){
	$("#cardGrid").html("<div class='grid-sizer'></div>");
	$('.sort-by-button-group').children().removeClass('active');
	$('#defaultbtn').addClass('active');
	var grid = Isotope.data('#cardGrid');
	
	//var grid = $('#cardGrid').data('isotope');
	if (grid != null){
	    console.log(grid);
	    $('#cardGrid').unbind('click');
	    grid.destroy();
	}
	getUserCards(); 
    });

    $("#ltbUserSearch").keyup(function (event) {
	if (event.keyCode == 13) {
	    var search_input = $("#ltbUserSearch").val();

	    searchLTBuser(search_input);
	}
    });

    $('#searchLTBuser').click(function () {

	var search_input = $("#ltbUserSearch").val();

	searchLTBuser(search_input);

    });


    $('#newsApp').click(function () {

	getNews();

    });


    $(document).on('click', '#toolsTab', function () {
	var $link = $('li.active a[data-toggle="tab"]');
	$link.parent().removeClass('active');
	var tabLink = $link.attr('href');
	$('#allTabs a[href="' + tabLink + '"]').tab('show');

	loadAddresslist();
    });


    $('#encryptPassphraseBoxform').submit(function(e){
	e.preventDefault();
	chrome.storage.local.get(["passphrase"], function (data) {
	    $('#encryptPassphraseBoxError').html();
	    var password = $("#encryptPassword").val();
	    $("#encryptPassword").val("");
	    if (password.length >= 6) {
		var encrypted = CryptoJS.AES.encrypt(data.passphrase, password, {format: JsonFormatter});
		chrome.storage.local.set({
			    'passphrase': encrypted,
			    'encrypted': true
			}, function () {
		    $(".hideEncrypted").hide();
		});
	    } else {
		$('#encryptPassphraseBoxError').html("The password must contain at least 6 char.");
	    }

	});
    });


    $('.signMessageButton').click(function ()
    {
	var inputaddr = $("#signPubAddress").val();
	var inputpassphrase = $("#newpassphrase").html();
	var message = $("#messagetosign").val();

	var privkey = getprivkey(inputaddr, inputpassphrase);
	var signed = signwith(privkey, inputaddr, message);


	if ($(this).hasClass("copy")) {
	    copyToClipboard(signed);
	}

	$("#postSign").html(signed);

	$("#postSign").show();
	$("#resetsignbox").show();

	$("#preSign").hide();

    });

    $('#resetSignButton').click(function ()
    {
	$("#messagetosign").val("");
	$("#resetsignbox").hide();
	$("#postSign").hide();

	$("#preSign").show();
    });

//    $('#sendtokenbutton').click(function () {
//	
//    });
    
    $('#btcsendboxform').submit(function(e){
	e.preventDefault();
	
	$('#sendtokenerroramount').html("");
	$('#sendtokenerroraddress').html("");
	sendtokenaction();
    });

    $(document).on("keyup", '#sendtoaddress', function (event) {
	//if (isAdressValid()) {
	$('#sendtoamount').prop('disabled', false);
	//} else {
	//$('#sendtoamount').prop('disabled', true);
	//}
	$(".sendlabel").html("");
    });
    
    $(document).on("keyup", '#inputSplashPass', function(event){
	var password = $("#inputSplashPass").val();
	//console.log(password.length);
	if (password.length >= 6) {
	    console.log(password.length);
	    $('#setpinatsplash').prop('disabled', false);
	} else {
	    $('#setpinatsplash').prop('disabled', true);
	}
    });


    $(document).on("keyup mouseup", '#sendtoamount', function (event) {
	   //console.log("event");
	var sendamount = parseFloat($("#sendtoamount").val());
	
	if (!isNaN(sendamount) && sendamount > 0) {
	    //console.log("event 2");
	    var currenttoken = $(".currenttoken").html();

	    if (currenttoken == "BTC") {
		var currentbalance = parseFloat($("#btcbalhide").html());
	    } else {
		var currentbalance = parseFloat($("#assetbalhide").html());
	    }

	    //console.log(sendamount);
	    //console.log(currentbalance);

	    if (sendamount > currentbalance) {
		$('#sendtokenbutton').prop('disabled', true);
		$("#sendtokenerroramount").html("Insufficient Funds");
	    } else {
		$("#sendtokenbutton").removeAttr("disabled");
		$("#sendtokenerroramount").html("");
	    }


	    if (currenttoken == "BTC") {

		if (isNaN(sendamount) == false && $("#sendtoamount").filter(function () {
		    return $(this).val();
		}).length > 0) {

		    var ltbtousd = $("#ltbPrice").data("btc").price;
		    var sendinusd = sendamount / parseFloat(ltbtousd);

		    $("#sendUSD").html("($" + sendinusd.toFixed(2) + ")");

		} else {

		    $("#sendUSD").html("");
		}

	    } else {

		$("#sendUSD").html("");

	    }
	} else {
	    $('#sendtokenbutton').prop('disabled', true);
	    $("#sendtokenerroramount").html("");
	}

    });

//    $(document).on("click", '.primarytokenoption', function (event) {  
//        
//        var clickedtoken = $(this).html();
//        
//        $(".currentprimarytoken").html(clickedtoken);
//        
//        $("#currenttoken").html(clickedtoken);
//        
//    });
//    
    $('#ExchangeRateApp').click(function () {

	getExchangeRatesList();

    });


    $('#FundDevApp').click(function () {

	loadFeatureRequests();


    });


    $('#hideshowpass').click(function () {

	var status = $('#hideshowpass').html();

	if (status == "Hide Passphrase") {

	    $('#hideshowpass').html("Show Passphrase");

	    $('#inputSetSplashPassphrase').prop('type', 'password');

	} else {

	    $('#hideshowpass').html("Hide Passphrase");

	    $('#inputSetSplashPassphrase').prop('type', 'text');

	}

    });


    $('#hideshowpassSettings').click(function () {

	var status = $('#hideshowpassSettings').html();

	if (status == "Hide") {

	    $('#hideshowpassSettings').html("Show");

	    $('#manualMnemonic').prop('type', 'password');

	} else {

	    $('#hideshowpassSettings').html("Hide");

	    $('#manualMnemonic').prop('type', 'text');

	}

    });

    $('#chainsobutton').click(function ()
    {
	var state = $('#turnoffchainso').html();



	if (state == "Disable Chain.so Token Detection") {

	    var detect = "no";

	    chrome.storage.local.set(
		    {
			'chainso_detect': detect
		    }, function () {

		$('#turnoffchainso').html("Enable Chain.so Token Detection");

	    });


	} else {

	    var detect = "yes";

	    chrome.storage.local.set(
		    {
			'chainso_detect': detect
		    }, function () {

		$('#turnoffchainso').html("Disable Chain.so Token Detection");

	    });

	}
    });

//loadSwapbots();

//loadFeatureRequests();

   
    

});