//js from front end to backend
function insert_cert(num){
	self.port.emit("insert_cert");
}


document.getElementById('import').onclick = function(){insert_cert()}; 
exportFunction(insert_cert,unsafeWindow,{defineAs: "insert_cert"});