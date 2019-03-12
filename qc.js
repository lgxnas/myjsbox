$ui.render({
	props: {
		title: "质控样查询"
	},
	views: [
    /*{
      type: "spinner",
      props: {
        loading: true
        },
      layout: function(make,view){make.center.equalTo(view.super);}
    },*///指示器
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
				var keyword=$("input").text;
				sender.text = "";
				$ui.loading(true);
				getRaw(keyword);
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
			didSelect: function(sender, indexPath, title) {
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
		url: "https://raw.githubusercontent.com/lgxnas/getqcpy/master/zhikong.txt",
		handler: function(resp){
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
