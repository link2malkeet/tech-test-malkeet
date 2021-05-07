import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

process.env.NODE_ENV = 'DEVELOPMENT'

chai.should()
chai.use(sinonChai)
chai.use(chaiAsPromised)
