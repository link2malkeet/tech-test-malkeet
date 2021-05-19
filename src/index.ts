import express from 'express';
import { USERS } from './userLogins';
const app = express()
const port = 3000
app.use(express.json())
app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });
/**
 * One thing: Authentication
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const basicAuthHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorization = req['headers'].authorization
  if (!authorization) {
    return res.status(400).send('Bad Request: Missing authorization header');
  }
  if (authorization.indexOf('Basic') <= -1) {
    return res.status(400).send('Bad Request: Missing authorization header');
  }
  const auth = req['headers'].authorization?.substring(6);
  const decodedAuth = Buffer.from(auth!, 'base64').toString('ascii')
  const userNamePasswordCollection = decodedAuth.split(":")
  if(userNamePasswordCollection.length !== 2) {
    return res.status(400).send('Bad Request: Username and Password is not given');
  }
  const validUser = USERS.users.find(user => user.userLogin === userNamePasswordCollection[0] && user.password === userNamePasswordCollection[1])
  // need to add condition here to check user is authenticated or not
  if (!validUser) {
    res.set('WWW-Authenticate', 'Basic realm="tech-test-3"')
    res.status(401).send('Authentication required')
  }
  next()
}
app.get('/basic-auth', basicAuthHandler, (req: express.Request, res: express.Response) => {
  res.status(200).end();
})
export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})