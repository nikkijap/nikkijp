function showStrategy(){
	if (!$("#StrategyInfo").is(':visible')) return;
	
	if(uiFilter["toulan"]){
		lanStrategy();
		return;
	}
	var rescnt=stgy_rescnt;

	var $strategy = $("<div/>").addClass("strategy_info_div");
		
	var theme = allThemes[$("#theme").val()];
	var filters = clone(criteria);
	filters.own = true;
	filters.missing = true;
	
	var $title = p($("#theme").val() == "custom" ? "....." : $("#theme").val(),"title");
	$strategy.append($title);
	
	var $author = p("配裝器一鍵攻略@莫默墨陌", "author");
	$author.append("<br/>衣櫃對比mod /Rean");
	$strategy.append($author);
	
	var $skill_title = p("技能: ", "skill_title");
	$strategy.append($skill_title);
	
	if($("#skillInfo").text()){
		var $skill_ops = p($("#skillInfo").text().replace("公主", "        公主"), "skill_ops");
		$strategy.append($skill_ops);
	}
	else if($("#theme").val().indexOf("競技場") < 0) {
		var $skill_ops = p("對手技能: ", "skill_ops");
		$strategy.append($skill_ops);		
	}
	
	var $skill_my = p("推薦攜帶: ", "skill_my");
	if($("#theme").val().indexOf("競技場") >= 0){
		$skill_my = p("推薦攜帶: 微笑 飛吻 挑剔 沉睡", "skill_my");
	}
	$strategy.append($skill_my);
	
	var $criteria_title = p("屬性-" + (uiFilter["balance"] ? "均衡權重" : "真實權重") + ": ", "criteria_title");
	$strategy.append($criteria_title);
	
	var $criteria = p(getStrCriteria(filters),"criteria");
	$strategy.append($criteria);
	
	var $tag = p(getstrTag(filters), "tag");
	$strategy.append($tag);
	
	if($("#hintInfo").text()){
		var $hint = p($("#hintInfo").text().replace("過關提示:",""), "hint", "過關提示: ", "hint_tiele");
		$strategy.append($hint);
	}
	else if($("#theme").val().indexOf("競技場") < 0 && $("#theme").val().indexOf("聯盟委託") < 0){
		var $hint = p("本關暫無過關提示, 若出現F, 請參考失敗後大喵的衣服提示, 或不穿外套進行嘗試", "hint", "過關提示: ", "hint_tiele");
		$strategy.append($hint);
	}
	if($("#categoryFInfo").text()){
		var $F = p($("#categoryFInfo").text().replace("","").replace("會導致", "  |  會導致"), "hint", "", "");
		// $strategy.append($F);
	}
	
	$strategy.append('<p>')
	var $clotheslist_title = pspan("推薦搭配: ", "clotheslist_title");
	$strategy.append($clotheslist_title);
	$strategy.append(pspan("(顯示"+rescnt+"件)", "clothes"));
	$strategy.append('<button class="btn btn-xs btn-default" onclick="addonekey()">＋</button><button class="btn btn-xs btn-default" onclick="minonekey()">－</button>');
	$strategy.append(' <button class="btn btn-xs btn-default" id="stgy_showall" onclick="onekeyshowall()"></button></p>');
	
	for (var i in CATEGORY_HIERARCHY) {
		if(i == "襪子"){
			filters[CATEGORY_HIERARCHY[i][0]] = true;	
			filters[CATEGORY_HIERARCHY[i][1]] = true;	
		}
		if(i != "飾品"){
			filters[CATEGORY_HIERARCHY[i]] = true;	
		}
		else{
			for (var j in CATEGORY_HIERARCHY[i]) {
				filters[CATEGORY_HIERARCHY[i][j]] = true;
			}			
		}
	}
	
	var result = strat_sortlist(filters,rescnt);
	
	for (var c in category){
		var name = category[c];
		if(name.indexOf("飾品")>=0)
			continue;
		if (result[name]) {
			var categoryContent = $("<p/>");
			categoryContent.append(pspan(name+" : ", "clothes_category"));
			categoryContent.append(getstrClothes_mod(result[name],rescnt));
			if (isGrey(name,result)) categoryContent.addClass("stgy_grey");
			$strategy.append(categoryContent);
			//$strategy.append(p(getstrClothes(result[name]), "clothes", name, "clothes_category"));
		}
	}
	
	$strategy.append(p("————————飾品 (高收集佩戴滿，低收集佩戴9件)————————", "divide"));
		
	for (var c in category){
		var name = category[c];
		if(name.indexOf("飾品")<0)
			continue;
		if (result[name]) {
			var categoryContent = $("<p/>");
			categoryContent.append(pspan(name+" : ", "clothes_category"));
			categoryContent.append(getstrClothes_mod(result[name],rescnt));
			if (isGrey(name,result)) categoryContent.addClass("stgy_grey");
			$strategy.append(categoryContent);
		}
	}

	$author_sign = $("<div/>").addClass("stgy_author_sign_div");
	var d = new Date();
	$author_sign.append(p("nikkiup2u3 One Key Strategy@莫默墨陌", "author_sign_name"));
	$author_sign.append(p("generated at " + (1900+d.getYear()) + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes(), "author_sign_name"));
	$strategy.append($author_sign);
	
	$("#StrategyInfo").empty().append($strategy);
	
	if (stgy_showall){$("#stgy_showall").html('wardrobe');}
	else{$("#stgy_showall").html('showall');}
}

function p(text, cls, text2, cls2){
	var $p = $("<p/>").text(text).addClass("stgy_" + cls);
	if(text2){
		$p.prepend($("<span/>").text(text2).addClass("stgy_" + cls2));
	}
	return $p;
}

function pspan(text, cls, text2, cls2){
	var $p = $("<span/>").text(text).addClass("stgy_" + cls);
	if(text2){
		$p.prepend($("<span/>").text(text2).addClass("stgy_" + cls2));
	}
	return $p;
}

function ifCriteriaHighLow(theme){
	var a,b,c,d,e;
	theme.weight["simple"] >= 0 ? a = theme.weight["simple"] : a = -theme.weight["simple"];
	theme.weight["cute"] >= 0 ? b = theme.weight["cute"] : b = -theme.weight["cute"];
	theme.weight["active"] >= 0 ? c = theme.weight["active"] : c = -theme.weight["active"];
	theme.weight["pure"] >= 0 ? d = theme.weight["pure"] : d = -theme.weight["pure"];
	theme.weight["cool"] >= 0 ? e = theme.weight["cool"] : e = -theme.weight["cool"];
	var avg = (a+b+c+d+e)/5;
	var fangcha = (avg-a)*(avg-a) + (avg-b)*(avg-b) + (avg-c)*(avg-c) + (avg-d)*(avg-d) + (avg-e)*(avg-e);
}

function getStrCriteria(filters){
	var strCriteria = "";
	filters["simple"] >= 0 ? strCriteria += "簡約" : strCriteria += "華麗";
	strCriteria += " : ";
	filters["cute"] >= 0 ? strCriteria += "可愛" : strCriteria += "成熟";
	strCriteria += " : ";
	filters["active"] >= 0 ? strCriteria += "活潑" : strCriteria += "優雅";
	strCriteria += " : ";
	filters["pure"] >= 0 ? strCriteria += "清純" : strCriteria += "性感";
	strCriteria += " : ";
	filters["cool"] >= 0 ? strCriteria += "清涼" : strCriteria += "保暖";
	strCriteria += " ≈ ";
	filters["simple"] >= 0 ? strCriteria += filters["simple"] : strCriteria += -filters["simple"];
	strCriteria += " : ";
	filters["cute"] >= 0 ? strCriteria += filters["cute"] : strCriteria += -filters["cute"];
	strCriteria += " : ";
	filters["active"] >= 0 ? strCriteria += filters["active"] : strCriteria += -filters["active"];
	strCriteria += " : ";
	filters["pure"] >= 0 ? strCriteria += filters["pure"] : strCriteria += -filters["pure"];
	strCriteria += " : ";
	filters["cool"] >= 0 ? strCriteria += filters["cool"] : strCriteria += -filters["cool"];
	
	return strCriteria;
}

function getstrTag(filters){
	var str = "";
	if(filters.bonus && filters.bonus[0] && filters.bonus[0].tagWhitelist){
		str+="本關有TAG[" + filters.bonus[0].tagWhitelist + "]";
		if(filters.bonus[1] && filters.bonus[1].tagWhitelist){
			str+="，[" + filters.bonus[1].tagWhitelist + "]";
		}
	}
	return str;
}

function getstrClothes_orig(result){
	if(result.length == 0)
		return " : 無";
	 var str = " : " + result[0].name + "「" + result[0].sumScore + " " + removeNum(result[0].source) + "」";
	 if(result[1])
		str += " > " + result[1].name + "「" + result[1].sumScore + " " + removeNum(result[1].source) + "」";
	 if(result[2])
		str += " > " + result[2].name + "「" + result[2].sumScore + " " + removeNum(result[2].source) + "」";
	 if(result[3])
		str += " > " + result[3].name + "「" + result[3].sumScore + " " + removeNum(result[3].source) + "」";
	 return str;
}

function getstrClothes_mod(result,rescnt){
	var str="";
	var tmp1="";
	var tmp2="";
	var tmp3="";
	if(result.length == 0){
		tmp1="無";
		str=pspan(tmp1,"clothes");
		return str;
	}else{
		if(!stgy_showall){
			for (j=0;j<rescnt&&result[j];j++){
				if(j>0) {tmp2=(actScore(result[j-1])==actScore(result[j]) ? " = " : " > ");}
				tmp2+= result[j].name + "「" + removeNum(result[j].source) + "」";
				if(result[j].own){
					str=pspan(tmp2,"clothes",tmp1,"clothes_notown");
					return str;
				}else{
					tmp1+=tmp2;
				}
			}
		}else{
			//var isown=false;
			for (j=0;j<rescnt&&result[j];j++){
				if(j>0) {str+=(actScore(result[j-1])==actScore(result[j]) ? " = " : " > ");}
				tmp3 = result[j].name + "「" + removeNum(result[j].source) + "」";
				if(result[j].own) str+=tmp3;
				else str+='<span class="stgy_clothes_notown">'+tmp3+'</span>';
				//if(result[j].own){isown=true;}
				//if(isown){tmp3+=tmp2;}
				//else{tmp1+=tmp2;}
			}
			//str=pspan(tmp3,"clothes",tmp1,"clothes_notown");
			return str;
		}
	}
	str=pspan(tmp1,"clothes_notown");
	return str;
}

function removeNum(str){
	if(str.indexOf("定")>=0 || str.indexOf("進")>=0) str = str.replace(/[0-9]/g,"");
	str = str.replace(/聯盟·.*/, "聯盟");
	str = str.replace("圖", "圖");
	str = str.replace(/活動·.*/, "活動");
	str = str.replace(/夢境：.*/, "夢境");
	str = str.replace(/儲值·.*/, "儲值");
	str = str.replace(/贈送·.*/, "贈送");
	str = str.replace(/套裝·.*/, "套裝");
	str = str.replace(/兌·.*/, "兌");
	str = str.replace("店·", "");
	str = str.replace("元素重構", "重構");
	return str;
}

function strat_sortlist(filters,rescnt){
	var result = {};
	for (var i in skipCategory) {
		filters[skipCategory[i]] = false;
	}
	for (var i in clothes) {
		if (matches(clothes[i], {}, filters)) {
			clothes[i].calc(filters);
			if (clothes[i].isF) {continue;}
			if (!result[clothes[i].type.type]) {
				result[clothes[i].type.type] = new Object()
				result[clothes[i].type.type][0] = clothes[i];
			} else {
				for (j=0;j<rescnt;j++){
					//compare with [j]
					if(!result[clothes[i].type.type][j] || actScore(clothes[i]) > actScore(result[clothes[i].type.type][j])
						|| (actScore(clothes[i]) >= actScore(result[clothes[i].type.type][j]) && clothes[i].own)
						){
						//lower others ranking
						for (k=rescnt-1;k>j;k--){
							result[clothes[i].type.type][k] = result[clothes[i].type.type][k-1];
						}
						//put current clothes to [j]
						result[clothes[i].type.type][j] = clothes[i];
						break;
					}
				}
			}
		}
	}
	return result;
}

function actScore(obj){
	return (obj.type.mainType=='飾品') ? ( uiFilter["acc9"] ? Math.round(accSumScore(obj,9)) : Math.round(accSumScore(obj,accCateNum))) : obj.sumScore;
}

function isGrey(c,result){
	for (var i in repelCates){
		var sumFirst=0;
		var sumOthers=0;
		if($.inArray(c, repelCates[i])>=0){
			for (var j in repelCates[i]){
				if (j>0) {
					if (result[repelCates[i][j]]&&result[repelCates[i][j]][0]) sumOthers+=actScore(result[repelCates[i][j]][0]);
				}else {
					if (result[repelCates[i][j]]&&result[repelCates[i][j]][0]) sumFirst+=actScore(result[repelCates[i][j]][0]);
				}
			}
			if($.inArray(c, repelCates[i])==0){
				if (sumFirst<sumOthers) return true;
			}else if($.inArray(c, repelCates[i])>0){
				if (sumOthers<sumFirst) return true;
			}
		}
	}
	return false;
}

function initOnekey(){
	$("#onekey").click(function() {
		$("#StrategyInfo").show();
		showStrategy();
		if($("#onekey").text().indexOf('收起')>=0){
			$("#StrategyInfo").hide();
			if(uiFilter["toulan"]) $("#onekey").text("偷懶攻略");
			else $("#onekey").text("一鍵攻略");
		}
		else {
			$("#StrategyInfo").show();
			$("#onekey").text("收起攻略");
		}
	});
}

var stgy_rescnt=4;
var stgy_showall=false;
function addonekey(){
	stgy_rescnt+=1;
	showStrategy();
}
function minonekey(){
	stgy_rescnt=Math.max(1,stgy_rescnt-1);
	showStrategy();
}
function onekeyshowall(){
	if (stgy_showall){stgy_showall=false;}
	else{stgy_showall=true;}
	showStrategy();
}
