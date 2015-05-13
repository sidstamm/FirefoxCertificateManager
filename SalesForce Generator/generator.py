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
		CA = {}
		CA['trustBits'] = row[11]
		CA['geographicFocus'] = row[17]
		CA['auditDate'] = row[26]

		if not salesforceJson.has_key(row[1]):
			salesforceJson[row[1]] = [CA]
		else:
			salesforceJson[row[1]].append(CA)

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
		CA = {}
		CA['trustBits'] = row[9]
		CA['auditDate'] = row[24]

		if not salesforceJson.has_key(row[1]):
			salesforceJson[row[1]] = [CA]	
		else:
			salesforceJson[row[1]].append(CA)

	output.write(json.dumps(salesforceJson, indent=2))

def main():
	getPendingCerts()
	getBuiltInCerts()

if __name__ == '__main__': 
	main()