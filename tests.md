# Test Procedures

Below are a list of tests as physical steps because code tests would be difficult in these cases

### Test import

1. Import a CA from the testCerts folder
2. Check that the cert is listed by it's issuer in the CA view
3. Import the same cert again
4. It should reject the certificate
5. Import nonCA and it should be rejected because it isn't a CA certificate