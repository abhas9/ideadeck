(function() {
	var btn='', a=document;
	function s() {
		var b,c;
		if(a.readyState!='interactive'||!a.getElementsByClassName||!window.XMLHttpRequest) {
			console.log('returning');
			return;
		}
		a.forms[0].onsubmit = d;
		b=a.getElementsByClassName('s')
		for(c=0;c<b.length;c++) {
			b[c].onclick=function(evt) {
				btn=this;
			}
		}
	}
	function d(e) {
		if(!btn) {
			return;
		}
		var b,c,f,i,p={},x;
		b=btn.getAttribute('data-field');
		if(b) {
			c=a.forms[0][b];
			c=c?(!c.length?[c]:c):[];
			p[b]=[];
			for(i=0;i<c.length;i++) {
				f=c[i].type==='checkbox'?(c[i].checked?c[i].value:''):c[i].value;
				if(f) {
					p[b].push(f);
				}
			}
		}
		p[btn.name]=btn.name;
		c=btn;
		x=new XMLHttpRequest
		x.onreadystatechange=function(){
			if(this.readyState===4&&this.status===200){
				if(this.getResponseHeader('Content-Type').split(';')[0]==='text/html'){
					b=a.getElementById(c.getAttribute('data-target'));
					b=b?b:c.parentNode;
					b.innerHTML=this.responseText;
				}else{
					//error json???
					console.log('ignoring json response over ajax:::\n', this.responseText);
				}
			}

		};
		x.open('POST','try',true);
		x.setRequestHeader("Content-type", "application/json");
		x.send(JSON.stringify(p));

		btn=undefined;
		e.preventDefault();
	}
	a.onreadystatechange=s;
})();