import csv
import json
import ast
from datetime import datetime

pendingCertsPath = 'Pending CA Certificate Requests - Sheet1.csv'
builtInCertsPath = 'BuiltInCAs2.csv'

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
		cert = {}
		cert['trustBits'] = row[11]
		cert['geographicFocus'] = row[17]
		cert['auditDate'] = row[26]

		if not salesforceJson.has_key(row[1]):
			salesforceJson[row[1]] = [cert]
		else:
			salesforceJson[row[1]].append(cert)

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
		cert = {}
		cert['trustBits'] = row[9]
		cert['auditDate'] = row[25].strip()
		cert['geographicFocus'] = row[17]
		if not salesforceJson.has_key(row[1]):
			salesforceJson[row[1]] = cert	
		else:
			salesforceJson[row[1]] = getMostRecentCert(salesforceJson[row[1]], cert)

	output.write(json.dumps(salesforceJson, indent=2))

def getMostRecentCert(cert1, cert2):
	result = {}
	date1 = None
	date2 = None

	if not cert1['auditDate'] == '':
		date1 = datetime.strptime(cert1['auditDate'], '%Y.%m.%d')

	if not cert2['auditDate'] == '':
		date2 = datetime.strptime(cert2['auditDate'], '%Y.%m.%d')

	bits1 = [x.strip() for x in cert1['trustBits'].split(';')]
	bits2 = [x.strip() for x in cert2['trustBits'].split(';')]
	geo = cert1['geographicFocus']
	bitsUnion = union(bits1, bits2)

	if date1 == None and date2 == None:
		result['auditDate'] = ''
	elif date1 == None:
		result['auditDate'] = date2.strftime('%Y.%m.%d')
	elif date2 == None:
		result['auditDate'] = date1.strftime('%Y.%m.%d')	
	else:	
		result['auditDate'] = max(date1, date2).strftime('%Y.%m.%d')
	result['trustBits'] = '; '.join(bitsUnion)
	result['geographicFocus'] = geo

	return result

def union(a, b):
	return list(set(a) | set(b))

def main():
	# getPendingCerts()
	getBuiltInCerts()

if __name__ == '__main__': 
	main()