import csv
import json

pendingCertsPath = 'Pending CA Certificate Requests - Sheet1.csv'
builtInCertsPath = 'BuiltInCAs - Sheet1.csv'

pendingCertsFile = file(pendingCertsPath, 'r')
builtInCertsFile = file(builtInCertsPath, 'r')

pendingCertsOutput = 'outputPending.txt'
builtInCertsOutput = 'outputBuiltIn.txt'

# Gets: 
# - certificate issuer organization 
# - trust bits
# - geographic focus
# - standard audit statement date
def getPendingCerts():
	output = open(pendingCertsOutput, 'w')
	reader = csv.reader(pendingCertsFile)
	salesforceJson = {}

	for row in reader:	
		salesforceJson[row[1]] = {}
		salesforceJson[row[1]]['trustBits'] = row[11]
		salesforceJson[row[1]]['geographicFocus'] = row[17]
		salesforceJson[row[1]]['auditDate'] = row[26]

	output.write(json.dumps(salesforceJson, indent=2))

# Gets: 
# - certificate issuer organization 
# - trust bits
# - standard audit statement date
def getBuiltInCerts():
	output = open(builtInCertsOutput, 'w')
	reader = csv.reader(builtInCertsFile)
	salesforceJson = {}

	for row in reader:	
		salesforceJson[row[1]] = {}
		salesforceJson[row[1]]['trustBits'] = row[9]
		salesforceJson[row[1]]['auditDate'] = row[24]

	output.write(json.dumps(salesforceJson, indent=2))

def main():
	getPendingCerts()
	getBuiltInCerts()

if __name__ == '__main__': 
	main()