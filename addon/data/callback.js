//js from front end to backend
function insert_cert(num){
	self.port.emit("insert_cert");
}

function export_certs(){
	self.port.emit("export_certs");
}


document.getElementById('import').onclick = function(){insert_cert()}; 
exportFunction(insert_cert,unsafeWindow,{defineAs: "insert_cert"});

document.getElementById('export').onclick = function(){export_certs()};
exportFunction(export_certs,unsafeWindow,{defineAs: "export_certs"});