import path from 'path'
import merge from 'lodash/merge'

const requireProcessEnv = (name) => {
	if (!process.env[name]) {
		throw new Error('You must set the ' + name + ' environment variable')
	}
	return process.env[name]
}

const config = {
	all: {
		env: process.env.NODE_ENV || 'develop',
		root: path.join(__dirname, '..'),
		port: 9004,
		ip: process.env.IP || '0.0.0.0',
		apiRoot: ''
	},
    develop: {
        port: 9004,
        apiRoot: ''
	},
    USBANK_DEV: {
		port: 9004,
	},
	US_UAT: {
		port: 9004
	},
	US_QC: {
		port: 9004
	}
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
