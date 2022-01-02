/*
var clientCount = 0; 
var myCount = 0;
var theirCount = 0; 

var text = "";
var name = prompt("Please enter your name:", "name");
  if (name == null || name == "") {
    text = "User cancelled the prompt.";
  } else {
    text = name + " is online";
  }
document.getElementById('me').innerHTML += text;
const add = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
} 
const status = await fetch('/send', add);
const name = await response.json(); */

var userName = prompt("Please enter your name");

var total = 0; 
var me = 0;
var connections = [];

$( "#text" ).click(function() {
  document.addEventListener("keydown", 
	function(event) {	
    if (event.keyCode == 13) {
        submit();
    }
});
});


async function submit(){
	const message = document.getElementById('send').value;
	if (message) {
		total++;
		me++;

		var para = document.createElement('p');
		para.setAttribute('class','messages');
		para.innerText = message;
		document.getElementById('me').appendChild(para);

		var blankP = document.createElement('p');
		blankP.setAttribute('class','blank');
		document.getElementById('other').appendChild(blankP);

		document.getElementById('send').value = '';

		// package as JS object
		const data = {message,userName};

		//window.localStorage.setItem(userName, message);
		// change cache capabilities 
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'	
			},
			body: JSON.stringify(data)
		}
		/* why is promise pending with this code
		fetch('/send', options).then(response => {
			const data = response.json();
			console.log(data);
		});
		*/
		// await is like the THEN and async is the PROMISE in above notation
		const response = await fetch('/send', options);
		const print = await response.json();
		console.log(print);
	}
}


async function poll() {
	const response = await fetch('/poll', {headers: {'clientNum' : me}});
	
  	if (response.status != 200) {
	    // An error - let's show it
	    showMessage(response.statusText);
	    // Reconnect in one second
	    //await new Promise(resolve => setTimeout(resolve, 1000));
  	} 
  	else {
  		const data = await response.json();
  		//updatePost(otherMessCount,totalMess); 
  		if (data.length != 0) {
			for (i in data){
				/*
				const card = document.createElement('div')
        		card.setAttribute('class', 'messVisual')

		        const p = document.createElement('p')
		        p.textContent = data[i].name + ': ' +  data[i].message;

		        client2.appendChild(card) 
		        card.appendChild(p)
				*/

				blankP = document.createElement('p');
				blankP.setAttribute('class','blank');

				var p = document.createElement('p');
				p.setAttribute('class','messages');

				if (data[i].userName.toLowerCase() === userName.toLowerCase()) 
				{
					p.innerText = data[i].message;
					document.getElementById('me').appendChild(p);
					document.getElementById('other').appendChild(blankP);
				}
				else 
				{
					if (connections.includes(data[i].userName)) {
						connections.push(data[i].userName.toLowerCase())

						var div = document.createElement("div");
						div.setAttribute('class','client');
						div.setAttribute('id', "other_" + data[i].userName.toLowerCase());
						
						var div2 = document.createElement("div");
						div2.setAttribute('class','client');
						div2.setAttribute('id', "me_" + data[i].userName.toLowerCase());

						document.getElementById("root").appendChild(div);
						document.getElementById("root").appendChild(div2);
					}
					p.innerText = data[i].userName + ": " + data[i].message;
					document.getElementById('other').appendChild(p);
					document.getElementById('me').appendChild(blankP);
				}
				totalMess = data[i]._id;	 
			}
			me = totalMess;
  		} 
  		setTimeout(poll, 5000);
  	}
}
poll();


