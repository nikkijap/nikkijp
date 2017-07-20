function transTrad() {
	var myClothesSimp = document.getElementById("myClothesSimp").value;
	var myClothesTrad = $("#myClothesSimp").val()
	myClothesTrad = myClothesTrad.replace("发型","髮型").replace("连衣裙","連身裙").replace("上装","上衣").replace("下装","下著").replace("袜子","襪子").replace("饰品","飾品").replace("妆容","妝容").replace("萤光之灵","螢光之靈")
	$("#myClothesTrad").val(myClothesTrad);
}

function transSimp() {
	var myClothesTrad = document.getElementById("myClothesTrad").value;
	var myClothesSimp = $("#myClothesTrad").val()
	myClothesSimp = myClothesSimp.replace("髮型","发型").replace("連身裙","连衣裙").replace("上衣","上装").replace("下著","下装").replace("襪子","袜子").replace("飾品","饰品").replace("妝容","妆容").replace("螢光之靈","萤光之灵")
	$("#myClothesSimp").val(myClothesSimp);
}

function exportCustomInventory() {
	var $link = $("#clothesDownload");
	var blob = new Blob([$("#myClothesSimp").val()], 
		{ type:"application/octect-stream" });
	var blobUrl = URL.createObjectURL(blob);
	var fileName = "clothes.txt";
	$link.attr({ href: blobUrl, download: fileName })
		.text(fileName).removeClass("revoke");
}

function transTraditional() {
	var $link = $("#clothesDownloadTraditional");
	var blob = new Blob([$("#myClothesTrad").val()], 
		{ type:"application/octect-stream" });
	var blobUrl = URL.createObjectURL(blob);
	var fileName = "clothes(繁).txt";
	$link.attr({ href: blobUrl, download: fileName })
		.text(fileName).removeClass("revoke");
}
