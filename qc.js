$ui.render({
	props: {
		title: "质控样查询"
	},
	views: [
    {
		type: "input",
		props: {
        placeholder: "ph|铜"
		},
		layout: function(make) {
			make.top.left.right.inset(10);
			make.height.equalTo(32);
		},
		events: {
			returned: function(sender) {
				sender.blur();
				$ui.loading(true);
				getRaw(sender.text);
				sender.text = "";
			}	
		}	
    },   
    {
		type: "list",
		props: {
			actions: [
				{
					title: "delete",
					handler: function(sender, indexPath) {
						//deleteItem(indexPath);
					}
				}
			]
		},
		layout: function(make) {
			make.left.bottom.right.equalTo(0);
			make.top.equalTo($("input").bottom).offset(10);
		},
		events: {
			didSelect: function(sender, indexPath, data) {
				uipush(data);
			},
			dealloc: function() {
				$cache.clear();
            }			
		}
    }
	]
});

var listView = $("list");

function insertItem(text) {
	listView.insert({
		index: 0,
		value: text
	});
}

function getRaw(keyword){
	$http.get({
		url: "https://gitee.com/suplxc/getqcpy/raw/master/zhikong.txt",
//"https://raw.githubusercontent.com/lgxnas/getqcpy/master/zhikong.txt",
		handler: function(resp){
			$cache.set("raw",resp.data);
			$ui.loading(false);
			listView.data=[];
			showqc(keyword,resp.data);
		}
	});
}

function showqc(keyword,txt){
	var array_txt;
	if(keyword==''){
		array_txt=txt.match(/.+/gm);
	}else{
		var re=new RegExp('(.+)?('+keyword+').+','gmi');
		array_txt=txt.match(re);
	}
	if(array_txt===null){
		$ui.alert("没有找到关键字数据");
	}else{
		array_txt=array_txt.sort();
		for(var i=0;i<array_txt.length;i++){
			var array_td=array_txt[i].split("|");
			insertItem(array_td[0]+"|"+array_td[1]+"|"+array_td[3]+"|"+array_td[4]);
		}
	}
}

function uipush(data){
	var id=data.split("|")[1];
	var re=new RegExp('(.+)?('+id+').+','gmi');
	var detailed=$cache.get("raw").match(re)[0].split("|");
	var c=detailed[3].replace(/\s+/g,"");
	c=c.replace(/L/g,"L\n\t");
	c=c.replace(/m$/g,"m\n");
	if(!isNaN(c)){
		c=c+"\n";
	}
	var txt= "\n样品名称:" + detailed[0] + "\n\n编号:" + id + "\n\n国标号:" + detailed[2] + "\n\n浓度:" + c + "\n有效期:\t" + detailed[4] + "\n\n更新日期:" + detailed[5];
	$ui.push({
		props: {
			title: id
		},
		views: [
			{
				type: "text",
				props: {
					text: txt
				},
				layout: $layout.fill,
				events: {
					tapped: function(sender){
						$share.sheet(sender.text);
					}
				}
			}
		],
	});
}

